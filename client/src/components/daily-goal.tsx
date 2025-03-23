import { CalendarCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

interface DailyGoalProps {
  dailyGoal: number;
  completed: number;
  isLoading?: boolean;
}

export default function DailyGoal({ dailyGoal, completed, isLoading = false }: DailyGoalProps) {
  const progressPercentage = (completed / dailyGoal) * 100;
  
  if (isLoading) {
    return (
      <div className="mt-6">
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    );
  }
  
  return (
    <div className="mt-6 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-md p-4">
      <div className="flex items-center">
        <div className="rounded-full bg-white bg-opacity-20 p-3 mr-3">
          <CalendarCheck className="text-white" size={20} />
        </div>
        <div>
          <h3 className="text-white font-medium">Daily Goal</h3>
          <p className="text-primary-100 text-sm">
            {completed >= dailyGoal 
              ? 'Goal completed! Well done!' 
              : `Complete ${dailyGoal - completed} more lesson${dailyGoal - completed !== 1 ? 's' : ''} today`
            }
          </p>
        </div>
      </div>
      <div className="mt-3">
        <Progress value={progressPercentage} className="h-1 bg-white bg-opacity-20" />
        <div className="flex justify-between text-primary-100 text-xs mt-1">
          <span>{completed}/{dailyGoal} completed</span>
          <span>{progressPercentage.toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
}
