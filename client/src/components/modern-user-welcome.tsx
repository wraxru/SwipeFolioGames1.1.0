import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, Award } from 'lucide-react';
import { PortfolioContext } from '@/contexts/portfolio-context';
import { getCurrentUserRank } from '@/data/leaderboard-data';
// Use a path that can be dynamically loaded
const defaultAvatarPath = '/images/default-avatar.png';

interface ModernUserWelcomeProps {
  name: string;
  rank?: number;
}

export default function ModernUserWelcome({ name, rank: initialRank = 11 }: ModernUserWelcomeProps) {
  const [animateRank, setAnimateRank] = useState(false);
  const [rank, setRank] = useState(initialRank);
  const portfolio = useContext(PortfolioContext);
  const [prevRank, setPrevRank] = useState(initialRank);
  const [_, forceUpdate] = useState({});
  
  // Force update when portfolio changes
  useEffect(() => {
    if (portfolio) {
      // Schedule a re-render after portfolio updates with small delay for state propagation
      const timer = setTimeout(() => {
        forceUpdate({ timestamp: Date.now() });
        console.log("Portfolio updated in ModernUserWelcome:", {
          holdings: portfolio.holdings.length,
          version: portfolio.version,
          lastUpdated: new Date(portfolio.lastUpdated).toISOString()
        });
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [
    portfolio, 
    portfolio?.holdings.length, 
    portfolio?.cash, 
    portfolio?.portfolioValue,
    portfolio?.version,
    portfolio?.lastUpdated
  ]);
  
  // Update rank based on actual position in leaderboard
  useEffect(() => {
    // Get the current user's rank from the leaderboard data
    const currentUserData = getCurrentUserRank();
    
    if (currentUserData && currentUserData.rank) {
      // Use the rank from the leaderboard data
      const newRank = currentUserData.rank;
      
      // Only update if rank changed
      if (newRank !== rank) {
        setPrevRank(rank);
        setRank(newRank);
        // Only animate when the rank improves (lower number is better)
        setAnimateRank(newRank < rank);
      }
    }
  }, [
    portfolio, 
    portfolio?.portfolioMetrics?.qualityScore,
    portfolio?.holdings.length,
    rank
  ]);
  
  return (
    <div className="welcome-section mb-6">
      <div className="flex items-center space-x-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="relative"
        >
          {/* Avatar with glow effect - simplified */}
          <div className="avatar-container relative">
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-violet-400 opacity-70 blur-md" />
            
            {/* Avatar container */}
            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-lg">
              {/* Businessman avatar image */}
              <img 
                src={defaultAvatarPath} 
                alt="Belford avatar" 
                className="w-full h-full object-cover"
              />
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