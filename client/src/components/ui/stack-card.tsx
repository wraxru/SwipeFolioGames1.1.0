import { TrendingUp, BarChart2, Star, Clock } from "lucide-react";
import type { Stack } from "@shared/schema";
import { motion } from "framer-motion";

interface StackCardProps {
  stack: Stack;
  onClick: (stackId: number) => void;
  imageUrl?: string;
  category?: string;
}

export default function StackCard({ stack, onClick, imageUrl, category }: StackCardProps) {
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
        
        {/* Card count */}
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm border border-gray-700 rounded-full px-3 py-1 flex items-center space-x-1 text-xs z-20">
          <BarChart2 className="w-3 h-3 text-cyan-400" />
          <span className="text-white">{stack.cardCount || 10} stocks</span>
        </div>
      </div>
      
      {/* Card Body */}
      <div className="px-4 py-3 flex-1 flex flex-col justify-between">
        {/* Title with icon */}
        <div>
          <div className="flex items-start justify-between">
            <h3 className="font-bold text-lg text-white leading-tight">{stack.title}</h3>
            <div className="p-1.5 rounded-full bg-gray-800">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-1 line-clamp-2">{stack.description}</p>
        </div>
        
        {/* Bottom badges */}
        <div className="mt-3 flex items-center space-x-2">
          <div className={`badge ${
            stack.difficulty === 'beginner' ? 'bg-green-900/40 text-green-400 border-green-500/30' :
            stack.difficulty === 'intermediate' ? 'bg-yellow-900/40 text-yellow-400 border-yellow-500/30' :
            'bg-red-900/40 text-red-400 border-red-500/30'
          } text-xs px-2 py-1 rounded-full border`}>
            {stack.difficulty || 'intermediate'}
          </div>
          
          <div className="flex items-center space-x-1 bg-gray-800 text-gray-400 text-xs px-2 py-1 rounded-full">
            <Clock className="w-3 h-3" />
            <span>{stack.estimatedMinutes || 15} min</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}