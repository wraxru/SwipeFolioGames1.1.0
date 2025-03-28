import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, Award, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export default function CompetitionTracker() {
  const { user } = useAuth();
  const [sparkleEffect, setSparkleEffect] = useState(false);
  
  // Sample data - in a real app, this would come from the backend
  const pointsEarned = user?.xp || 75;
  const dailyGoal = user?.dailyGoal || 3;
  const completed = 1; // Hardcoded for demo
  const nextRankPoints = 100;
  const currentRank = 42;
  const pointsToNextRank = nextRankPoints - pointsEarned;
  
  // Show sparkle effect animation periodically
  useEffect(() => {
    const timer = setInterval(() => {
      setSparkleEffect(true);
      setTimeout(() => setSparkleEffect(false), 2000);
    }, 10000);
    
    return () => clearInterval(timer);
  }, []);
  
  const progress = Math.min(Math.round((completed / dailyGoal) * 100), 100);

  return (
    <motion.div 
      className="backdrop-blur-sm bg-white/80 rounded-xl p-5 mb-6 border border-gray-200 shadow-xl overflow-hidden relative"
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      {/* Glass effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-blue-50/30 to-purple-50/30 pointer-events-none" />
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md mr-3">
            <Trophy size={18} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Competition Status</h3>
            <p className="text-gray-500 text-xs">Your daily learning challenge</p>
          </div>
        </div>
        
        <div className="relative">
          <div className="flex items-center justify-center bg-amber-50 rounded-full h-9 w-9 border border-amber-100">
            <Target size={16} className="text-amber-600" />
          </div>
          
          {/* Show completion circle if progress is 100% */}
          {progress === 100 && (
            <div className="absolute -top-1 -right-1 bg-green-500 rounded-full h-4 w-4 border-2 border-white flex items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12L10 17L20 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
            </div>
          )}
        </div>
      </div>
      
      <div className="mb-6 relative">
        {/* Progress bar background */}
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-400 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, delay: 0.1 }}
          />
        </div>
        
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>{completed}/{dailyGoal} lessons completed</span>
          <span>{progress}% complete</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
        <div className="flex items-center relative">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md ${sparkleEffect ? 'animate-pulse' : ''}`}>
            <Award size={18} className="text-white" />
          </div>
          
          {/* Sparkle effects */}
          {sparkleEffect && (
            <>
              <motion.div 
                className="absolute -top-1 -right-1"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Sparkles size={12} className="text-yellow-400" />
              </motion.div>
              <motion.div 
                className="absolute -bottom-1 -left-1"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Sparkles size={12} className="text-yellow-400" />
              </motion.div>
            </>
          )}
          
          <div className="ml-3">
            <h4 className="font-medium text-gray-800">Points Earned</h4>
            <div className="flex items-baseline">
              <span className="text-xl font-bold text-indigo-600">{pointsEarned}</span>
              <span className="text-xs text-gray-500 ml-1">pts</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          <span className="text-xs text-gray-500 mb-1">Next Rank in</span>
          <div className="flex items-center">
            <span className="text-sm font-bold text-gray-800 mr-1">{pointsToNextRank}</span>
            <span className="text-xs text-gray-500">pts</span>
          </div>
        </div>
      </div>
      
      {/* Mini ladder visualization */}
      <div className="mt-4 flex items-center justify-between px-2">
        <div className="flex flex-col items-center">
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-500">
            {currentRank + 2}
          </div>
          <div className="h-6 w-0.5 bg-gray-200"></div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-500">
            {currentRank + 1}
          </div>
          <div className="h-6 w-0.5 bg-gray-200"></div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-amber-500 shadow-lg flex items-center justify-center text-xs font-bold text-white border-2 border-white">
            {currentRank}
          </div>
          <div className="h-6 w-0.5 bg-gray-200"></div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-500">
            {currentRank - 1}
          </div>
          <div className="h-6 w-0.5 bg-gray-200"></div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-500">
            {currentRank - 2}
          </div>
          <div className="h-6 w-0.5 bg-gray-200"></div>
        </div>
      </div>
    </motion.div>
  );
}