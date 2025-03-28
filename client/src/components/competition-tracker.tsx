import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Users, ChevronRight } from 'lucide-react';
import { PortfolioContext } from '@/contexts/portfolio-context';

// Sample leaderboard data - in a real app this would come from API
const leaderboardData = [
  { id: 1, name: 'Investor27', avatar: '👨‍💼', returns: 15.7, gain: '+$15.70' },
  { id: 2, name: 'TradingPro', avatar: '👩‍💼', returns: 12.3, gain: '+$12.30' },
  { id: 3, name: 'WealthMaster', avatar: '🧔', returns: 8.9, gain: '+$8.90' },
  { id: 4, name: 'StockExpert', avatar: '👱‍♀️', returns: 6.5, gain: '+$6.50' },
  { id: 5, name: 'Belford&Co', avatar: 'B', returns: 3.8, gain: '+$3.80', isUser: true },
  { id: 6, name: 'MarketGuru', avatar: '👨‍🦰', returns: 2.4, gain: '+$2.40' },
  { id: 7, name: 'InvestorX', avatar: '👴', returns: 1.2, gain: '+$1.20' },
  { id: 8, name: 'TradeQueen', avatar: '👩‍🦱', returns: -1.8, gain: '-$1.80' },
  { id: 9, name: 'ValueHunter', avatar: '👨‍🦱', returns: -3.5, gain: '-$3.50' },
  { id: 10, name: 'NewTrader', avatar: '🧑', returns: -5.2, gain: '-$5.20' },
];

export default function CompetitionTracker() {
  const portfolio = useContext(PortfolioContext);
  const [expanded, setExpanded] = useState(false);
  const [userRank, setUserRank] = useState(5);
  
  // In a real app, we would calculate the user's portfolio performance
  // and position in the leaderboard based on portfolio data
  useEffect(() => {
    if (portfolio) {
      // Simulate leaderboard position changing based on portfolio value
      // This would be replaced with real calculation based on portfolio performance
      const portfolioValue = portfolio.portfolioValue;
      const newRank = Math.max(1, Math.min(10, 10 - Math.floor(portfolioValue / 10)));
      setUserRank(newRank);
    }
  }, [portfolio]);
  
  // Get top 3 and user's position
  const topThree = leaderboardData.slice(0, 3);
  const userPosition = leaderboardData.find(item => item.isUser) || leaderboardData[userRank - 1];
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="competition-tracker mb-6"
    >
      <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-md">
        <div 
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-between p-4 cursor-pointer"
        >
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center mr-3">
              <Users className="h-4 w-4 text-indigo-500" />
            </div>
            <div>
              <h3 className="text-slate-800 font-medium">Competition Standings</h3>
              <p className="text-xs text-slate-500">You're in position #{userRank}</p>
            </div>
          </div>
          <ChevronRight className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${expanded ? 'rotate-90' : ''}`} />
        </div>
        
        {expanded && (
          <div className="px-4 pb-4">
            {/* Top 3 leaderboard */}
            <div className="mb-4">
              <div className="text-xs text-slate-500 mb-2">Top performers</div>
              <div className="space-y-2">
                {topThree.map((investor, index) => (
                  <motion.div 
                    key={investor.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center mr-2 text-xs font-bold text-white
                        ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-slate-400' : 'bg-amber-700'}`}>
                        {index + 1}
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">{investor.avatar}</span>
                        <span className="text-sm font-medium text-slate-700">{investor.name}</span>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-green-600">
                      {investor.gain}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* User position with glass effect */}
            <div className="mb-2">
              <div className="text-xs text-slate-500 mb-2">Your position</div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="glass-effect p-3 rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center mr-2 text-sm font-bold text-blue-800">
                    {userRank}
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">{userPosition.avatar}</span>
                    <span className="text-sm font-medium text-slate-700">{userPosition.name}</span>
                    <span className="ml-2 text-xs text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded-full">You</span>
                  </div>
                </div>
                <div className={`text-sm font-semibold ${userPosition.returns > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {userPosition.gain}
                </div>
              </motion.div>
            </div>
            
            {/* Positions to beat */}
            <div className="mt-3">
              <div className="text-xs text-slate-500 mb-2">Positions to beat</div>
              <div className="space-y-2">
                {leaderboardData
                  .filter((_, index) => index === userRank - 2)
                  .map((investor) => (
                    <motion.div 
                      key={investor.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100"
                    >
                      <div className="flex items-center">
                        <div className="h-6 w-6 rounded-full flex items-center justify-center mr-2 text-xs font-bold text-white bg-indigo-400">
                          {userRank - 1}
                        </div>
                        <div className="flex items-center">
                          <span className="mr-2">{investor.avatar}</span>
                          <span className="text-sm font-medium text-slate-700">{investor.name}</span>
                        </div>
                      </div>
                      <div className={`text-sm font-semibold ${investor.returns > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {investor.gain}
                      </div>
                    </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}