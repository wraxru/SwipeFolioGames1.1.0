import { createContext, useContext, useState, ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface UserProgressContextProps {
  getUserProgress: (stackId: number) => any;
  updateProgress: (stackId: number, currentCardIndex: number, completed: boolean, earnedXp: number) => void;
  isLoading: boolean;
  updateUserXp: (xpToAdd: number) => void;
}

const UserProgressContext = createContext<UserProgressContextProps | undefined>(undefined);

export function UserProgressProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Get all user progress
  const { data: userProgress, isLoading: isLoadingProgress } = useQuery({
    queryKey: ["/api/user-progress"],
    enabled: !!user,
  });
  
  // Update user progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: async ({ stackId, data }: { stackId: number, data: any }) => {
      const res = await apiRequest("PATCH", `/api/user-progress/${stackId}`, data);
      return res.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/user-progress/${variables.stackId}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/user-progress"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user-daily-progress"] });
      
      if (variables.data.completed) {
        toast({
          title: "Stack Completed",
          description: `You've earned ${variables.data.earnedXp} XP!`,
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error updating progress",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  });
  
  const getUserProgress = (stackId: number) => {
    if (!userProgress) return null;
    return userProgress.find((progress: any) => progress.stackId === stackId);
  };
  
  const updateProgress = (stackId: number, currentCardIndex: number, completed: boolean, earnedXp: number) => {
    updateProgressMutation.mutate({
      stackId,
      data: {
        currentCardIndex,
        completed,
        earnedXp
      }
    });
  };
  
  const updateUserXp = (xpToAdd: number) => {
    // This is just for the UI state since the server will update the actual user XP
    queryClient.setQueryData(["/api/user"], (oldData: any) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        xp: oldData.xp + xpToAdd
      };
    });
  };
  
  return (
    <UserProgressContext.Provider value={{ 
      getUserProgress,
      updateProgress,
      isLoading: isLoadingProgress || isLoading || updateProgressMutation.isPending,
      updateUserXp
    }}>
      {children}
    </UserProgressContext.Provider>
  );
}

export function useUserProgress() {
  const context = useContext(UserProgressContext);
  if (context === undefined) {
    throw new Error("useUserProgress must be used within a UserProgressProvider");
  }
  return context;
}
