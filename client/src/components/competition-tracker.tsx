import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Users, ChevronRight } from 'lucide-react';
import { PortfolioContext } from '@/contexts/portfolio-context';

// Define the investor type
interface Investor {
  id: number;
  name: string;
  avatar: string;
  returns: number;
  isUser?: boolean;
  gain?: string;
}

// Sample leaderboard data - in a real app this would come from API
const baseLeaderboardData: Investor[] = [
  { id: 1, name: 'Investor27', avatar: '👨‍💼', returns: 15.7 },
  { id: 2, name: 'TradingPro', avatar: '👩‍💼', returns: 12.3 },
  { id: 3, name: 'WealthMaster', avatar: '🧔', returns: 8.9 },
  { id: 4, name: 'StockExpert', avatar: '👱‍♀️', returns: 6.5 },
  { id: 6, name: 'MarketGuru', avatar: '👨‍🦰', returns: 2.4 },
  { id: 7, name: 'InvestorX', avatar: '👴', returns: 1.2 },
  { id: 8, name: 'TradeQueen', avatar: '👩‍🦱', returns: -1.8 },
  { id: 9, name: 'ValueHunter', avatar: '👨‍🦱', returns: -3.5 },
  { id: 10, name: 'NewTrader', avatar: '🧑', returns: -5.2 },
];

export default function CompetitionTracker() {
  const portfolio = useContext(PortfolioContext);
  const [expanded, setExpanded] = useState(false);
  const [userRank, setUserRank] = useState(10); // Start at rank 10 (bottom)
  const [userReturns, setUserReturns] = useState(0);
  const [leaderboardData, setLeaderboardData] = useState(baseLeaderboardData);
  const [_, forceUpdate] = useState({});
  
  // Force update when portfolio changes
  useEffect(() => {
    if (portfolio) {
      // Schedule a re-render after portfolio updates with small delay for state propagation
      const timer = setTimeout(() => {
        forceUpdate({ timestamp: Date.now() });
        console.log("Portfolio updated in CompetitionTracker:", {
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
  
  // Calculate projected 1-year return and update leaderboard position
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
        setUserReturns(projectedReturnPercent);
        
        // Create user data
        const userData = {
          id: 5,
          name: 'Belford&Co',
          avatar: '👨‍💼', // Use a professional emoji as avatar
          returns: projectedReturnPercent,
          isUser: true
        };
        
        // Insert user into leaderboard and sort
        const newLeaderboard = [...baseLeaderboardData];
        const userIndex = newLeaderboard.findIndex(item => item.id === 5);
        if (userIndex >= 0) {
          newLeaderboard[userIndex] = userData;
        } else {
          newLeaderboard.push(userData);
        }
        
        // Sort by returns
        newLeaderboard.sort((a, b) => b.returns - a.returns);
        setLeaderboardData(newLeaderboard);
        
        // Find user's rank
        const rank = newLeaderboard.findIndex(item => item.isUser) + 1;
        setUserRank(rank);
      }
    }
  }, [portfolio]);
  
  // Format the gain/loss values with dollar signs
  const formattedLeaderboardData = leaderboardData.map(item => ({
    ...item,
    gain: `${item.returns >= 0 ? '+' : ''}$${Math.abs(item.returns).toFixed(2)}`
  }));
  
  // Get top 3 and user's position
  const topThree = formattedLeaderboardData.slice(0, 3);
  const userPosition = formattedLeaderboardData.find(item => item.isUser) || 
    { id: 5, name: 'Belford&Co', avatar: '👨‍💼', returns: 0, gain: '$0.00', isUser: true };
  
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