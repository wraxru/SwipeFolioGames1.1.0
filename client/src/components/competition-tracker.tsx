import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Users, ChevronRight, ExternalLink } from 'lucide-react';
import { PortfolioContext } from '@/contexts/portfolio-context';
import { Link } from 'wouter';
import { 
  getLeaderboardData, 
  getCurrentUserRank, 
  LeaderboardUser
} from '@/data/leaderboard-data';

// Define the investor type
interface Investor {
  id: number;
  name: string;
  avatar: string;
  returns: number;
  qualityScore?: number; // Added for quality score
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
  const [leaderboardData, setLeaderboardData] = useState<Investor[]>([]);
  
  // Refresh data from portfolio context when portfolio changes 
  useEffect(() => {
    // Calculate metrics if portfolio exists
    if (portfolio) {
      // Schedule a refresh after portfolio updates with small delay for state propagation
      const timer = setTimeout(() => {
        console.log("Portfolio updated in CompetitionTracker:", {
          holdings: portfolio.holdings.length,
          version: portfolio.version,
          lastUpdated: new Date(portfolio.lastUpdated).toISOString()
        });
        
        // Use ROI directly from portfolio context
        setUserReturns(portfolio.portfolioMetrics.roi);
        
        // Fetch updated leaderboard data (which will now read from portfolio context)
        fetchUpdatedLeaderboard();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [
    portfolio?.version,
    portfolio?.lastUpdated,
    portfolio?.portfolioMetrics
  ]);
  
  // Function to fetch latest leaderboard data
  const fetchUpdatedLeaderboard = () => {
    const leaderboardUsers = getLeaderboardData();
    const currentUser = getCurrentUserRank();
    
    // Convert to the format used by this component
    const convertedData: Investor[] = leaderboardUsers.map(user => ({
      id: user.rank || (user.id === 'current-user' ? 999 : Number(user.id.replace(/\D/g, '')) || 99), // Use rank as id, fallback to extracted number
      name: user.username,
      avatar: user.avatar,
      returns: user.roi,
      qualityScore: user.portfolioQuality, // Add quality score
      isUser: user.id === 'current-user'
    }));
    
    setLeaderboardData(convertedData);
    
    if (currentUser) {
      setUserRank(currentUser.rank || 10);
    }
  };
  
  // Initial fetch on mount
  useEffect(() => {
    fetchUpdatedLeaderboard();
  }, []);
  
  // Format the gain/loss values as percentages (projected ROI)
  const formattedLeaderboardData = leaderboardData.map(item => ({
    ...item,
    gain: `${item.returns >= 0 ? '+' : ''}${Math.abs(item.returns).toFixed(1)}%`
  }));
  
  // Get top 3 and user's position
  const topThree = formattedLeaderboardData.slice(0, 3);
  const userPosition = formattedLeaderboardData.find(item => item.isUser) || 
    { id: 5, name: 'Belford&Co', avatar: '👨‍💼', returns: 0, gain: '0.0%', isUser: true };
  
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
              <p className="text-xs text-slate-500">Position #{userRank} | <span className="text-indigo-600 font-medium">Quality Score: {portfolio?.portfolioMetrics?.qualityScore || 0}</span></p>
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
                    <div className="flex flex-col items-end">
                      <div className="text-sm font-semibold text-green-600">
                        {investor.gain}
                      </div>
                      <div className="text-xs font-bold text-indigo-600">
                        Quality: {investor.qualityScore || 0}
                      </div>
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
                <div className="flex flex-col items-end">
                  <div className={`text-sm font-semibold ${userPosition.returns > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {userPosition.gain}
                  </div>
                  <div className="text-xs font-bold text-indigo-600">
                    Quality: {userPosition.qualityScore || 0}
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Positions to beat */}
            <div className="mt-3">
              <div className="text-xs text-slate-500 mb-2">Positions to beat</div>
              <div className="space-y-2">
                {/* Find the next position to beat - use proper rank to find it */}
                {formattedLeaderboardData
                  .filter(investor => {
                    // Find the investor with the next rank above the user
                    return !investor.isUser && // Not the current user
                           userRank > 1 && // User is not already at the top
                           investor.id === userRank - 1; // This is the next rank above
                  })
                  .map((investor) => (
                    <motion.div 
                      key={`next-${investor.id}`}
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
                      <div className="flex flex-col items-end">
                        <div className={`text-sm font-semibold ${investor.returns > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {investor.gain}
                        </div>
                        <div className="text-xs font-bold text-indigo-600">
                          Quality: {investor.qualityScore || 0}
                        </div>
                      </div>
                    </motion.div>
                  ))
                }
                
                {/* If there are no positions above (user is at rank 1) or no match found, show a motivational message */}
                {(userRank === 1 || formattedLeaderboardData.filter(inv => !inv.isUser && inv.id === userRank - 1).length === 0) && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-2 bg-blue-50 rounded-lg border border-blue-100 text-center"
                  >
                    {userRank === 1 ? (
                      <p className="text-sm text-blue-700 font-medium">🏆 You're at the top! Keep it up!</p>
                    ) : (
                      <p className="text-sm text-blue-700 font-medium">
                        Improve your Quality Score to rank #{userRank - 1}
                      </p>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
            
            {/* See full leaderboard button */}
            <div className="mt-4 text-center">
              <Link href="/leaderboard">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm py-2 px-4 rounded-lg 
                             font-medium shadow-sm hover:shadow-md transition-all flex items-center justify-center mx-auto"
                >
                  <span>See full leaderboard</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                </motion.button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}