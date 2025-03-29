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
      image: "Profiles/Industry_Tech.png" 
    },
    "Healthcare": { 
      name: "Med-Tech Innovators", 
      image: "Profiles/savelives.png "
    },
    "Consumer": { 
      name: "Retail Champions", 
      image: "Profiles/Industry_Retail.png "
    },
    "Real Estate": { 
      name: "Property Players", 
      image: "Profiles/Industry_RealEstate.png" 
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
    const industryStockCounts: Record<string, number> = {
      "Real Estate": 10,
      "Healthcare": 9,
      "Tech": 10,
      "Consumer": 8,
      "ESG": 8
    };

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
          cardCount: industryStockCounts[industry] || 8, // Use specific count or default to 8
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