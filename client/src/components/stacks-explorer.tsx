import { useLocation } from "wouter";
import StackCard from "./ui/stack-card";
import type { Stack } from "@shared/schema";

interface StacksExplorerProps {
  stacks: Stack[];
}

export default function StacksExplorer({ stacks }: StacksExplorerProps) {
  const [_, setLocation] = useLocation();

  const handleStackClick = (stackId: number) => {
    setLocation(`/lesson/${stackId}`);
  };

  // Mapping of financial industry categories to relevant image URLs
  const industryImages: Record<string, string> = {
    "Stocks": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=580&auto=format&fit=crop",
    "Crypto": "https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=580&auto=format&fit=crop",
    "Bonds": "https://images.unsplash.com/photo-1621155346337-1d19476ba7d6?q=80&w=580&auto=format&fit=crop",
    "ETFs": "https://images.unsplash.com/photo-1642543348745-743f5cc87740?q=80&w=580&auto=format&fit=crop",
    "Real Estate": "https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=580&auto=format&fit=crop",
    "Financial Planning": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=580&auto=format&fit=crop",
    "Tech": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=580&auto=format&fit=crop"
  };

  const getImageUrl = (industry: string) => {
    return industryImages[industry] || undefined;
  };

  return (
    <div className="grid-cols-stacks">
      {stacks.map((stack) => (
        <StackCard
          key={stack.id}
          stack={stack}
          onClick={handleStackClick}
          imageUrl={getImageUrl(stack.industry)}
          category={stack.industry}
        />
      ))}
    </div>
  );
}