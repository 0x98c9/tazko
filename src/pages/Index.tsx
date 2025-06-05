import React, { useRef, useEffect } from 'react';
import ThreeBackground from '@/components/ThreeBackground';
import Hero from '@/components/Hero';
import TaskBoard from '@/components/TaskBoard';
import { DragDropContext } from 'react-beautiful-dnd';
import type { DropResult } from 'react-beautiful-dnd';
import { useTaskStore } from '@/lib/taskStore';
import Navbar from '@/components/Navbar';
import HowToUse from '@/components/HowToUse';
import Footer from '@/components/Footer';

const Index: React.FC = () => {
  const taskBoardRef = useRef<HTMLDivElement>(null);
  const { reorderTaskGroups, reorderTasks, taskGroups, updateStatistics, processRecurringTasks } = useTaskStore();

  // On mount, update statistics and check for recurring tasks
  useEffect(() => {
    updateStatistics();
    processRecurringTasks();

    // Setup interval to process recurring tasks once a day
    const interval = setInterval(() => {
      processRecurringTasks();
      updateStatistics();
    }, 1000 * 60 * 60); // Check every hour

    return () => clearInterval(interval);
  }, [updateStatistics, processRecurringTasks]);

  // Update statistics when task groups change
  useEffect(() => {
    updateStatistics();
  }, [taskGroups, updateStatistics]);

  const scrollToTaskBoard = () => {
    taskBoardRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;
    
    if (!destination) {
      return;
    }
    
    // If dropped in the same position, do nothing
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
    
    // If dragging task groups
    if (type === 'GROUP') {
      const reordered = [...taskGroups];
      const [removed] = reordered.splice(source.index, 1);
      reordered.splice(destination.index, 0, removed);
      
      reorderTaskGroups(reordered);
      return;
    }
    
    // If dragging tasks within the same group
    if (source.droppableId === destination.droppableId) {
      const group = taskGroups.find((g) => g.id === source.droppableId);
      
      if (group) {
        const reorderedTasks = [...group.tasks];
        const [removed] = reorderedTasks.splice(source.index, 1);
        reorderedTasks.splice(destination.index, 0, removed);
        
        reorderTasks(group.id, reorderedTasks);
      }
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <ThreeBackground />
        <div className="pt-24"> {/* Add padding to offset fixed navbar */}
          <Hero scrollToTaskBoard={scrollToTaskBoard} />
          <div ref={taskBoardRef} id="taskboard">
            <TaskBoard />
          </div>
          <HowToUse />
        </div>
        <Footer />
        {/* Add CSS for highlighting tasks found in search */}
        <style>
          {`
          @keyframes highlight {
            0%, 100% { background-color: rgba(155, 135, 245, 0.1); }
            50% { background-color: rgba(155, 135, 245, 0.3); }
          }
          .highlight-task {
            animation: highlight 2s ease;
            outline: 2px solid #9b87f5;
          }
          `}
        </style>
      </div>
    </DragDropContext>
  );
};

export default Index;
