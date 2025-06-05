
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, TaskGroup, TaskState, TaskCategory, TaskPriority } from './types';
import { isToday, isBefore, addDays, addWeeks, addMonths } from 'date-fns';

interface TaskStore extends TaskState {
  addTaskGroup: (name: string, type: TaskCategory) => void;
  removeTaskGroup: (id: string) => void;
  updateTaskGroupName: (id: string, name: string) => void;
  reorderTaskGroups: (taskGroups: TaskGroup[]) => void;
  
  addTask: (
    title: string, 
    category: TaskCategory, 
    parentId: string,
    options?: {
      description?: string;
      link?: string;
      imageUrl?: string;
      tags?: string[];
      priority?: TaskPriority;
      dueDate?: number;
      recurring?: {
        enabled: boolean;
        interval: 'daily' | 'weekly' | 'monthly';
        frequency: number;
      };
    }
  ) => void;
  removeTask: (taskId: string, parentId: string) => void;
  toggleTaskCompletion: (taskId: string, parentId: string) => void;
  updateTaskTitle: (taskId: string, parentId: string, title: string) => void;
  updateTaskDescription: (taskId: string, parentId: string, description: string) => void;
  updateTaskLink: (taskId: string, parentId: string, link: string) => void;
  updateTaskImage: (taskId: string, parentId: string, imageUrl: string) => void;
  updateTaskTags: (taskId: string, parentId: string, tags: string[]) => void;
  updateTaskPriority: (taskId: string, parentId: string, priority: TaskPriority) => void;
  updateTaskDueDate: (taskId: string, parentId: string, dueDate: number | undefined) => void;
  updateTaskRecurring: (
    taskId: string,
    parentId: string,
    recurring: { enabled: boolean; interval: 'daily' | 'weekly' | 'monthly'; frequency: number; }
  ) => void;
  reorderTasks: (parentId: string, tasks: Task[]) => void;
  
  // Search and filtering
  setSearchTerm: (term: string) => void;
  getFilteredTasks: () => Task[];
  
  // Import/Export
  exportToJSON: () => string;
  importFromJSON: (jsonData: string) => void;
  
  // Process recurring tasks
  processRecurringTasks: () => void;
  
  // Calculate statistics
  updateStatistics: () => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      taskGroups: [],
      searchTerm: '',
      statistics: {
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        completionPercentage: 0,
        todayCompletionPercentage: 0,
        upcomingDueTasks: 0,
        overdueTasksCount: 0,
      },
      
      addTaskGroup: (name, type) => set((state) => {
        const newGroup: TaskGroup = {
          id: crypto.randomUUID(),
          name,
          type,
          tasks: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          order: state.taskGroups.length,
        };
        
        const newState = {
          taskGroups: [...state.taskGroups, newGroup],
        };
        
        setTimeout(() => get().updateStatistics(), 0);
        return newState;
      }),
      
      removeTaskGroup: (id) => set((state) => {
        const newState = {
          taskGroups: state.taskGroups.filter((group) => group.id !== id),
        };
        
        setTimeout(() => get().updateStatistics(), 0);
        return newState;
      }),
      
      updateTaskGroupName: (id, name) => set((state) => ({
        taskGroups: state.taskGroups.map((group) => 
          group.id === id 
            ? { ...group, name, updatedAt: Date.now() } 
            : group
        ),
      })),
      
      reorderTaskGroups: (taskGroups) => set(() => ({
        taskGroups: taskGroups.map((group, index) => ({
          ...group,
          order: index,
        })),
      })),
      
      addTask: (title, category, parentId, options) => set((state) => {
        const newState = {
          taskGroups: state.taskGroups.map((group) => {
            if (group.id === parentId) {
              const tasks = [...group.tasks];
              const newTask: Task = {
                id: crypto.randomUUID(),
                title,
                completed: false,
                category,
                parent: parentId,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                order: tasks.length,
                ...options
              };
              
              return {
                ...group,
                tasks: [...tasks, newTask],
                updatedAt: Date.now(),
              };
            }
            
            return group;
          }),
        };
        
        setTimeout(() => get().updateStatistics(), 0);
        return newState;
      }),
      
      removeTask: (taskId, parentId) => set((state) => {
        const newState = {
          taskGroups: state.taskGroups.map((group) => {
            if (group.id === parentId) {
              return {
                ...group,
                tasks: group.tasks.filter((task) => task.id !== taskId),
                updatedAt: Date.now(),
              };
            }
            
            return group;
          }),
        };
        
        setTimeout(() => get().updateStatistics(), 0);
        return newState;
      }),
      
      toggleTaskCompletion: (taskId, parentId) => set((state) => {
        const newState = {
          taskGroups: state.taskGroups.map((group) => {
            if (group.id === parentId) {
              return {
                ...group,
                tasks: group.tasks.map((task) => {
                  if (task.id === taskId) {
                    const completed = !task.completed;
                    // Handle recurring tasks when completed
                    if (completed && task.recurring && task.recurring.enabled) {
                      // Will create a new task later in processRecurringTasks
                      return { ...task, completed, updatedAt: Date.now() };
                    }
                    return { ...task, completed, updatedAt: Date.now() };
                  }
                  return task;
                }),
                updatedAt: Date.now(),
              };
            }
            
            return group;
          }),
        };
        
        setTimeout(() => {
          get().processRecurringTasks();
          get().updateStatistics();
        }, 0);
        return newState;
      }),
      
      updateTaskTitle: (taskId, parentId, title) => set((state) => ({
        taskGroups: state.taskGroups.map((group) => {
          if (group.id === parentId) {
            return {
              ...group,
              tasks: group.tasks.map((task) => 
                task.id === taskId 
                  ? { ...task, title, updatedAt: Date.now() } 
                  : task
              ),
              updatedAt: Date.now(),
            };
          }
          
          return group;
        }),
      })),
      
      updateTaskDescription: (taskId, parentId, description) => set((state) => ({
        taskGroups: state.taskGroups.map((group) => {
          if (group.id === parentId) {
            return {
              ...group,
              tasks: group.tasks.map((task) => 
                task.id === taskId 
                  ? { ...task, description, updatedAt: Date.now() } 
                  : task
              ),
              updatedAt: Date.now(),
            };
          }
          
          return group;
        }),
      })),
      
      updateTaskLink: (taskId, parentId, link) => set((state) => ({
        taskGroups: state.taskGroups.map((group) => {
          if (group.id === parentId) {
            return {
              ...group,
              tasks: group.tasks.map((task) => 
                task.id === taskId 
                  ? { ...task, link, updatedAt: Date.now() } 
                  : task
              ),
              updatedAt: Date.now(),
            };
          }
          
          return group;
        }),
      })),
      
      updateTaskImage: (taskId, parentId, imageUrl) => set((state) => ({
        taskGroups: state.taskGroups.map((group) => {
          if (group.id === parentId) {
            return {
              ...group,
              tasks: group.tasks.map((task) => 
                task.id === taskId 
                  ? { ...task, imageUrl, updatedAt: Date.now() } 
                  : task
              ),
              updatedAt: Date.now(),
            };
          }
          
          return group;
        }),
      })),
      
      updateTaskTags: (taskId, parentId, tags) => set((state) => ({
        taskGroups: state.taskGroups.map((group) => {
          if (group.id === parentId) {
            return {
              ...group,
              tasks: group.tasks.map((task) => 
                task.id === taskId 
                  ? { ...task, tags, updatedAt: Date.now() } 
                  : task
              ),
              updatedAt: Date.now(),
            };
          }
          
          return group;
        }),
      })),
      
      updateTaskPriority: (taskId, parentId, priority) => set((state) => ({
        taskGroups: state.taskGroups.map((group) => {
          if (group.id === parentId) {
            return {
              ...group,
              tasks: group.tasks.map((task) => 
                task.id === taskId 
                  ? { ...task, priority, updatedAt: Date.now() } 
                  : task
              ),
              updatedAt: Date.now(),
            };
          }
          
          return group;
        }),
      })),
      
      updateTaskDueDate: (taskId, parentId, dueDate) => set((state) => ({
        taskGroups: state.taskGroups.map((group) => {
          if (group.id === parentId) {
            return {
              ...group,
              tasks: group.tasks.map((task) => 
                task.id === taskId 
                  ? { ...task, dueDate, updatedAt: Date.now() } 
                  : task
              ),
              updatedAt: Date.now(),
            };
          }
          
          return group;
        }),
      })),
      
      updateTaskRecurring: (taskId, parentId, recurring) => set((state) => ({
        taskGroups: state.taskGroups.map((group) => {
          if (group.id === parentId) {
            return {
              ...group,
              tasks: group.tasks.map((task) => 
                task.id === taskId 
                  ? { ...task, recurring, updatedAt: Date.now() } 
                  : task
              ),
              updatedAt: Date.now(),
            };
          }
          
          return group;
        }),
      })),
      
      reorderTasks: (parentId, tasks) => set((state) => ({
        taskGroups: state.taskGroups.map((group) => {
          if (group.id === parentId) {
            return {
              ...group,
              tasks: tasks.map((task, index) => ({
                ...task,
                order: index,
              })),
              updatedAt: Date.now(),
            };
          }
          
          return group;
        }),
      })),
      
      setSearchTerm: (searchTerm) => set(() => ({ searchTerm })),
      
      getFilteredTasks: () => {
        const { taskGroups, searchTerm } = get();
        
        if (!searchTerm) {
          return [];
        }
        
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const filteredTasks: Task[] = [];
        
        taskGroups.forEach(group => {
          group.tasks.forEach(task => {
            if (
              task.title.toLowerCase().includes(lowerCaseSearchTerm) ||
              (task.description && task.description.toLowerCase().includes(lowerCaseSearchTerm)) ||
              (task.tags && task.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearchTerm)))
            ) {
              filteredTasks.push(task);
            }
          });
        });
        
        return filteredTasks;
      },
      
      exportToJSON: () => {
        return JSON.stringify({
          taskGroups: get().taskGroups
        });
      },
      
      importFromJSON: (jsonData) => {
        try {
          const parsedData = JSON.parse(jsonData);
          if (parsedData && parsedData.taskGroups) {
            set(() => ({ taskGroups: parsedData.taskGroups }));
            setTimeout(() => get().updateStatistics(), 0);
            return true;
          }
          return false;
        } catch (error) {
          console.error('Error importing JSON:', error);
          return false;
        }
      },
      
      processRecurringTasks: () => set((state) => {
        const now = Date.now();
        let newTasks: { task: Task; parentId: string }[] = [];
        
        state.taskGroups.forEach(group => {
          group.tasks.forEach(task => {
            if (
              task.completed && 
              task.recurring && 
              task.recurring.enabled
            ) {
              let nextDueDate: Date | undefined;
              
              if (task.dueDate) {
                const dueDate = new Date(task.dueDate);
                
                switch (task.recurring.interval) {
                  case 'daily':
                    nextDueDate = addDays(dueDate, task.recurring.frequency);
                    break;
                  case 'weekly':
                    nextDueDate = addWeeks(dueDate, task.recurring.frequency);
                    break;
                  case 'monthly':
                    nextDueDate = addMonths(dueDate, task.recurring.frequency);
                    break;
                  default:
                    break;
                }
              }
              
              // Create a new task based on the completed recurring task
              const newTask: Task = {
                ...task,
                id: crypto.randomUUID(),
                completed: false,
                createdAt: now,
                updatedAt: now,
                dueDate: nextDueDate ? nextDueDate.getTime() : undefined,
              };
              
              newTasks.push({ task: newTask, parentId: group.id });
            }
          });
        });
        
        // If no new recurring tasks, don't update state
        if (newTasks.length === 0) return state;
        
        // Add all new tasks to their respective groups
        const updatedGroups = [...state.taskGroups];
        
        newTasks.forEach(({ task, parentId }) => {
          const groupIndex = updatedGroups.findIndex(g => g.id === parentId);
          if (groupIndex !== -1) {
            updatedGroups[groupIndex] = {
              ...updatedGroups[groupIndex],
              tasks: [...updatedGroups[groupIndex].tasks, task],
              updatedAt: now,
            };
          }
        });
        
        setTimeout(() => get().updateStatistics(), 0);
        return { taskGroups: updatedGroups };
      }),
      
      updateStatistics: () => set((state) => {
        let totalTasks = 0;
        let completedTasks = 0;
        let todayCompletedTasks = 0;
        let todayTotalTasks = 0;
        let upcomingDueTasks = 0;
        let overdueTasksCount = 0;
        
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime();
        const nextWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7).getTime();
        
        state.taskGroups.forEach(group => {
          group.tasks.forEach(task => {
            totalTasks++;
            
            if (task.completed) {
              completedTasks++;
              
              // Check if completed today
              if (task.updatedAt >= today && task.updatedAt < tomorrow) {
                todayCompletedTasks++;
              }
            }
            
            // Count tasks due today
            if (task.dueDate && task.dueDate >= today && task.dueDate < tomorrow) {
              todayTotalTasks++;
              
              if (task.completed) {
                todayCompletedTasks++;
              }
            }
            
            // Count upcoming tasks (next 7 days)
            if (
              task.dueDate && 
              task.dueDate > today && 
              task.dueDate <= nextWeek && 
              !task.completed
            ) {
              upcomingDueTasks++;
            }
            
            // Count overdue tasks
            if (
              task.dueDate && 
              task.dueDate < today && 
              !task.completed
            ) {
              overdueTasksCount++;
            }
          });
        });
        
        const pendingTasks = totalTasks - completedTasks;
        const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        const todayCompletionPercentage = todayTotalTasks > 0 ? (todayCompletedTasks / todayTotalTasks) * 100 : 0;
        
        return {
          statistics: {
            totalTasks,
            completedTasks,
            pendingTasks,
            completionPercentage,
            todayCompletionPercentage,
            upcomingDueTasks,
            overdueTasksCount,
          }
        };
      }),
    }),
    {
      name: 'task-storage',
    }
  )
);
