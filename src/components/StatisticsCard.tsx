
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTaskStore } from '@/lib/taskStore';
import { BarChart, CheckCircle, Clock, Calendar } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const StatisticsCard: React.FC = () => {
  const { taskGroups, statistics, updateStatistics } = useTaskStore();
  
  // Call updateStatistics once when the component mounts
  React.useEffect(() => {
    updateStatistics();
  }, [updateStatistics, taskGroups]);
  
  const {
    totalTasks,
    completedTasks,
    pendingTasks,
    completionPercentage,
    todayCompletionPercentage,
    upcomingDueTasks,
    overdueTasksCount
  } = statistics;

  return (
    <Card className="glassmorphism border-gray-700 mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-xl">
          <BarChart className="mr-2 h-5 w-5 text-primary-purple" />
          Task Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-sm">Overall Completion</span>
              </div>
              <span className="text-sm font-medium">{Math.round(completionPercentage)}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
            <div className="flex justify-between text-xs text-gray-400">
              <span>{completedTasks} completed</span>
              <span>{pendingTasks} pending</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-blue-400" />
                <span className="text-sm">Today's Progress</span>
              </div>
              <span className="text-sm font-medium">
                {Number.isNaN(todayCompletionPercentage) ? '0' : Math.round(todayCompletionPercentage)}%
              </span>
            </div>
            <Progress value={todayCompletionPercentage || 0} className="h-2" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mt-4 text-center">
          <div className="glassmorphism p-3 rounded-lg">
            <div className="text-2xl font-bold text-primary-purple">
              {upcomingDueTasks}
            </div>
            <div className="text-xs text-gray-400">Upcoming tasks</div>
          </div>
          
          <div className="glassmorphism p-3 rounded-lg">
            <div className="text-2xl font-bold text-red-400">
              {overdueTasksCount}
            </div>
            <div className="text-xs text-gray-400">Overdue tasks</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatisticsCard;
