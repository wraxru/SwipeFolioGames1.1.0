import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, Award } from 'lucide-react';
import { PortfolioContext } from '@/contexts/portfolio-context';

interface ModernUserWelcomeProps {
  name: string;
  rank?: number;
}

export default function ModernUserWelcome({ name, rank: initialRank = 10 }: ModernUserWelcomeProps) {
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
  
  // Update rank based on portfolio performance
  useEffect(() => {
    if (portfolio && portfolio.holdings.length > 0) {
      // Calculate projected 1-year returns
      const totalInvested = portfolio.holdings.reduce((total, h) => total + (h.shares * h.purchasePrice), 0);
      
      if (totalInvested > 0) {
        const oneYearReturns = portfolio.holdings.reduce((total, h) => {
          // Parse the oneYearReturn string (remove % sign and convert to number)
          const oneYearReturnPercent = 
            typeof h.stock.oneYearReturn === 'number' ? h.stock.oneYearReturn :
            typeof h.stock.oneYearReturn === 'string' ? parseFloat(h.stock.oneYearReturn.replace('%', '')) : 
            0;
            
          const stockValue = h.shares * h.purchasePrice;
          const stockReturn = stockValue * (oneYearReturnPercent / 100);
          return total + stockReturn;
        }, 0);
        
        const projectedReturnPercent = (oneYearReturns / totalInvested) * 100;
        
        // Calculate rank based on return percent
        // Start at rank 10 (lowest) and improve as returns increase
        let newRank = 10;
        if (projectedReturnPercent > 0) newRank = 9;
        if (projectedReturnPercent > 2) newRank = 8;
        if (projectedReturnPercent > 4) newRank = 7;
        if (projectedReturnPercent > 6) newRank = 6;
        if (projectedReturnPercent > 8) newRank = 5;
        if (projectedReturnPercent > 10) newRank = 4;
        if (projectedReturnPercent > 12) newRank = 3;
        if (projectedReturnPercent > 14) newRank = 2;
        if (projectedReturnPercent > 16) newRank = 1;
        
        // Check if rank improved
        if (newRank < prevRank) {
          setPrevRank(rank);
          setRank(newRank);
          setAnimateRank(true);
        }
      }
    }
  }, [portfolio, prevRank, rank]);
  
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
              
              {/* Belford&Co avatar */}
              <img 
                src="/belford-avatar.png" 
                alt="User avatar" 
                className="w-full h-full object-cover z-10 relative"
              />
              
              {/* Fallback initial for the avatar (hidden when image loads) */}
              <div className="absolute inset-0 flex items-center justify-center text-white text-xl font-bold bg-gradient-to-br from-blue-500 to-violet-600 z-0">
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