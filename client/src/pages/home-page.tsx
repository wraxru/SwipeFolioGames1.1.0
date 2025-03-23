import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Stack } from "@shared/schema";
import AppNavigation from "@/components/app-navigation";
import ProgressHeader from "@/components/progress-header";
import UserWelcome from "@/components/user-welcome";
import DailyGoal from "@/components/daily-goal";
import CurrentLesson from "@/components/current-lesson";
import StacksExplorer from "@/components/stacks-explorer";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  const { user } = useAuth();
  
  const { data: stacks, isLoading: isLoadingStacks } = useQuery<Stack[]>({
    queryKey: ["/api/stacks"],
  });
  
  const { data: userProgress, isLoading: isLoadingProgress } = useQuery({
    queryKey: ["/api/user-progress"],
    enabled: !!user,
  });
  
  const { data: dailyProgress, isLoading: isLoadingDailyProgress } = useQuery({
    queryKey: ["/api/user-daily-progress"],
    enabled: !!user,
  });

  const isLoading = isLoadingStacks || isLoadingProgress || isLoadingDailyProgress;
  
  // Find current lesson (first incomplete stack)
  const currentLesson = !isLoading && stacks && userProgress 
    ? stacks.find(stack => 
        !userProgress.some(progress => 
          progress.stackId === stack.id && progress.completed
        )
      )
    : null;
  
  const currentLessonProgress = currentLesson && userProgress
    ? userProgress.find(progress => progress.stackId === currentLesson.id)
    : null;

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <ProgressHeader 
        streakCount={user?.streakCount || 0} 
        xp={user?.xp || 0} 
        isLoading={isLoading}
      />
      
      <main className="container mx-auto px-4 pt-16 pb-4">
        <UserWelcome name={user?.displayName || ''} />
        
        <DailyGoal 
          dailyGoal={user?.dailyGoal || 3}
          completed={dailyProgress?.lessonsCompleted || 0}
          isLoading={isLoadingDailyProgress}
        />
        
        {isLoading ? (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        ) : currentLesson ? (
          <CurrentLesson 
            stack={currentLesson} 
            progress={currentLessonProgress}
          />
        ) : (
          <div className="mt-8 bg-white rounded-xl shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">All caught up!</h3>
            <p className="text-gray-600 mb-4">You've completed all the available lessons.</p>
          </div>
        )}
        
        {isLoadingStacks ? (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-40 w-full rounded-xl" />
              <Skeleton className="h-40 w-full rounded-xl" />
              <Skeleton className="h-40 w-full rounded-xl" />
              <Skeleton className="h-40 w-full rounded-xl" />
            </div>
          </div>
        ) : (
          <StacksExplorer stacks={stacks || []} />
        )}
      </main>
      
      <AppNavigation />
    </div>
  );
}
