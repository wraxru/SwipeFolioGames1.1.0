import { TrendingUp, BarChart2, Star, Clock, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import type { Stack } from "@shared/schema";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface StackCardProps {
  stack: Stack;
  onClick: (stackId: number) => void;
  imageUrl?: string;
  category?: string;
}

export default function StackCard({ stack, onClick, imageUrl, category }: StackCardProps) {
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
      className="stack-card rounded-xl overflow-hidden flex flex-col shadow-lg border border-gray-800 bg-gray-900 h-64"
      onClick={() => onClick(stack.id)}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Card Header with Image */}
      <div className="relative h-36 overflow-hidden">
        {/* Image with overlay gradient */}
        <div className="absolute inset-0 bg-black/30 z-10" />

        <div 
          className="w-full h-full bg-cover bg-center" 
          style={{ 
            backgroundImage: imageUrl ? `url(${imageUrl})` : 'none'
          }}
        />
        
        {/* Swipe indicators - only show for a few seconds */}
        {showSwipeCues && (
          <>
            <motion.div 
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/70 backdrop-blur-sm rounded-full p-1 z-30"
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 0.8, x: 0 }}
              transition={{ repeat: 3, duration: 0.8, repeatType: "reverse" }}
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </motion.div>
            <motion.div 
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/70 backdrop-blur-sm rounded-full p-1 z-30"
              initial={{ opacity: 0, x: 5 }}
              animate={{ opacity: 0.8, x: 0 }}
              transition={{ repeat: 3, duration: 0.8, repeatType: "reverse" }}
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </motion.div>
          </>
        )}
        
        {/* Card Stack Preview - simulate the edge of the next card */}
        <div className="absolute -right-1 top-6 bottom-6 w-2 rounded-l-md bg-gray-200/10 backdrop-blur-sm z-20" />

        {/* Decorative gradient band */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${getGradient()}`} />

        {/* Category badge */}
        {category && (
          <div className="absolute top-3 left-3 bg-black/60 border border-gray-700 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium z-20 text-white">
            {category}
          </div>
        )}

        {/* Rating */}
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1 text-xs z-20 border border-gray-700">
          <Star className="w-3 h-3 text-yellow-400" />
          <span className="text-white">{stack.rating}.0</span>
        </div>

        {/* Card count with progress */}
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm border border-gray-700 rounded-full px-3 py-1 flex items-center space-x-1 text-xs z-20">
          <BarChart2 className="w-3 h-3 text-cyan-400" />
          <span className="text-white">{currentCardIndex}/{totalCards} stocks</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="px-4 py-3 flex-1 flex flex-col justify-between">
        {/* Title with icon */}
        <div>
          <div className="flex items-start justify-between">
            <h3 className="font-bold text-lg text-gray-800 leading-tight">{stack.title}</h3> {/* Changed text color here */}
            <div className="p-1.5 rounded-full bg-gray-800">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-1 line-clamp-2">{stack.description}</p>
        </div>

        {/* Bottom badges */}
        <div className="mt-3 flex items-center justify-between">
          <div className={`badge ${
            stack.difficulty === 'beginner' ? 'bg-green-900/40 text-green-400 border-green-500/30' :
            stack.difficulty === 'intermediate' ? 'bg-yellow-900/40 text-yellow-400 border-yellow-500/30' :
            'bg-red-900/40 text-red-400 border-red-500/30'
          } text-xs px-2 py-1 rounded-full border`}>
            {stack.difficulty || 'intermediate'}
          </div>
          
          {/* Favorite button */}
          <button 
            className="rounded-full p-1.5 bg-gray-800/30 hover:bg-gray-800/50 transition-colors"
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering the card click
              // Implement favorite functionality later
            }}
          >
            <Heart className="w-3.5 h-3.5 text-pink-400" />
          </button>
        </div>
        
        {/* Card navigation dots */}
        <div className="flex justify-center mt-2 space-x-1">
          {Array.from({ length: Math.min(5, totalCards) }).map((_, i) => (
            <button
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i === 0 ? 'bg-cyan-500' : 'bg-gray-400/30'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentCardIndex(i + 1);
              }}
            />
          ))}
          {totalCards > 5 && (
            <span className="text-xs text-gray-400">+{totalCards - 5}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}