import ProgressRing from "@/components/ui/progress-ring";
import { Skeleton } from "@/components/ui/skeleton";
import { Flame } from "lucide-react";

interface ProgressHeaderProps {
  streakCount: number;
  xp: number;
  isLoading?: boolean;
}

export default function ProgressHeader({ streakCount, xp, isLoading = false }: ProgressHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-20">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {isLoading ? (
              <div className="flex items-center">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="ml-2">
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ) : (
              <div className="flex items-center">
                <ProgressRing progress={50} size={32}>
                  <div className="text-xs font-semibold">{streakCount}</div>
                </ProgressRing>
                <div className="ml-2">
                  <div className="text-sm font-medium">Day Streak</div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center">
            {isLoading ? (
              <Skeleton className="h-8 w-20 rounded-full" />
            ) : (
              <div className="flex items-center bg-primary-50 rounded-full px-3 py-1">
                <Flame className="text-accent-500 mr-1" size={16} />
                <span className="text-primary-800 font-medium text-sm">{xp} XP</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
