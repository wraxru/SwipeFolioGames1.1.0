import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { Card, Stack } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useUserProgress } from "@/contexts/user-progress-context";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { X, Info, AlertCircle, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import SwipeableCard from "@/components/ui/swipeable-card";
import QuizCard from "@/components/quiz-card";
import StackCompleteCard from "@/components/stack-complete-card";

export default function LessonPage() {
  const { stackId } = useParams();
  const [_, setLocation] = useLocation();
  const { user } = useAuth();
  const { updateUserXp } = useUserProgress();
  
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showCompleteCard, setShowCompleteCard] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);
  
  // Get stack details
  const { data: stack, isLoading: isLoadingStack } = useQuery<Stack>({
    queryKey: [`/api/stacks/${stackId}`],
    enabled: !!stackId,
  });
  
  // Get cards for this stack
  const { data: cards, isLoading: isLoadingCards } = useQuery<Card[]>({
    queryKey: [`/api/stacks/${stackId}/cards`],
    enabled: !!stackId,
  });
  
  // Get user progress for this stack
  const { data: userProgress, isLoading: isLoadingProgress } = useQuery({
    queryKey: [`/api/user-progress/${stackId}`],
    enabled: !!stackId && !!user,
  });
  
  // Update user progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: async (data: { currentCardIndex: number, completed: boolean, earnedXp: number }) => {
      const res = await apiRequest("PATCH", `/api/user-progress/${stackId}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/user-progress/${stackId}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/user-progress"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user-daily-progress"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user-badges"] });
    }
  });
  
  // Initialize with user's saved progress
  useEffect(() => {
    if (userProgress && !isLoadingProgress) {
      setCurrentCardIndex(userProgress.currentCardIndex);
    }
  }, [userProgress, isLoadingProgress]);
  
  // Update progress when moving to next card
  const handleNextCard = (xpToAdd = 5) => {
    if (!cards) return;
    
    setEarnedXp(prev => prev + xpToAdd);
    
    const newIndex = currentCardIndex + 1;
    setCurrentCardIndex(newIndex);
    
    // Check if lesson is complete
    if (newIndex >= cards.length) {
      setShowCompleteCard(true);
      updateProgressMutation.mutate({
        currentCardIndex: newIndex,
        completed: true,
        earnedXp: earnedXp + xpToAdd
      });
      
      // Update user XP context
      updateUserXp(earnedXp + xpToAdd);
    } else {
      updateProgressMutation.mutate({
        currentCardIndex: newIndex,
        completed: false,
        earnedXp: 0 // We only award XP when the stack is completed
      });
    }
  };
  
  const handleReturn = () => {
    setLocation("/");
  };
  
  const isLoading = isLoadingStack || isLoadingCards || isLoadingProgress;
  
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gray-50 z-40 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!stack || !cards) {
    return (
      <div className="fixed inset-0 bg-gray-50 z-40 flex flex-col items-center justify-center p-4">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Stack Not Found</h2>
        <p className="text-gray-600 mb-6 text-center">We couldn't find the learning stack you're looking for.</p>
        <button 
          onClick={handleReturn}
          className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
        >
          Return to Home
        </button>
      </div>
    );
  }
  
  return (
    <div className="fixed inset-0 bg-gray-50 z-40">
      <div className="relative h-full flex flex-col">
        {/* Lesson Header */}
        <div className="p-4 flex items-center justify-between bg-white shadow-sm">
          <button 
            onClick={handleReturn}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <X className="text-gray-700" />
          </button>
          <div className="flex items-center">
            <Progress 
              value={(currentCardIndex / cards.length) * 100} 
              className="w-32 h-2"
            />
            <span className="ml-2 text-sm font-medium text-gray-600">
              {currentCardIndex}/{cards.length}
            </span>
          </div>
          <button className="p-2 rounded-full hover:bg-gray-100 transition">
            <Info className="text-gray-700" size={20} />
          </button>
        </div>
        
        {/* Card Stack */}
        <div className="flex-1 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            {showCompleteCard ? (
              <StackCompleteCard 
                stackName={stack.title}
                xpEarned={earnedXp}
                onReturn={handleReturn}
                industry={stack.industry}
              />
            ) : (
              <>
                {cards[currentCardIndex]?.type === 'quiz' ? (
                  <QuizCard 
                    card={cards[currentCardIndex]} 
                    onNextCard={() => handleNextCard(10)}
                  />
                ) : (
                  <SwipeableCard 
                    card={cards[currentCardIndex]} 
                    onNextCard={handleNextCard}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
