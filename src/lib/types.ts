
export type TaskCategory = 'Subject' | 'Project';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  category: TaskCategory;
  parent: string;
  createdAt: number;
  updatedAt: number;
  order: number;
  // New properties
  description?: string;
  link?: string;
  imageUrl?: string;
  tags?: string[];
  priority?: TaskPriority;
  dueDate?: number; // timestamp
  recurring?: {
    enabled: boolean;
    interval: 'daily' | 'weekly' | 'monthly';
    frequency: number; // every X days/weeks/months
  };
}

export interface TaskGroup {
  id: string;
  name: string;
  type: TaskCategory;
  tasks: Task[];
  createdAt: number;
  updatedAt: number;
  order: number;
}

export interface TaskState {
  taskGroups: TaskGroup[];
  filteredTasks?: Task[];
  searchTerm: string;
  statistics: {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    completionPercentage: number;
    todayCompletionPercentage: number;
    upcomingDueTasks: number;
    overdueTasksCount: number;
  };
}
