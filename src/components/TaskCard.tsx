
import React, { useState } from 'react';
import { Task, TaskPriority } from '@/lib/types';
import { useTaskStore } from '@/lib/taskStore';
import { motion } from 'framer-motion';
import { Draggable } from 'react-beautiful-dnd';
import { 
  Check, 
  Trash, 
  Edit, 
  Calendar, 
  Link as LinkIcon,
  Image,
  FileText,
  Tag,
  ChevronDown,
  ChevronUp,
  Repeat
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface TaskCardProps {
  task: Task;
  index: number;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, index }) => {
  const { 
    toggleTaskCompletion, 
    removeTask, 
    updateTaskTitle,
    updateTaskDescription,
    updateTaskLink,
    updateTaskTags,
    updateTaskPriority,
    updateTaskDueDate
  } = useTaskStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [expanded, setExpanded] = useState(false);
  
  const priorityColors = {
    Low: "bg-blue-500/20 border-blue-500 text-blue-300",
    Medium: "bg-green-500/20 border-green-500 text-green-300",
    High: "bg-orange-500/20 border-orange-500 text-orange-300",
    Urgent: "bg-red-500/20 border-red-500 text-red-300"
  };

  const handleToggle = () => {
    toggleTaskCompletion(task.id, task.parent);
  };

  const handleRemove = () => {
    removeTask(task.id, task.parent);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedTitle.trim()) {
      updateTaskTitle(task.id, task.parent, editedTitle);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditedTitle(task.title);
      setIsEditing(false);
    }
  };
  
  const formatDueDate = (timestamp: number) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return 'Today';
    } else if (isTomorrow(date)) {
      return 'Tomorrow';
    } else {
      return format(date, 'MMM d');
    }
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`glassmorphism p-3 mb-2 rounded-lg flex flex-col group ${
            snapshot.isDragging ? 'shadow-xl' : ''
          } ${task.completed ? 'opacity-60' : ''}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center flex-1">
              <div className="mr-4">
                <div 
                  className="checkbox-container relative inline-block w-6 h-6 cursor-pointer"
                  onClick={handleToggle}
                >
                  <input
                    type="checkbox"
                    className="opacity-0 absolute h-0 w-0"
                    checked={task.completed}
                    onChange={handleToggle}
                    id={`checkbox-${task.id}`}
                  />
                  <span 
                    className={`checkmark absolute top-0 left-0 h-6 w-6 rounded-md border ${
                      task.completed 
                        ? 'border-primary-purple bg-primary-purple border-opacity-80' 
                        : 'border-gray-400 bg-transparent'
                    }`}
                  >
                    {task.completed && (
                      <Check className="text-white h-4 w-4 absolute top-1 left-1" />
                    )}
                  </span>
                </div>
              </div>

              <div 
                {...provided.dragHandleProps} 
                className="flex-1 text-left drag-handle"
              >
                {isEditing ? (
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-gray-800 p-1 rounded-md border border-gray-700 text-white"
                    autoFocus
                  />
                ) : (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={cn(
                      task.completed ? 'line-through text-gray-400' : '',
                      "font-medium"
                    )}>
                      {task.title}
                    </span>
                    
                    {task.priority && (
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-xs py-0 border px-1.5", 
                          priorityColors[task.priority]
                        )}
                      >
                        {task.priority}
                      </Badge>
                    )}
                    
                    {task.recurring?.enabled && (
                      <Repeat className="h-3 w-3 text-primary-purple" />
                    )}
                  </div>
                )}
                
                {/* Due date pill */}
                {task.dueDate && !isEditing && (
                  <div className={cn(
                    "text-xs flex items-center mt-1 gap-1",
                    isPast(new Date(task.dueDate)) && !task.completed ? "text-red-400" : "text-gray-400"
                  )}>
                    <Calendar className="h-3 w-3" />
                    {formatDueDate(task.dueDate)}
                  </div>
                )}
                
                {/* Tags */}
                {task.tags && task.tags.length > 0 && !isEditing && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {task.tags.map(tag => (
                      <Badge 
                        key={tag} 
                        variant="outline" 
                        className="text-xs py-0 border-gray-600 text-gray-300 px-1"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {!isEditing && (
                <>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setExpanded(!expanded)}
                    className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-800"
                  >
                    {expanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-primary-purple hover:bg-gray-800"
                    onClick={handleEdit}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-gray-800"
                    onClick={handleRemove}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
          
          {/* Expanded content */}
          {expanded && (
            <div className="mt-3 pt-3 border-t border-gray-700">
              {/* Description */}
              {task.description && (
                <div className="mb-3">
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                    <FileText className="h-4 w-4" />
                    <span>Description</span>
                  </div>
                  <p className="text-sm text-gray-300 whitespace-pre-wrap pl-6">
                    {task.description}
                  </p>
                </div>
              )}
              
              {/* Link */}
              {task.link && (
                <div className="mb-3">
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                    <LinkIcon className="h-4 w-4" />
                    <span>Resource Link</span>
                  </div>
                  <div className="pl-6">
                    <a 
                      href={task.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm text-primary-purple hover:underline break-all"
                    >
                      {task.link}
                    </a>
                  </div>
                </div>
              )}
              
              {/* Image */}
              {task.imageUrl && (
                <div className="mb-3">
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                    <Image className="h-4 w-4" />
                    <span>Image</span>
                  </div>
                  <div className="pl-6 mt-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <div className="w-20 h-20 rounded-md overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                          <img 
                            src={task.imageUrl} 
                            alt={task.title}
                            className="w-full h-full object-cover" 
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=Error";
                            }}
                          />
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 max-w-[400px] max-h-[400px] glassmorphism border-gray-700">
                        <img 
                          src={task.imageUrl} 
                          alt={task.title} 
                          className="w-full h-auto object-contain max-h-[400px]" 
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              )}
              
              {/* Recurring details */}
              {task.recurring?.enabled && (
                <div className="mb-2">
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                    <Repeat className="h-4 w-4" />
                    <span>Repeats every {task.recurring.frequency > 1 ? `${task.recurring.frequency} ` : ''} 
                      {task.recurring.interval === 'daily' && (task.recurring.frequency > 1 ? 'days' : 'day')}
                      {task.recurring.interval === 'weekly' && (task.recurring.frequency > 1 ? 'weeks' : 'week')}
                      {task.recurring.interval === 'monthly' && (task.recurring.frequency > 1 ? 'months' : 'month')}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}
    </Draggable>
  );
};

export default TaskCard;
