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

  // Industry names and images with vibrant mobile-friendly imagery
  const industryDetails: Record<string, { name: string, image: string }> = {
    "Tech": { 
      name: "Tech Titans", 
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=580&auto=format&fit=crop" 
    },
    "Healthcare": { 
      name: "Med-Tech Innovators", 
      image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?q=80&w=580&auto=format&fit=crop" 
    },
    "Consumer": { 
      name: "Retail Champions", 
      image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=580&auto=format&fit=crop" 
    },
    "Real Estate": { 
      name: "Property Players", 
      image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=580&auto=format&fit=crop" 
    },
    "Energy": { 
      name: "Energy Innovators", 
      image: "https://images.unsplash.com/photo-1591964006776-90d33e597522?q=80&w=580&auto=format&fit=crop" 
    },
    "Automotive": { 
      name: "Mobility Disruptors", 
      image: "https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?q=80&w=580&auto=format&fit=crop" 
    },
    "Fintech": { 
      name: "Banking Disruptors", 
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=580&auto=format&fit=crop" 
    },
    "ESG": { 
      name: "Green Giants", 
      image: "https://images.unsplash.com/photo-1464380573004-8ca85a08751a?q=80&w=580&auto=format&fit=crop" 
    },
    "Industrials": { 
      name: "Industrial Leaders", 
      image: "https://images.unsplash.com/photo-1516937941344-00b4e0337589?q=80&w=580&auto=format&fit=crop" 
    },
    "Communication": { 
      name: "Media Movers", 
      image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=580&auto=format&fit=crop" 
    }
  };
  
  // Filter out non-industry stacks (like "investing" and "crypto currency" guides)
  const industryStacksOnly = stacks.filter(stack => {
    // Keep stacks if they have a real industry name, filter out educational stacks
    const isEducational = stack.title.includes("Investing") || 
                          stack.title.includes("Basics") || 
                          stack.title.includes("101") ||
                          stack.title.includes("Learn");
    
    return !isEducational;
  });
  
  // Add some default industry stacks if we don't have enough
  if (industryStacksOnly.length < 5) {
    // Example industries to add if there aren't enough
    const defaultIndustries = ["Tech", "Healthcare", "Consumer", "Real Estate", "ESG"];
    
    // Add missing industries from our defaults
    defaultIndustries.forEach((industry, index) => {
      if (!industryStacksOnly.some(s => s.industry === industry)) {
        industryStacksOnly.push({
          id: 100 + index, // Avoid ID conflicts
          title: industryDetails[industry].name,
          description: `Explore top companies in the ${industry} sector`,
          industry: industry,
          iconName: "trending-up", // Default icon
          difficulty: "intermediate",
          cardCount: 10,
          rating: 4.5,
          estimatedMinutes: 15,
          color: "#000"
        });
      }
    });
  }

  // Get details for a given industry
  const getIndustryDetails = (industry: string) => {
    return industryDetails[industry] || { 
      name: industry, 
      image: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?q=80&w=580&auto=format&fit=crop" 
    };
  };

  // Enhance stack data with industry details
  const enhancedStacks = industryStacksOnly.map(stack => {
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