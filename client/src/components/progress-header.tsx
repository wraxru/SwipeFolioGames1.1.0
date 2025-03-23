import { Award, Flame } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

interface ProgressHeaderProps {
  streakCount: number;
  xp: number;
  isLoading?: boolean;
}

export default function ProgressHeader({ streakCount, xp, isLoading = false }: ProgressHeaderProps) {
  if (isLoading) {
    return (
      <div className="progress-stats flex space-x-4 my-5">
        <div className="flex-1 bg-[#242438] rounded-xl p-3 flex items-center space-x-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <div className="flex-1 bg-[#242438] rounded-xl p-3 flex items-center space-x-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="progress-stats flex space-x-4 my-5">
      <div className="flex-1 bg-[#242438] rounded-xl p-3 flex items-center space-x-3">
        <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center">
          <Flame className="h-5 w-5 text-amber-500" />
        </div>
        <div>
          <p className="text-sm text-gray-400">Current Streak</p>
          <p className="text-lg font-semibold text-white">{streakCount} days</p>
        </div>
      </div>
      
      <div className="flex-1 bg-[#242438] rounded-xl p-3 flex items-center space-x-3">
        <div className="h-10 w-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
          <Award className="h-5 w-5 text-cyan-500" />
        </div>
        <div>
          <p className="text-sm text-gray-400">Total XP</p>
          <p className="text-lg font-semibold text-white">{xp} XP</p>
        </div>
      </div>
    </div>
  );
}