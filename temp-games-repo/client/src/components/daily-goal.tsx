import { CalendarClock } from "lucide-react";
import { Progress } from "./ui/progress";
import { Skeleton } from "./ui/skeleton";

interface DailyGoalProps {
  dailyGoal: number;
  completed: number;
  isLoading?: boolean;
}

export default function DailyGoal({ dailyGoal, completed, isLoading = false }: DailyGoalProps) {
  const progress = Math.min(Math.round((completed / dailyGoal) * 100), 100);
  
  if (isLoading) {
    return (
      <div className="daily-goal bg-[#242438] rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <Skeleton className="h-3 w-full mb-2" />
        <Skeleton className="h-4 w-16" />
      </div>
    );
  }
  
  return (
    <div className="daily-goal bg-[#242438] rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-medium">Daily Goal</h3>
        <div className="h-8 w-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
          <CalendarClock className="h-4 w-4 text-cyan-500" />
        </div>
      </div>
      
      <Progress 
        value={progress} 
        className="h-2 mb-2" 
      />
      
      <p className="text-gray-400 text-sm">
        {completed}/{dailyGoal} lessons completed
      </p>
    </div>
  );
}