import { motion } from "framer-motion";
import { Stack } from "@shared/schema";
import { ArrowUpRight } from "lucide-react";

interface StackCardProps {
  stack: Stack;
  onClick: (stackId: number) => void;
  imageUrl?: string;
  category?: string;
}

export default function StackCard({ stack, onClick, imageUrl, category }: StackCardProps) {
  // Default image URLs based on industry types
  const defaultImages = {
    "Technology": "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?q=80&w=300&auto=format",
    "Finance": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=300&auto=format",
    "Investing": "https://images.unsplash.com/photo-1534951009808-766178b47a4f?q=80&w=300&auto=format",
    "Cryptocurrency": "https://images.unsplash.com/photo-1516245834210-c4c142787335?q=80&w=300&auto=format",
    "Healthcare": "https://images.unsplash.com/photo-1584982751601-97dcc096659c?q=80&w=300&auto=format",
    "Consumer": "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?q=80&w=300&auto=format",
    "Green": "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=300&auto=format",
    "Dividend": "https://images.unsplash.com/photo-1579621970795-87facc2f976d?q=80&w=300&auto=format"
  };

  // Determine image URL
  const displayImage = imageUrl || defaultImages[stack.industry as keyof typeof defaultImages] || defaultImages.Finance;
  const displayCategory = category || stack.industry || "Finance";
  
  return (
    <motion.div
      className="stack-card-dark cursor-pointer relative"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      onClick={() => onClick(stack.id)}
    >
      <div className="stack-thumbnail">
        <img 
          src={displayImage} 
          alt={stack.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-[#242438]/80 rounded-full p-1">
          <ArrowUpRight className="w-4 h-4 text-cyan-400" />
        </div>
      </div>
      <div className="p-3">
        <p className="stack-category">{displayCategory}</p>
        <h3 className="stack-title">{stack.title}</h3>
        <div className="flex justify-between items-center mt-2">
          <span className="stack-stats">{stack.cardCount} Stocks | {stack.estimatedMinutes}YT</span>
        </div>
      </div>
    </motion.div>
  );
}
