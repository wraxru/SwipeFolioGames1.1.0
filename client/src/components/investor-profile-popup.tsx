import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Check, 
  TrendingUp,
  TrendingDown,
  Minus,
  Award, 
  Users, 
  ChevronDown,
  ArrowUpRight,
  Shield,
  Zap,
  Flame,
  BarChart2,
  PieChart,
  GitBranch,
  Lightbulb,
  Target,
  Feather,
  Clock,
  BookOpen,
  Rocket,
  Briefcase,
  Coffee,
  DollarSign
} from 'lucide-react';
import { LeaderboardUser } from '@/data/leaderboard-data';
import { Progress } from '@/components/ui/progress';

interface InvestorProfilePopupProps {
  investor: LeaderboardUser | null;
  onClose: () => void;
}

// Investor personality data
interface InvestorData {
  quote: string;
  about: string;
  strategy: string;
  icon: React.ReactNode;
  gradient: string;
  strongestSectors: {name: string; value: number; trend: 'up' | 'down' | 'neutral'}[];
  tradeStyle: string;
  riskTolerance: number;
  favoriteSector: string;
}

// Get investor personalized data
const investorData: Record<string, InvestorData> = {
  "KingJames": {
    quote: "Court domination is temporary. Portfolio domination is forever.",
    about: "Just bringing the same championship mindset from the court to my portfolio—striving for greatness in everything I do.",
    strategy: "Plays the market like the fourth quarter of a finals game—calculated risks when behind, conservative moves to protect the lead.",
    icon: <Flame />,
    gradient: "from-purple-500 to-blue-500",
    strongestSectors: [
      {name: "Consumer Discretionary", value: 78, trend: 'up'},
      {name: "Media & Entertainment", value: 65, trend: 'up'}
    ],
    tradeStyle: "Momentum investor",
    riskTolerance: 65,
    favoriteSector: "Sports & Entertainment"
  },
  "ValueBuffet": {
    quote: "I don't pick stocks. I pick businesses worth owning.",
    about: "I still enjoy a good hamburger and cherry Coke while looking for wonderful companies at fair prices.",
    strategy: "Patiently waiting for the market to serve up fat pitches, then betting big when the odds are overwhelmingly in my favor.",
    icon: <BookOpen />,
    gradient: "from-green-500 to-emerald-400",
    strongestSectors: [
      {name: "Financials", value: 92, trend: 'up'},
      {name: "Consumer Staples", value: 87, trend: 'neutral'}
    ],
    tradeStyle: "Value investor",
    riskTolerance: 30,
    favoriteSector: "Insurance"
  },
  "OutsiderTrading": {
    quote: "The best investments are boring on CNBC but exciting in your portfolio.",
    about: "Just a public servant with an uncanny knack for perfectly timed stock purchases—pure coincidence, I assure you.",
    strategy: "Somehow always managing to invest in companies right before favorable legislation passes or major government contracts are announced.",
    icon: <GitBranch />,
    gradient: "from-blue-400 to-indigo-400",
    strongestSectors: [
      {name: "Technology", value: 84, trend: 'up'},
      {name: "Defense", value: 79, trend: 'up'}
    ],
    tradeStyle: "Information advantage",
    riskTolerance: 85,
    favoriteSector: "Government Contractors"
  },
  "JulieSweetCEO": {
    quote: "Success isn't just measured in quarters, but in decades.",
    about: "Transforming companies and portfolios with the same strategic vision—excellence isn't a goal, it's a requirement.",
    strategy: "Identifying companies with strong fundamentals but outdated operating models, then watching them soar as they modernize.",
    icon: <Briefcase />,
    gradient: "from-pink-500 to-rose-400",
    strongestSectors: [
      {name: "Technology Services", value: 91, trend: 'up'},
      {name: "Business Services", value: 85, trend: 'up'}
    ],
    tradeStyle: "Growth at reasonable price",
    riskTolerance: 60,
    favoriteSector: "Consulting"
  },
  "MichelleO": {
    quote: "When markets go low, my investments go high.",
    about: "When they go low with their investments, I go high—building wealth with purpose and integrity.",
    strategy: "Investing in companies that strengthen communities while delivering the steady returns that build generational wealth.",
    icon: <Target />,
    gradient: "from-amber-400 to-orange-400",
    strongestSectors: [
      {name: "Education", value: 82, trend: 'up'},
      {name: "Healthcare", value: 76, trend: 'up'}
    ],
    tradeStyle: "Socially responsible",
    riskTolerance: 50,
    favoriteSector: "Community Development"
  },
  "MrBeast": {
    quote: "I give away millions because my investments make more millions.",
    about: "I approach investing exactly like my videos—go big, be first, and make sure everyone's talking about it.",
    strategy: "Looking for explosive growth opportunities that others dismiss as crazy, while backing them up with surprisingly meticulous research.",
    icon: <Rocket />,
    gradient: "from-red-500 to-red-400",
    strongestSectors: [
      {name: "Digital Media", value: 88, trend: 'up'},
      {name: "Consumer Tech", value: 73, trend: 'up'}
    ],
    tradeStyle: "Growth investor",
    riskTolerance: 90,
    favoriteSector: "Digital Entertainment"
  },
  "ElonMusk": {
    quote: "The market is just crowd-sourced capital allocation.",
    about: "Making life multiplanetary, electrifying transportation, and occasionally moving markets with tweets—just another Tuesday.",
    strategy: "Betting heavily on paradigm-shifting technologies that most people think are impossible until suddenly they're inevitable.",
    icon: <Lightbulb />,
    gradient: "from-blue-500 to-cyan-400",
    strongestSectors: [
      {name: "Electric Vehicles", value: 94, trend: 'up'},
      {name: "Space Technology", value: 89, trend: 'up'}
    ],
    tradeStyle: "Disruptive innovation",
    riskTolerance: 95,
    favoriteSector: "Emerging Technologies"
  },
  "Oprah": {
    quote: "You get a dividend! And YOU get a dividend! EVERYBODY gets dividends!",
    about: "You get returns! And YOU get returns! EVERYBODY gets returns when you invest in what you truly understand.",
    strategy: "Identifying authentic brands and untold stories that resonate deeply with consumers before they become household names.",
    icon: <DollarSign />,
    gradient: "from-purple-400 to-pink-400",
    strongestSectors: [
      {name: "Media", value: 90, trend: 'up'},
      {name: "Consumer Brands", value: 85, trend: 'up'}
    ],
    tradeStyle: "Brand-focused",
    riskTolerance: 55,
    favoriteSector: "Media & Publishing"
  },
  "BettiestWhite": {
    quote: "I've been bullish since before your grandparents were born.",
    about: "I've been investing since before your grandparents were born, and I'll probably outlive your portfolio too.",
    strategy: "Sticking to time-tested blue chips that have survived multiple crashes and still deliver reliable dividends decades later.",
    icon: <Clock />,
    gradient: "from-emerald-400 to-teal-400",
    strongestSectors: [
      {name: "Consumer Staples", value: 85, trend: 'neutral'},
      {name: "Utilities", value: 80, trend: 'neutral'}
    ],
    tradeStyle: "Dividend investor",
    riskTolerance: 20,
    favoriteSector: "Blue Chip Staples"
  },
  "Belford&Co": {
    quote: "The Wolf only loses when he stops hunting.",
    about: "Finding opportunities in markets where others only see chaos. Every volatility spike is just another chance to strike.",
    strategy: "Spotting momentum shifts early and trading aggressively when market sentiment changes direction.",
    icon: <Zap />,
    gradient: "from-blue-600 to-indigo-600",
    strongestSectors: [
      {name: "Technology", value: 75, trend: 'up'},
      {name: "Financials", value: 82, trend: 'up'}
    ],
    tradeStyle: "Tactical trader",
    riskTolerance: 75,
    favoriteSector: "Fintech"
  }
};

// Define the tabs for the profile
type TabType = 'overview' | 'portfolio' | 'badges' | 'properties';

export default function InvestorProfilePopup({ investor, onClose }: InvestorProfilePopupProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const profileRef = useRef<HTMLDivElement>(null);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);
  const [showFollowAnimation, setShowFollowAnimation] = useState(false);
  
  // Handle click outside to dismiss
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Optional: Add swipe down listener for mobile
    const handleTouchStart = (e: TouchEvent) => {
      setTouchStartY(e.touches[0].clientY);
      setTouchStartX(e.touches[0].pageX);
      
      const handleTouchMove = (e: TouchEvent) => {
        const currentY = e.touches[0].clientY;
        const currentX = e.touches[0].pageX;
        
        // Detect swipe direction
        const deltaY = currentY - touchStartY;
        const deltaX = currentX - touchStartX;
        
        // If primarily vertical swipe down
        if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY > 50) { 
          onClose();
          document.removeEventListener('touchmove', handleTouchMove);
        } 
        // If primarily horizontal swipe
        else if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 30) {
          // Determine which direction to swipe
          if (deltaX > 0) {
            // Swipe right - previous tab
            const tabs: TabType[] = ['overview', 'portfolio', 'badges', 'properties'];
            const currentIndex = tabs.indexOf(activeTab);
            if (currentIndex > 0) {
              setActiveTab(tabs[currentIndex - 1]);
            }
          } else {
            // Swipe left - next tab
            const tabs: TabType[] = ['overview', 'portfolio', 'badges', 'properties'];
            const currentIndex = tabs.indexOf(activeTab);
            if (currentIndex < tabs.length - 1) {
              setActiveTab(tabs[currentIndex + 1]);
            }
          }
          document.removeEventListener('touchmove', handleTouchMove);
        }
      };
      
      document.addEventListener('touchmove', handleTouchMove);
      
      const handleTouchEnd = () => {
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
      
      document.addEventListener('touchend', handleTouchEnd);
    };
    
    if (profileRef.current) {
      profileRef.current.addEventListener('touchstart', handleTouchStart);
    }
    
    // Add haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(10); // Subtle vibration on open
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (profileRef.current) {
        profileRef.current.removeEventListener('touchstart', handleTouchStart);
      }
    };
  }, [onClose, activeTab, touchStartY, touchStartX]);
  
  if (!investor) return null;
  
  // Animation for the follow button
  const handleFollowClick = () => {
    setShowFollowAnimation(true);
    if (navigator.vibrate) {
      navigator.vibrate([15, 30, 15]); // Haptic feedback pattern
    }
    setTimeout(() => setShowFollowAnimation(false), 1500);
  };

  // Determine if this is a premium user (for demo, use isVerified)
  const isPremium = investor.isVerified;
  
  // Get personalized data for this investor
  const personalData = investorData[investor.username] || {
    quote: "Investing is the only place where saving is spending.",
    about: "Finding unique opportunities in the market that others overlook.",
    strategy: "Balanced approach with a focus on long-term growth and capital preservation.",
    icon: <BarChart2 />,
    gradient: "from-blue-500 to-indigo-500",
    strongestSectors: [
      {name: "Technology", value: 75, trend: 'up'},
      {name: "Healthcare", value: 65, trend: 'up'}
    ],
    tradeStyle: "Balanced investor",
    riskTolerance: 60,
    favoriteSector: "Technology"
  };
  
  // Calculate rank badge style
  const getBadgeStyles = (rank: number = 99) => {
    if (rank === 1) return { color: 'gold', label: '#1' };
    if (rank === 2) return { color: 'silver', label: '#2' };
    if (rank === 3) return { color: 'bronze', label: '#3' };
    return { color: 'blue', label: `#${rank}` };
  };
  
  const rankBadge = getBadgeStyles(investor.rank);
  
  // Calculate membership time - for demo purposes, random between 1-24 months
  const memberMonths = investor.id === 'current-user' ? 3 : Math.floor(Math.random() * 24) + 1;
  const memberSince = new Date();
  memberSince.setMonth(memberSince.getMonth() - memberMonths);
  const memberSinceFormatted = memberSince.toLocaleString('default', { month: 'short', year: 'numeric' });

  // Mock data for tabs
  const mockBadges = [
    { name: 'Quick Starter', icon: '🚀', earned: true, progress: 100 },
    { name: 'Diversification Pro', icon: '🌈', earned: investor.portfolioQuality > 70, progress: Math.min(100, investor.portfolioQuality) },
    { name: 'Social Butterfly', icon: '🦋', earned: investor.referrals > 50, progress: Math.min(100, investor.referrals * 2) },
    { name: 'Trade Master', icon: '📊', earned: investor.trades > 100, progress: Math.min(100, investor.trades) },
    { name: 'ROI Champion', icon: '🏆', earned: investor.roi > 100, progress: Math.min(100, investor.roi) },
    { name: 'Diamond Hands', icon: '💎', earned: false, progress: 45 },
  ];
  
  const mockProperties = [
    { name: 'Luxury Penthouse', value: '1,500,000 FB', acquired: '3 months ago', image: '/images/property-penthouse.jpg' },
    { name: 'Sports Car', value: '350,000 FB', acquired: '1 month ago', image: '/images/property-car.jpg' },
    { name: 'Yacht Club Membership', value: '250,000 FB', acquired: '2 weeks ago', image: '/images/property-yacht.jpg' },
  ];

  // Animation variants for the popup
  const popupVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { 
        type: 'spring', 
        damping: 25, 
        stiffness: 500 
      } 
    },
    exit: { opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } }
  };

  // Function to render appropriate tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <h4 className="text-sm font-medium text-slate-700 mb-2">About</h4>
              <p className="text-sm text-slate-600">
                {investor.id === 'current-user'
                  ? 'Your investment journey is just beginning. Build your portfolio and climb the leaderboard!'
                  : personalData.about
                }
              </p>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <h4 className="text-sm font-medium text-slate-700 mb-2">Investment Strategy</h4>
              <p className="text-sm text-slate-600">
                {investor.id === 'current-user'
                  ? 'Developing a more refined approach to stock selection and portfolio construction as you learn more about the markets.'
                  : personalData.strategy
                }
              </p>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <h4 className="text-sm font-medium text-slate-700 mb-2">Strongest Sectors</h4>
              {investor.id === 'current-user' ? (
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <div className="text-xs font-medium text-slate-500">Technology</div>
                    <div className="flex items-end justify-between">
                      <div className="text-sm font-bold text-slate-700">65%</div>
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    </div>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <div className="text-xs font-medium text-slate-500">Financials</div>
                    <div className="flex items-end justify-between">
                      <div className="text-sm font-bold text-slate-700">52%</div>
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {personalData.strongestSectors.map((sector, index) => (
                    <div key={index} className="bg-white p-2 rounded-lg border border-slate-200">
                      <div className="text-xs font-medium text-slate-500">{sector.name}</div>
                      <div className="flex items-end justify-between">
                        <div className="text-sm font-bold text-slate-700">{sector.value}%</div>
                        {sector.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
                        {sector.trend === 'down' && <TrendingDown className="h-3 w-3 text-red-500" />}
                        {sector.trend === 'neutral' && <Minus className="h-3 w-3 text-slate-500" />}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {isPremium && (
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-slate-700">FinBucks Balance</h4>
                  <div className="px-2 py-1 bg-purple-100 rounded-full">
                    <span className="text-xs font-medium text-purple-700">Premium</span>
                  </div>
                </div>
                <div className="text-xl font-bold text-slate-800 mt-1">
                  {(investor.roi * 1000 + investor.portfolioQuality * 100).toLocaleString()} FB
                </div>
              </div>
            )}
          </div>
        );
        
      case 'portfolio':
        // For non-premium users, show a blurred/locked view
        if (!isPremium && investor.id !== 'current-user') {
          return (
            <div className="relative">
              <div className="absolute inset-0 backdrop-blur-sm bg-white/50 z-10 flex flex-col items-center justify-center rounded-xl">
                <div className="bg-purple-100 rounded-full p-3 mb-3">
                  <Shield className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="text-lg font-medium text-slate-800 mb-1">Premium Feature</h3>
                <p className="text-sm text-slate-500 text-center mb-3 max-w-xs">
                  Upgrade to Premium to view other investors' portfolios and learn from the best.
                </p>
                <button className="px-4 py-2 bg-purple-500 text-white rounded-full text-sm font-medium hover:bg-purple-600 transition-colors">
                  Upgrade to Premium
                </button>
              </div>
              
              {/* Blurred background content */}
              <div className="opacity-20 pointer-events-none">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-4">
                  <h4 className="text-sm font-medium text-slate-700 mb-3">Sector Allocation</h4>
                  <div className="h-40 bg-slate-200 rounded-lg"></div>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Top Holdings</h4>
                  <div className="space-y-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="p-2 bg-white rounded-lg border border-slate-200">
                        <div className="h-6 bg-slate-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        }
        
        // For premium users or own profile
        return (
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <h4 className="text-sm font-medium text-slate-700 mb-3">Sector Allocation</h4>
              <div className="relative h-40 rounded-lg overflow-hidden">
                {/* Simple mock chart - in real app, use a proper chart library */}
                <div className="absolute inset-0 flex">
                  <div className="h-full bg-blue-500" style={{ width: '30%' }}></div>
                  <div className="h-full bg-green-500" style={{ width: '25%' }}></div>
                  <div className="h-full bg-yellow-500" style={{ width: '20%' }}></div>
                  <div className="h-full bg-red-500" style={{ width: '15%' }}></div>
                  <div className="h-full bg-purple-500" style={{ width: '10%' }}></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-xs text-white font-medium bg-slate-800/70 px-2 py-1 rounded-full">
                    Interactive chart (Premium)
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <div className="flex items-center text-xs">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                  <span>Tech 30%</span>
                </div>
                <div className="flex items-center text-xs">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                  <span>Finance 25%</span>
                </div>
                <div className="flex items-center text-xs">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
                  <span>Energy 20%</span>
                </div>
                <div className="flex items-center text-xs">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                  <span>Health 15%</span>
                </div>
                <div className="flex items-center text-xs">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-1"></div>
                  <span>Other 10%</span>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <h4 className="text-sm font-medium text-slate-700 mb-2">Recent Trades</h4>
              <div className="space-y-2">
                <div className="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-emerald-100 rounded-lg h-8 w-8 flex items-center justify-center mr-2">
                      <span className="text-xs font-medium text-emerald-700">AAPL</span>
                    </div>
                    <span className="text-sm font-medium">Buy</span>
                  </div>
                  <div className="text-sm text-slate-500">10 shares</div>
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-red-100 rounded-lg h-8 w-8 flex items-center justify-center mr-2">
                      <span className="text-xs font-medium text-red-700">TSLA</span>
                    </div>
                    <span className="text-sm font-medium">Sell</span>
                  </div>
                  <div className="text-sm text-slate-500">5 shares</div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <h4 className="text-sm font-medium text-slate-700 mb-2">Top Holdings</h4>
              <div className="space-y-2">
                <div className="p-2 bg-white rounded-lg border border-slate-200 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-blue-100 rounded-lg h-8 w-8 flex items-center justify-center mr-2">
                      <span className="text-xs font-medium text-blue-700">AAPL</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Apple Inc.</div>
                      <div className="text-xs text-slate-500">Technology</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-green-600">+4.2%</div>
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-200 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-blue-100 rounded-lg h-8 w-8 flex items-center justify-center mr-2">
                      <span className="text-xs font-medium text-blue-700">MSFT</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Microsoft</div>
                      <div className="text-xs text-slate-500">Technology</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-green-600">+2.8%</div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'badges':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {mockBadges.map((badge, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-xl border ${badge.earned ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-100'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-2xl">{badge.icon}</div>
                    {badge.earned && (
                      <div className="bg-green-100 rounded-full p-0.5">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                    )}
                  </div>
                  <div className="text-sm font-medium text-slate-700 mb-1">{badge.name}</div>
                  
                  {badge.earned ? (
                    <div className="text-xs text-green-600 font-medium">Earned</div>
                  ) : (
                    <div>
                      <Progress value={badge.progress} max={100} className="h-1.5 mb-1" />
                      <div className="text-xs text-slate-500">{badge.progress}% Complete</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-slate-700">Locked Badges</h4>
                <div className="text-xs text-slate-500">3 remaining</div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="aspect-square rounded-lg bg-slate-200 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-slate-300"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'properties':
        return (
          <div className="space-y-4">
            {isPremium || investor.id === 'current-user' ? (
              <>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <h4 className="text-sm font-medium text-slate-700 mb-3">Virtual Assets</h4>
                  <div className="space-y-3">
                    {mockProperties.map((property, index) => (
                      <div 
                        key={index}
                        className="bg-white rounded-lg border border-slate-200 overflow-hidden"
                      >
                        <div className="h-24 bg-slate-300 w-full"></div>
                        <div className="p-3">
                          <div className="flex items-center justify-between">
                            <h5 className="text-sm font-medium text-slate-800">{property.name}</h5>
                            <div className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                              {property.value}
                            </div>
                          </div>
                          <div className="text-xs text-slate-500 mt-1">Acquired {property.acquired}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-slate-700">Total Asset Value</h4>
                    <div className="px-2 py-0.5 bg-green-100 rounded-full">
                      <span className="text-xs font-medium text-green-700">+12% this month</span>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-slate-800">
                    2,100,000 FB
                  </div>
                </div>
              </>
            ) : (
              // For non-premium users, show a locked view
              <div className="relative">
                <div className="absolute inset-0 backdrop-blur-sm bg-white/50 z-10 flex flex-col items-center justify-center rounded-xl">
                  <div className="bg-purple-100 rounded-full p-3 mb-3">
                    <Shield className="h-6 w-6 text-purple-500" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-800 mb-1">Premium Feature</h3>
                  <p className="text-sm text-slate-500 text-center mb-3 max-w-xs">
                    Upgrade to Premium to view virtual assets and properties owned by other investors.
                  </p>
                  <button className="px-4 py-2 bg-purple-500 text-white rounded-full text-sm font-medium hover:bg-purple-600 transition-colors">
                    Upgrade to Premium
                  </button>
                </div>
                
                {/* Blurred background content */}
                <div className="opacity-20 pointer-events-none space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-40 bg-slate-200 rounded-xl"></div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  // Render the popup
  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          ref={profileRef}
          variants={popupVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="bg-white rounded-2xl shadow-xl max-w-sm w-full overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 z-20 bg-slate-100 rounded-full p-1.5 hover:bg-slate-200 transition-colors"
          >
            <X className="h-4 w-4 text-slate-600" />
          </button>
          
          {/* Header Section */}
          <div className="relative">
            {/* Profile header background with subtle gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 z-0"></div>
            
            <div className="relative z-10 p-5">
              <div className="flex items-start">
                {/* Avatar with rank badge */}
                <div className="relative mr-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-md">
                    <img 
                      src={investor.avatar || "/images/default-avatar.png"} 
                      alt={investor.username} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Rank badge overlay */}
                  <div 
                    className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md border-2 border-white
                      ${rankBadge.color === 'gold' ? 'bg-gradient-to-br from-yellow-400 to-yellow-500' :
                        rankBadge.color === 'silver' ? 'bg-gradient-to-br from-slate-400 to-slate-500' :
                        rankBadge.color === 'bronze' ? 'bg-gradient-to-br from-amber-600 to-amber-700' :
                        'bg-gradient-to-br from-blue-500 to-blue-600'}`
                    }
                  >
                    {rankBadge.label}
                  </div>
                </div>
                
                {/* User info */}
                <div className="flex-1">
                  <div className="flex items-center">
                    <h2 className="text-xl font-bold text-slate-800">{investor.username}</h2>
                    {isPremium && (
                      <div className="ml-1.5 bg-blue-500 rounded-full p-0.5">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-slate-500">{investor.name}</p>
                  <div className="flex items-center mt-1 space-x-2">
                    <div className="px-2 py-0.5 bg-indigo-100 rounded-full flex items-center">
                      {rankBadge.color === 'gold' ? (
                        <span className="text-xs font-medium text-yellow-700">Diamond Tier</span>
                      ) : rankBadge.color === 'silver' ? (
                        <span className="text-xs font-medium text-slate-700">Platinum Tier</span>
                      ) : rankBadge.color === 'bronze' ? (
                        <span className="text-xs font-medium text-amber-700">Gold Tier</span>
                      ) : (
                        <span className="text-xs font-medium text-blue-700">Silver Tier</span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500">
                      Investing since {memberSinceFormatted}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Quote section */}
              <div className="mt-4 bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-slate-100 shadow-sm">
                <div className="flex">
                  <div className="text-slate-300 text-xl leading-none">"</div>
                  <p className="text-sm text-slate-600 italic flex-1 px-1">{personalData.quote}</p>
                  <div className="text-slate-300 text-xl leading-none self-end">"</div>
                </div>
              </div>
              
              {/* Stats cards */}
              <div className="grid grid-cols-4 gap-2 mt-4">
                <div className="bg-white rounded-xl shadow-sm p-2 border border-slate-100">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs text-slate-500">ROI</span>
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  </div>
                  <div className="flex items-baseline">
                    <span className={`text-sm font-bold ${investor.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {investor.roi.toFixed(1)}%
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1">
                      {investor.roi >= 0 ? '↑' : '↓'}
                    </span>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-2 border border-slate-100">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs text-slate-500">Quality</span>
                    <Award className="h-3 w-3 text-blue-500" />
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-sm font-bold text-slate-700">
                      {investor.portfolioQuality}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1">/100</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-2 border border-slate-100">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs text-slate-500">Trades</span>
                    <ArrowUpRight className="h-3 w-3 text-slate-500" />
                  </div>
                  <div className="text-sm font-bold text-slate-700">
                    {investor.trades}
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-2 border border-slate-100">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs text-slate-500">Refs</span>
                    <Users className="h-3 w-3 text-purple-500" />
                  </div>
                  <div className="text-sm font-bold text-slate-700">
                    {investor.referrals}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tab navigation */}
          <div className="px-4 border-b border-slate-200">
            <div className="flex space-x-4">
              {(["overview", "portfolio", "badges", "properties"] as const).map((tab) => (
                <button
                  key={tab}
                  className={`py-3 px-1 text-sm font-medium relative ${
                    activeTab === tab 
                      ? 'text-blue-600' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {activeTab === tab && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                    />
                  )}
                  
                  {/* Premium lock indicator for certain tabs */}
                  {(tab === 'portfolio' || tab === 'properties') && 
                   !isPremium && 
                   investor.id !== 'current-user' && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Tab content with scrolling */}
          <div className="flex-1 overflow-y-auto p-4">
            {renderTabContent()}
          </div>
          
          {/* Action buttons */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex space-x-2">
            {isPremium && (
              <button 
                className="flex-1 py-2.5 bg-purple-100 text-purple-700 rounded-xl font-medium text-sm hover:bg-purple-200 transition-colors"
              >
                Follow
              </button>
            )}
            
            <button 
              className="flex-1 py-2.5 bg-blue-500 text-white rounded-xl font-medium text-sm hover:bg-blue-600 transition-colors"
            >
              Challenge
            </button>
            
            <button 
              className="flex items-center justify-center w-10 h-10 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
              onClick={() => window.open(`/profile/${investor.username}`, '_blank')}
            >
              <ChevronDown className="h-5 w-5 text-slate-600 rotate-270" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}