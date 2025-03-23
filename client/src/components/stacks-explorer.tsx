import { useLocation } from "wouter";
import StackCard from "./ui/stack-card";
import type { Stack } from "@shared/schema";

interface StacksExplorerProps {
  stacks: Stack[];
}

export default function StacksExplorer({ stacks }: StacksExplorerProps) {
  const [_, setLocation] = useLocation();

  const handleStackClick = (stackId: number) => {
    setLocation(`/stock/${stackId}`);
  };

  // Industry names and images
  const industryDetails: Record<string, { name: string, image: string }> = {
    "Tech": { 
      name: "Tech Titans", 
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=580&auto=format&fit=crop" 
    },
    "Crypto": { 
      name: "Digital Assets", 
      image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=580&auto=format&fit=crop" 
    },
    "Stocks": { 
      name: "Blue Chip Leaders", 
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=580&auto=format&fit=crop" 
    },
    "Bonds": { 
      name: "Steady Yields", 
      image: "https://images.unsplash.com/photo-1621155346337-1d19476ba7d6?q=80&w=580&auto=format&fit=crop" 
    },
    "ETFs": { 
      name: "Diversified Baskets", 
      image: "https://images.unsplash.com/photo-1642543348745-743f5cc87740?q=80&w=580&auto=format&fit=crop" 
    },
    "Real Estate": { 
      name: "Property Players", 
      image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=580&auto=format&fit=crop" 
    },
    "ESG": { 
      name: "Green Giants", 
      image: "https://images.unsplash.com/photo-1464380573004-8ca85a08751a?q=80&w=580&auto=format&fit=crop" 
    },
    "Financial Planning": { 
      name: "Wealth Builders", 
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=580&auto=format&fit=crop" 
    },
    "Healthcare": { 
      name: "Med-Tech Innovators", 
      image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?q=80&w=580&auto=format&fit=crop" 
    },
    "Consumer": { 
      name: "Retail Champions", 
      image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=580&auto=format&fit=crop" 
    }
  };

  // Get details for a given industry
  const getIndustryDetails = (industry: string) => {
    return industryDetails[industry] || { 
      name: industry, 
      image: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?q=80&w=580&auto=format&fit=crop" 
    };
  };

  // Enhance stack data with industry details
  const enhancedStacks = stacks.map(stack => {
    const details = getIndustryDetails(stack.industry);
    return {
      ...stack,
      title: details.name, // Replace title with industry-specific name
      imageUrl: details.image
    };
  });

  return (
    <div className="grid-cols-stacks">
      {enhancedStacks.map((stack) => (
        <StackCard
          key={stack.id}
          stack={stack}
          onClick={handleStackClick}
          imageUrl={stack.imageUrl}
          category={stack.industry}
        />
      ))}
    </div>
  );
}