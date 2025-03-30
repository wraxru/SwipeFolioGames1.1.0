import { TrendingUp, BarChart2, Star, Clock, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import type { Stack } from "@shared/schema";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface StackCardProps {
  stack: Stack;
  onClick: (stackId: number) => void;
  imageUrl?: string;
  category?: string;
  isDetailPage?: boolean;
}

export default function StackCardAnimated({ stack, onClick, imageUrl, category, isDetailPage = false }: StackCardProps) {
  // State for swipe animation cues
  const [showSwipeCues, setShowSwipeCues] = useState(true);
  const [currentCardIndex, setCurrentCardIndex] = useState(1);
  const totalCards = stack.cardCount || 10;
  
  // Hide swipe cues after a few seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSwipeCues(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Get a unique gradient based on stack id or title
  const getGradient = () => {
    const gradients = [
      "from-cyan-500 to-blue-600", // Tech
      "from-green-500 to-emerald-600", // ESG
      "from-purple-500 to-indigo-600", // Financial
      "from-red-500 to-rose-600", // Healthcare
      "from-orange-500 to-amber-600", // Consumer
      "from-blue-500 to-violet-600", // Real Estate
      "from-yellow-500 to-orange-600", // Bonds
      "from-teal-500 to-green-600", // ETFs
      "from-pink-500 to-rose-600", // Crypto
      "from-indigo-500 to-blue-600", // Stocks
    ];

    const index = stack.id % gradients.length;
    return gradients[index];
  };

  return (
    <motion.div 
      layoutId={`stack-card-${stack.id}`}
      className="stack-card rounded-xl overflow-hidden flex flex-col shadow-lg border border-gray-200 bg-white h-[340px]"
      onClick={() => onClick(stack.id)}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      initial={!isDetailPage ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={!isDetailPage ? { opacity: 0 } : undefined}
    >
      {/* Card Header with Image - Taller aspect ratio */}
      <motion.div 
        layoutId={`stack-card-header-${stack.id}`}
        className="relative h-44 overflow-hidden"
      >
        {/* Gradient overlay for better text readability */}
        <motion.div 
          layoutId={`stack-card-overlay-${stack.id}`}
          className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60 z-10" 
        />

        <motion.div 
          layoutId={`stack-card-image-${stack.id}`}
          className="w-full h-full bg-cover bg-center" 
          style={{ 
            backgroundImage: imageUrl ? `url(${imageUrl})` : 'none'
          }}
        />
        
        {/* Swipe indicators - only show for a few seconds */}
        {showSwipeCues && (
          <>
            <motion.div 
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/70 backdrop-blur-sm rounded-full p-1 z-20"
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 0.8, x: 0 }}
              transition={{ repeat: 3, duration: 0.8, repeatType: "reverse" }}
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </motion.div>
            <motion.div 
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/70 backdrop-blur-sm rounded-full p-1 z-20"
              initial={{ opacity: 0, x: 5 }}
              animate={{ opacity: 0.8, x: 0 }}
              transition={{ repeat: 3, duration: 0.8, repeatType: "reverse" }}
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </motion.div>
          </>
        )}
        
        {/* Card Stack Preview - simulate the edge of the next card */}
        <div className="absolute -right-1 top-8 bottom-8 w-2 rounded-l-md bg-white/20 backdrop-blur-sm z-20" />

        {/* Category badge - Moved to top for better visibility */}
        {category && (
          <div className="absolute top-3 left-3 bg-black/60 border border-gray-700 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium z-20 text-white">
            {category}
          </div>
        )}

        {/* Bottom indicators row - Only showing stock count */}
        <div className="absolute bottom-3 right-3 z-20">
          {/* Card count with progress - Simplified */}
          <div className="bg-black/60 backdrop-blur-sm border border-gray-700 rounded-full px-3 py-1 flex items-center space-x-1 text-xs">
            <BarChart2 className="w-3 h-3 text-cyan-400" />
            <span className="text-white">{totalCards}</span>
          </div>
        </div>
      </motion.div>

      {/* Card Body - Better spacing and hierarchy */}
      <motion.div 
        layoutId={`stack-card-body-${stack.id}`}
        className="px-4 py-3 flex-1 flex flex-col justify-between bg-white"
      >
        {/* Title with icon - Improved spacing */}
        <div>
          <div className="flex items-start justify-between mb-1">
            <motion.h3 
              layoutId={`stack-card-title-${stack.id}`}
              className="font-bold text-base text-gray-800 leading-tight"
            >
              {stack.title}
            </motion.h3>
            <motion.div 
              layoutId={`stack-card-icon-${stack.id}`}
              className="p-1.5 rounded-full bg-gray-100 border border-gray-200"
            >
              <TrendingUp className="w-4 h-4 text-blue-500" />
            </motion.div>
          </div>
          <motion.p 
            layoutId={`stack-card-description-${stack.id}`}
            className="text-xs text-gray-500 mt-1 line-clamp-2"
          >
            {stack.description}
          </motion.p>
        </div>

        <motion.div 
          layoutId={`stack-card-footer-${stack.id}`}
          className="mt-3 space-y-3"
        >
          {/* Bottom badges with better spacing */}
          <div className="flex items-center justify-between">
            <motion.div 
              layoutId={`stack-card-difficulty-${stack.id}`}
              className={`badge ${
                stack.difficulty === 'beginner' ? 'bg-green-50 text-green-600 border-green-200' :
                stack.difficulty === 'intermediate' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' :
                'bg-red-50 text-red-600 border-red-200'
              } text-xs px-2 py-1 rounded-full border`}
            >
              {stack.difficulty || 'intermediate'}
            </motion.div>
            
            {/* Favorite button */}
            <button 
              className="rounded-full p-1.5 bg-gray-100 hover:bg-gray-200 transition-colors border border-gray-200"
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the card click
                // Implement favorite functionality later
              }}
            >
              <Heart className="w-3.5 h-3.5 text-pink-500" />
            </button>
          </div>
          
          {/* Card navigation dots */}
          <div className="flex justify-center space-x-1">
            {Array.from({ length: Math.min(5, totalCards) }).map((_, i) => (
              <button
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === 0 ? 'bg-blue-500' : 'bg-gray-200'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentCardIndex(i + 1);
                }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Decorative gradient accent line at bottom */}
      <motion.div 
        layoutId={`stack-card-gradient-${stack.id}`}
        className={`h-1 bg-gradient-to-r ${getGradient()}`} 
      />
    </motion.div>
  );
}