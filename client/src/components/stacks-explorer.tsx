import { useLocation } from "wouter";
import { Stack } from "@shared/schema";
import StackCard from "@/components/ui/stack-card";

interface StacksExplorerProps {
  stacks: Stack[];
}

export default function StacksExplorer({ stacks }: StacksExplorerProps) {
  const [_, setLocation] = useLocation();
  
  const handleStackClick = (stackId: number) => {
    setLocation(`/lesson/${stackId}`);
  };
  
  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-poppins font-semibold text-xl text-gray-800">Popular Stacks</h2>
        <a href="#" className="text-primary-500 text-sm font-medium">View all</a>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {stacks.map(stack => (
          <StackCard 
            key={stack.id} 
            stack={stack} 
            onClick={handleStackClick} 
          />
        ))}
      </div>
    </div>
  );
}
