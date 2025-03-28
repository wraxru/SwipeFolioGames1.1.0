import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown } from 'lucide-react';

interface ModernUserWelcomeProps {
  name: string;
  rank?: number;
  previousRank?: number;
}

export default function ModernUserWelcome({ 
  name = "Belford&Co", 
  rank = 42, 
  previousRank = 45 
}: ModernUserWelcomeProps) {
  const [showRankChange, setShowRankChange] = useState(false);
  
  // Show rank change animation on first load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowRankChange(true);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const rankImproved = previousRank > rank;
  const rankDifference = Math.abs(previousRank - rank);
  
  return (
    <div className="welcome-section mb-6 flex items-center justify-between">
      <motion.div 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center">
          <div className="relative mr-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">
                {name.charAt(0)}
              </span>
            </div>
            {/* Subtle border glow */}
            <motion.div 
              className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-30 blur-sm"
              animate={{ 
                scale: [1, 1.05, 1], 
                opacity: [0.3, 0.6, 0.3] 
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse" 
              }}
            />
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-0.5">
              Hey, {name}! 👋
            </h1>
            <p className="text-gray-500 text-sm font-medium">
              Let's continue building your portfolio
            </p>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        className="flex flex-col items-center justify-center bg-white rounded-lg py-2 px-4 shadow-md border border-gray-100"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center">
          <Crown size={14} className="text-yellow-500 mr-1" />
          <span className="text-sm text-gray-500 font-medium">Rank</span>
        </div>
        
        <div className="flex items-baseline">
          <motion.span 
            className="text-xl font-bold text-gray-800"
            key={rank}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {rank}
          </motion.span>
          
          <AnimatePresence>
            {showRankChange && rankImproved && (
              <motion.span 
                className="ml-1.5 text-xs font-medium text-green-500 flex items-center"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                ↑{rankDifference}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}