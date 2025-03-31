import { useLocation } from "wouter";
import { Stack, UserProgress } from "@shared/schema";
import { PlayCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface CurrentLessonProps {
  stack: Stack;
  progress?: UserProgress | null;
}

export default function CurrentLesson({ stack, progress }: CurrentLessonProps) {
  const [_, setLocation] = useLocation();
  
  const progressPercentage = progress 
    ? (progress.currentCardIndex / stack.cardCount) * 100 
    : 0;
  
  const handleContinueLearning = () => {
    setLocation(`/lesson/${stack.id}`);
  };
  
  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-poppins font-semibold text-xl text-gray-800">Continue Learning</h2>
        <a href="#" className="text-primary-500 text-sm font-medium">See all</a>
      </div>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className={`relative h-32 bg-gradient-to-r ${stack.color} flex items-end p-4`}>
          <div className="absolute right-4 top-4 bg-white bg-opacity-20 rounded-lg px-2 py-1">
            <span className="text-white text-xs font-medium">
              {stack.estimatedMinutes} min{progressPercentage > 0 ? ' left' : ''}
            </span>
          </div>
          <div className="z-10">
            <h3 className="text-white font-medium text-lg">{stack.title}</h3>
            <p className="text-primary-100 text-sm">{stack.description}</p>
          </div>
          <div className="absolute right-6 bottom-6">
            <i className={`ri-${stack.iconName} text-white text-4xl opacity-25`}></i>
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-800">Progress</span>
              <span className="ml-2 text-xs font-medium text-gray-500">
                {progress ? progress.currentCardIndex : 0}/{stack.cardCount} cards
              </span>
            </div>
            <span className="text-sm font-medium text-primary-500">
              {progressPercentage.toFixed(0)}%
            </span>
          </div>
          <Progress value={progressPercentage} className="h-1" />
          <Button 
            className="mt-4 w-full gap-2"
            onClick={handleContinueLearning}
          >
            <PlayCircle className="h-4 w-4" />
            Continue Learning
          </Button>
        </div>
      </div>
    </div>
  );
}
