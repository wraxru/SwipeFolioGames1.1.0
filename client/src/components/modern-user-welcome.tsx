import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, Award } from 'lucide-react';

interface ModernUserWelcomeProps {
  name: string;
  rank?: number;
}

export default function ModernUserWelcome({ name, rank = 8 }: ModernUserWelcomeProps) {
  const [animateRank, setAnimateRank] = useState(false);
  
  // Simulate rank change after 5 seconds for demo purposes
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateRank(true);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="welcome-section mb-6">
      <div className="flex items-center space-x-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="relative"
        >
          {/* Avatar with glow effect */}
          <div className="avatar-container relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-violet-400 opacity-70 blur-md" />
            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
              
              {/* Businessman avatar */}
              <img 
                src="/avatar.png" 
                alt="User avatar" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.style.display = 'none';
                }}
              />
              
              {/* Fallback initial for the avatar */}
              <div className="absolute inset-0 flex items-center justify-center text-white text-xl font-bold bg-gradient-to-br from-blue-500 to-violet-600">
                {name.charAt(0)}
              </div>
            </div>
          </div>
        </motion.div>
        
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-0 flex items-center">
            <span className="font-serif mr-1">Belford&Co</span>
            <motion.div 
              initial={{ opacity: 0.7, y: 0 }}
              animate={{ 
                opacity: animateRank ? 1 : 0.7, 
                y: animateRank ? [0, -20, 0] : 0,
                scale: animateRank ? [1, 1.2, 1] : 1
              }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center ml-2 bg-amber-100 text-amber-800 text-xs rounded-full px-2 py-0.5"
            >
              <Award className="w-3 h-3 mr-0.5" />
              <span className="font-medium">Rank {rank}</span>
              {animateRank && (
                <ChevronUp className="w-3 h-3 ml-0.5 text-green-600" />
              )}
            </motion.div>
          </h1>
          <p className="text-sm text-slate-500">
            Continue building your investment portfolio
          </p>
        </div>
      </div>
    </div>
  );
}