import React, { useState, useEffect, useContext } from "react";
import { Link } from "wouter";
import { 
  Trophy, 
  TrendingUp, 
  BarChart3, 
  Users, 
  ChevronUp, 
  Search, 
  ArrowLeft, 
  Star,
  Check,
  UserPlus
} from "lucide-react";
import { motion } from "framer-motion";
import { 
  getLeaderboardData, 
  getCurrentUserRank, 
  LeaderboardUser
} from "@/data/leaderboard-data";
import { PortfolioContext } from "@/contexts/portfolio-context";

const LeaderboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"all" | "friends">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [friendsList, setFriendsList] = useState<LeaderboardUser[]>([]);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [currentUser, setCurrentUser] = useState<LeaderboardUser | undefined>();
  const portfolio = useContext(PortfolioContext);
  
  // Update user stats and refetch leaderboard data when portfolio changes
  useEffect(() => {
    if (!portfolio) return;
    
    // Fetch the base leaderboard data (bots only)
    let baseLeaderboardData = getLeaderboardData();
    
    // Construct live user data from the portfolio context
    const userStats: LeaderboardUser = {
      id: "current-user",
      name: "Belford & Co",
      username: "Belford&Co",
      avatar: "/images/default-avatar.png",
      referrals: 0,
      roi: 0,
      trades: 0,
      portfolioQuality: 0
    };
    
    // Get metrics directly from the portfolio context
    userStats.roi = portfolio.portfolioMetrics.roi;
    userStats.trades = portfolio.portfolioMetrics.trades;
    userStats.portfolioQuality = portfolio.portfolioMetrics.qualityScore;
    
    console.log("Leaderboard using portfolio metrics:", {
      roi: userStats.roi.toFixed(2),
      trades: userStats.trades,
      qualityScore: userStats.portfolioQuality
    });
    
    // Update the current user in the base data
    const updatedLeaderboardData = baseLeaderboardData.map(user => 
      user.id === "current-user" ? userStats : user
    );
    
    // Sort by portfolioQuality (quality score) instead of ROI
    const sortedData = [...updatedLeaderboardData].sort((a, b) => b.portfolioQuality - a.portfolioQuality)
      .map((user, index) => ({
        ...user,
        rank: index + 1
      }));
    
    // Update component state
    setLeaderboardData(sortedData);
    setCurrentUser(sortedData.find(u => u.id === "current-user"));
    
  }, [
    portfolio, 
    portfolio?.holdings.length,
    portfolio?.version,
    portfolio?.lastUpdated,
    portfolio?.portfolioMetrics
  ]);
  
  // Initialize data on component mount
  useEffect(() => {
    setLeaderboardData(getLeaderboardData());
    setCurrentUser(getCurrentUserRank());
  }, []);
  
  // Filter data based on search query
  const filteredData = leaderboardData.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Metrics with shorter display names for better mobile layout
  const metrics = [
    { name: "ROI", icon: <TrendingUp className="w-3 h-3" />, key: "roi", format: (val: number) => `${val.toFixed(1)}%` },
    { name: "Trades", icon: <BarChart3 className="w-3 h-3" />, key: "trades", format: (val: number) => val.toString() },
    { 
      name: "Quality", 
      icon: <Star className="w-3 h-3" />, 
      key: "portfolioQuality", 
      format: (val: number) => val.toString(),
      isBold: true // Mark this metric to be displayed in bold
    },
    { name: "Refs", icon: <Users className="w-3 h-3" />, key: "referrals", format: (val: number) => val.toString() },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white pt-10 pb-8 px-4 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <Link href="/">
            <button className="flex items-center text-white/90 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5 mr-1" />
              <span>Back</span>
            </button>
          </Link>
          <h1 className="text-2xl font-bold">Leaderboard</h1>
          <div className="w-5"></div> {/* Empty div for even spacing */}
        </div>
        
        {/* Podium for top 3 - enhanced with better spacing and visual hierarchy */}
        <div className="grid grid-cols-3 max-w-md mx-auto items-end mt-6 mb-6">
          {/* Position 2 */}
          <div className="flex flex-col items-center">
            <motion.div 
              className="relative"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-300 bg-white shadow-md">
                <img 
                  src={filteredData[1]?.avatar || "/images/default-avatar.png"} 
                  alt={filteredData[1]?.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-slate-400 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md">
                2
              </div>
            </motion.div>
            <div className="mt-2 text-center w-full">
              <p className="font-bold text-sm truncate max-w-[100px] mx-auto">{filteredData[1]?.username}</p>
              <div className="flex flex-col space-y-0.5 mt-1">
                <p className="text-xs text-white/90 bg-white/10 rounded-full px-2 py-0.5">
                  <span className="font-bold">{filteredData[1]?.portfolioQuality}</span> Quality
                </p>
                <p className="text-xs text-white/90 bg-white/10 rounded-full px-2 py-0.5">
                  <span className="font-bold">{filteredData[1]?.roi.toFixed(1)}%</span> ROI
                </p>
              </div>
            </div>
            <div className="h-20 w-16 bg-gradient-to-b from-slate-300 to-slate-400 rounded-t-lg mt-3 shadow-inner"></div>
          </div>
          
          {/* Position 1 */}
          <div className="flex flex-col items-center">
            <div className="relative mb-2">
              <Trophy className="w-8 h-8 text-yellow-300 filter drop-shadow-lg" />
            </div>
            <motion.div 
              className="relative"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0 }}
            >
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-yellow-400 bg-white shadow-xl">
                <img 
                  src={filteredData[0]?.avatar || "/images/default-avatar.png"} 
                  alt={filteredData[0]?.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 rounded-full shadow-inner"></div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-slate-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg">
                1
              </div>
              {/* Add glow effect for the winner */}
              <div className="absolute -inset-1 bg-yellow-400/30 rounded-full blur-md -z-10"></div>
            </motion.div>
            <div className="mt-2 text-center w-full">
              <div className="flex items-center justify-center">
                <p className="font-bold text-lg truncate max-w-[120px] mx-auto">{filteredData[0]?.username}</p>
                {filteredData[0]?.isVerified && (
                  <div className="ml-1 bg-blue-500 rounded-full p-0.5">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <div className="flex flex-col space-y-1 mt-1.5">
                <p className="text-xs text-white bg-white/20 rounded-full px-3 py-0.5 font-medium">
                  <span className="font-bold text-base">{filteredData[0]?.portfolioQuality}</span> Quality
                </p>
                <p className="text-xs text-white bg-white/20 rounded-full px-3 py-0.5 font-medium">
                  <span className="font-bold text-base">{filteredData[0]?.roi.toFixed(1)}%</span> ROI
                </p>
              </div>
            </div>
            <div className="h-28 w-20 bg-gradient-to-b from-yellow-300 to-yellow-500 rounded-t-lg mt-3 shadow-inner"></div>
          </div>
          
          {/* Position 3 */}
          <div className="flex flex-col items-center">
            <motion.div 
              className="relative"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-700 bg-white shadow-md">
                <img 
                  src={filteredData[2]?.avatar || "/images/default-avatar.png"} 
                  alt={filteredData[2]?.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-amber-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md">
                3
              </div>
            </motion.div>
            <div className="mt-2 text-center w-full">
              <p className="font-bold text-sm truncate max-w-[100px] mx-auto">{filteredData[2]?.username}</p>
              <div className="flex flex-col space-y-0.5 mt-1">
                <p className="text-xs text-white/90 bg-white/10 rounded-full px-2 py-0.5">
                  <span className="font-bold">{filteredData[2]?.portfolioQuality}</span> Quality
                </p>
                <p className="text-xs text-white/90 bg-white/10 rounded-full px-2 py-0.5">
                  <span className="font-bold">{filteredData[2]?.roi.toFixed(1)}%</span> ROI
                </p>
              </div>
            </div>
            <div className="h-14 w-16 bg-gradient-to-b from-amber-600 to-amber-800 rounded-t-lg mt-3 shadow-inner"></div>
          </div>
        </div>
        
        {/* Tab Selector - improved visual design */}
        <div className="flex justify-center mt-6">
          <div className="bg-white/10 backdrop-blur-sm p-1 rounded-full flex shadow-inner">
            <button 
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'all' ? 'bg-white text-blue-600 shadow-sm' : 'text-white hover:bg-white/10'}`}
              onClick={() => setActiveTab('all')}
            >
              All Investors
            </button>
            <button 
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'friends' ? 'bg-white text-blue-600 shadow-sm' : 'text-white hover:bg-white/10'}`}
              onClick={() => setActiveTab('friends')}
            >
              Friends
            </button>
          </div>
        </div>
      </div>
      
      {/* Search */}
      <div className="px-4 mt-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search investors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
        </div>
      </div>
      
      {/* Leaderboard Content */}
      <div className="px-4 mt-6">
        {activeTab === 'friends' && friendsList.length === 0 ? (
          <motion.div 
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 flex flex-col items-center justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-medium text-slate-800 mb-2">No Friends Yet</h3>
            <p className="text-sm text-slate-500 text-center mb-4">
              Invite friends to compete and compare investment performance!
            </p>
            <Link to="/" className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Friends via Referral
            </Link>
          </motion.div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Jump to My Position Button - Moved to top */}
            {currentUser && (
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-2.5">
                <button 
                  onClick={() => {
                    const userElement = document.getElementById(`leaderboard-user-${currentUser.id}`);
                    if (userElement) {
                      userElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      // Highlight briefly
                      userElement.classList.add('bg-blue-50');
                      setTimeout(() => userElement.classList.remove('bg-blue-50'), 1500);
                    }
                  }}
                  className="w-full flex items-center justify-center text-xs font-medium bg-white hover:bg-blue-50 text-blue-600 py-2 px-3 rounded-lg transition-all shadow-sm hover:shadow border border-blue-200"
                >
                  <div className="mr-1.5 bg-blue-100 rounded-full p-1">
                    <ChevronUp className="w-3 h-3 text-blue-600" />
                  </div>
                  Find my position (#{currentUser.rank})
                </button>
              </div>
            )}
            
            {/* Header Row */}
            <div className="grid grid-cols-[40px_minmax(100px,1.5fr)_repeat(4,_minmax(45px,1fr))] items-center px-2 py-2.5 border-b border-slate-100 bg-slate-50">
              <div className="text-xs font-medium text-slate-600 text-center">Rank</div>
              <div className="text-xs font-medium text-slate-600 pl-1">Investor</div>
              {metrics.map((metric) => (
                <div key={metric.key} className="text-[10px] font-medium text-slate-600 flex items-center justify-center">
                  <span className="mr-0.5">{metric.name}</span>
                  {metric.icon}
                </div>
              ))}
            </div>
            
            {/* Scrollable Leaderboard List */}
            <div className="max-h-[calc(100vh-400px)] overflow-y-auto overflow-x-hidden -webkit-overflow-scrolling-touch">
              {filteredData.map((user, index) => {
                const isCurrentUser = user.id === 'current-user';
                const isTopThree = index < 3;
                const isEvenRow = index % 2 === 0;
                
                return (
                  <motion.div 
                    key={user.id}
                    id={`leaderboard-user-${user.id}`}
                    className={`grid grid-cols-[40px_minmax(100px,1.5fr)_repeat(4,_minmax(45px,1fr))] items-center px-2 py-3 
                      ${isTopThree ? 'bg-gradient-to-r from-blue-50/30 to-white border-t border-slate-100' : 
                        isCurrentUser ? 'bg-blue-50 border-t border-blue-100' : 
                        isEvenRow ? 'bg-slate-50/40 border-t border-slate-100' : 'bg-white border-t border-slate-100'
                      }
                      ${isCurrentUser ? 'border-l-2 border-blue-500' : ''}
                      hover:bg-blue-50/50 transition-colors duration-200`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                  >
                    <div className="flex items-center justify-center">
                      {isTopThree ? (
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm ${
                          index === 0 ? 'bg-gradient-to-br from-yellow-300 to-yellow-500' : 
                          index === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-500' : 
                          'bg-gradient-to-br from-amber-600 to-amber-800'
                        }`}>
                          {index + 1}
                        </div>
                      ) : (
                        <div className="text-xs font-medium text-slate-500">#{index + 1}</div>
                      )}
                    </div>
                    <div className="flex items-center overflow-hidden">
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 flex-shrink-0 mr-2 shadow-sm">
                        <img src={user.avatar || "/images/default-avatar.png"} alt={user.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center">
                          <p className="font-medium text-sm truncate text-slate-700">{user.username}</p>
                          {user.isVerified && (
                            <div className="ml-1 bg-blue-500 rounded-full p-0.5 flex-shrink-0">
                              <Check className="w-2.5 h-2.5 text-white" />
                            </div>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 truncate">{user.name}</p>
                      </div>
                    </div>
                    {metrics.map((metric, mIndex) => (
                      <div 
                        key={metric.key} 
                        className={`text-xs text-center ${metric.isBold ? 'font-semibold' : ''} 
                          ${metric.key === 'roi' && user[metric.key] > 0 ? 'text-green-600' : ''}
                          ${metric.key === 'portfolioQuality' ? 'text-indigo-600 font-semibold' : ''}
                        `}
                      >
                        {metric.format(user[metric.key as keyof LeaderboardUser] as number)}
                      </div>
                    ))}
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      
      {/* Info Box */}
      <div className="px-4 mt-6">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
          <p className="text-sm text-blue-800">
            Your <span className="font-bold">Quality Score</span> determines your ranking! Improve your portfolio's performance, stability, value, and momentum metrics to climb the leaderboard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;