
import React, { useRef, useState } from 'react';
import { useTaskStore } from '@/lib/taskStore';
import TaskCard from './TaskCard';
import TaskFormDialog from './TaskFormDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TaskCategory, TaskGroup } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { motion, useInView } from 'framer-motion';
import { Edit, Plus, Save, Trash, Search as SearchIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ExportMenu from './ExportMenu';
import SearchBar from './SearchBar';
import StatisticsCard from './StatisticsCard';
import { useToast } from '@/hooks/use-toast';

const TaskBoard: React.FC = () => {
  const {
    taskGroups,
    addTaskGroup,
    removeTaskGroup,
    updateTaskGroupName,
    statistics
  } = useTaskStore();

  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupType, setNewGroupType] = useState<TaskCategory>('Subject');
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editedGroupName, setEditedGroupName] = useState('');
  const [openDialogId, setOpenDialogId] = useState<string | null>(null);
  const { toast } = useToast();

  const taskBoardRef = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newGroupName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a group name",
        variant: "destructive",
      });
      return;
    }
    
    addTaskGroup(newGroupName.trim(), newGroupType);
    setNewGroupName('');
    
    toast({
      title: "Success",
      description: "Task group created successfully",
    });
  };

  const handleEditGroupName = (groupId: string) => {
    const group = taskGroups.find((g) => g.id === groupId);
    if (group) {
      setEditingGroupId(groupId);
      setEditedGroupName(group.name);
    }
  };

  const handleSaveGroupName = (groupId: string) => {
    if (editedGroupName.trim()) {
      updateTaskGroupName(groupId, editedGroupName.trim());
    }
    setEditingGroupId(null);
  };

  const handleAddTask = (groupId: string) => {
    setOpenDialogId(groupId);
  };

  return (
    <div 
      className="py-16 px-4 relative z-10"
      id="taskboard"
      ref={taskBoardRef}
    >
      <div className="container max-w-6xl mx-auto">
        <div ref={ref}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h2 className="text-4xl font-bold mb-4">Task Checklist Board</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Create, organize and manage your tasks by subjects or projects
            </p>
          </motion.div>

          {/* Statistics Card */}
          <StatisticsCard />

          {/* Search Bar */}
          <SearchBar />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glassmorphism p-6 rounded-xl mb-10"
          >
            <h3 className="text-xl font-bold mb-4">Create New Group</h3>
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Group name..."
                  className="flex-1 bg-gray-800 border-gray-700"
                />
                <Tabs
                  defaultValue="Subject"
                  value={newGroupType}
                  onValueChange={(value) => setNewGroupType(value as TaskCategory)}
                  className="w-full sm:w-auto"
                >
                  <TabsList className="w-full sm:w-auto bg-gray-800">
                    <TabsTrigger value="Subject" className="flex-1">Subject</TabsTrigger>
                    <TabsTrigger value="Project" className="flex-1">Project</TabsTrigger>
                  </TabsList>
                </Tabs>
                <Button 
                  type="submit" 
                  className="bg-primary-purple hover:bg-primary-dark w-full sm:w-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Group
                </Button>
              </div>
            </form>
          </motion.div>

          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Your Task Groups</h3>
            <ExportMenu taskBoardRef={taskBoardRef} />
          </div>

          <Droppable droppableId="task-groups" type="GROUP" direction="vertical">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-6"
              >
                {taskGroups.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="glassmorphism p-8 rounded-xl text-center"
                  >
                    <p className="text-gray-300 text-lg">
                      No task groups yet. Create your first group above!
                    </p>
                  </motion.div>
                ) : (
                  taskGroups.map((group, index) => (
                    <Draggable key={group.id} draggableId={group.id} index={index}>
                      {(draggableProvided) => (
                        <div
                          ref={draggableProvided.innerRef}
                          {...draggableProvided.draggableProps}
                          {...draggableProvided.dragHandleProps}
                        >
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                          >
                            <TaskGroupCard
                              group={group}
                              index={index}
                              isEditing={editingGroupId === group.id}
                              editedName={editedGroupName}
                              onEditName={() => handleEditGroupName(group.id)}
                              onSaveName={() => handleSaveGroupName(group.id)}
                              onDeleteGroup={() => removeTaskGroup(group.id)}
                              onEditedNameChange={setEditedGroupName}
                              onAddTask={() => handleAddTask(group.id)}
                              openDialog={openDialogId === group.id}
                              onDialogOpenChange={(open) => {
                                if (!open) setOpenDialogId(null);
                              }}
                            />
                          </motion.div>
                        </div>
                      )}
                    </Draggable>
                  ))
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </div>
    </div>
  );
};

interface TaskGroupCardProps {
  group: TaskGroup;
  index: number;
  isEditing: boolean;
  editedName: string;
  onEditName: () => void;
  onSaveName: () => void;
  onDeleteGroup: () => void;
  onEditedNameChange: (name: string) => void;
  onAddTask: () => void;
  openDialog: boolean;
  onDialogOpenChange: (open: boolean) => void;
}

const TaskGroupCard: React.FC<TaskGroupCardProps> = ({
  group,
  index,
  isEditing,
  editedName,
  onEditName,
  onSaveName,
  onDeleteGroup,
  onEditedNameChange,
  onAddTask,
  openDialog,
  onDialogOpenChange,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSaveName();
    } else if (e.key === 'Escape') {
      onSaveName();
    }
  };

  const completedTasks = group.tasks.filter((task) => task.completed).length;
  const totalTasks = group.tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  // Sort tasks by due date (non-completed tasks with due dates first, then others)
  const sortedTasks = [...group.tasks].sort((a, b) => {
    // First prioritize non-completed tasks
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    
    // For non-completed tasks with due dates, sort by due date
    if (!a.completed && !b.completed) {
      if (a.dueDate && b.dueDate) return a.dueDate - b.dueDate;
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
    }
    
    // Default to order property
    return a.order - b.order;
  });

  return (
    <>
      <TaskFormDialog
        open={openDialog}
        onOpenChange={onDialogOpenChange}
        groupId={group.id}
        groupType={group.type}
      />

      <Droppable droppableId={group.id} type="TASK">
        {(provided) => (
          <Card 
            className="glassmorphism border-gray-700 shadow-md"
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  {isEditing ? (
                    <Input
                      value={editedName}
                      onChange={(e) => onEditedNameChange(e.target.value)}
                      onBlur={onSaveName}
                      onKeyDown={handleKeyDown}
                      className="bg-gray-800 border-gray-700"
                      autoFocus
                    />
                  ) : (
                    <CardTitle className="flex items-center">
                      <span className="mr-2 text-xl">{group.name}</span>
                      <span className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded">
                        {group.type}
                      </span>
                    </CardTitle>
                  )}
                </div>
                <div className="flex gap-2">
                  {isEditing ? (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={onSaveName}
                      className="h-8 w-8 text-primary-purple hover:bg-gray-800"
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  ) : (
                    <>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={onEditName}
                        className="h-8 w-8 text-gray-400 hover:text-primary-purple hover:bg-gray-800"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={onDeleteGroup}
                        className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-gray-800"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <div className="w-full h-1 bg-gray-700 rounded-full mt-3">
                <div
                  className="h-1 bg-primary-purple rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>{completedTasks} of {totalTasks} tasks completed</span>
                <span>{Math.round(progress)}%</span>
              </div>
            </CardHeader>

            <CardContent className="min-h-[100px] pt-2">
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2 min-h-[50px]"
              >
                {sortedTasks.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No tasks yet. Add your first task!
                  </p>
                ) : (
                  sortedTasks.map((task, taskIndex) => (
                    <div id={`task-${task.id}`} key={task.id}>
                      <TaskCard
                        task={task}
                        index={taskIndex}
                      />
                    </div>
                  ))
                )}
                {provided.placeholder}
              </div>
            </CardContent>

            <CardFooter className="pt-0 flex justify-center">
              <Button
                variant="outline"
                className="w-full border-gray-700 hover:bg-gray-800 hover:text-primary-purple"
                onClick={onAddTask}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </CardFooter>
          </Card>
        )}
      </Droppable>
    </>
  );
};

export default TaskBoard;
