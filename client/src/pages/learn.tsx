import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import AppNavigation from "@/components/app-navigation";
import { motion, AnimatePresence, useSpring } from "framer-motion";
import {
  Brain,
  Trophy,
  History,
  Briefcase,
  LineChart,
  Gamepad2,
  Building2,
  Users,
  TrendingUp,
  Star,
  Heart,
  Save,
  ArrowLeft,
  DollarSign,
  Lightbulb,
  AlertTriangle
} from "lucide-react";
import { useLocation } from "wouter";
import { NORMAL_DECISIONS, BOARDROOM_DECISIONS } from '@/constants/ceo-decisions';

interface Company {
  name: string;
  value: number;
  employees: number;
  revenue: number;
  happiness: number;
  innovation: number;
  reputation: number;
}

interface Decision {
  id: number;
  title: string;
  description: string;
  options: {
    text: string;
    effects: {
      value?: number;
      employees?: number;
      revenue?: number;
      happiness?: number;
      innovation?: number;
      reputation?: number;
    };
  }[];
  icon: JSX.Element;
  iconColor: string;
}

const INITIAL_COMPANY: Company = {
  name: "Startup Inc.",
  value: 100000,
  employees: 5,
  revenue: 10000,
  happiness: 80,
  innovation: 70,
  reputation: 60
};

const DECISIONS: Decision[] = [
  {
    id: 1,
    title: "Basic Financial Planning",
    description: "Your CFO suggests implementing basic financial planning tools. (Level 1 Finance Tip: Budgeting is the foundation of financial success)",
    options: [
      {
        text: "Implement budgeting software",
        effects: { 
          value: -5000,
          revenue: 2000,
          innovation: 8,
          happiness: -5  // Employees dislike strict budget tracking
        }
      },
      {
        text: "Hire financial analysts",
        effects: { 
          value: -15000,
          revenue: 3000,
          employees: 2,
          reputation: 10,
          happiness: -8  // Team feels monitored
        }
      },
      {
        text: "Continue with spreadsheets",
        effects: { 
          value: 2000,  // Saves money
          innovation: -10,
          reputation: -5
        }
      }
    ],
    icon: <Brain className="w-6 h-6 text-purple-500" />,
    iconColor: "text-purple-500"
  },
  {
    id: 2,
    title: "Employee Wellness",
    description: "Employees are requesting a wellness program. (Happy employees are productive employees!)",
    options: [
      {
        text: "Full program (gym, counseling, health insurance)",
        effects: { 
          value: -20000,
          happiness: 25,
          reputation: 15,
          revenue: -1000  // Short term cost
        }
      },
      {
        text: "Basic health insurance only",
        effects: { 
          value: -10000,
          happiness: 10,
          reputation: 5,
          innovation: -5  // Less creative environment
        }
      },
      {
        text: "Wellness workshops only",
        effects: { 
          value: -2000,
          happiness: 5,
          reputation: -5,  // Seen as minimal effort
          innovation: -2
        }
      }
    ],
    icon: <Heart className="w-6 h-6 text-red-500" />,
    iconColor: "text-red-500"
  },
  {
    id: 3,
    title: "Office Pet Policy",
    description: "The team suggests allowing pets in the office! 🐕",
    options: [
      {
        text: "Allow all pets",
        effects: { 
          happiness: 20,
          innovation: 5,
          reputation: -10,  // Some clients may dislike it
          revenue: -500    // Additional cleaning costs
        }
      },
      {
        text: "Designated pet days only",
        effects: { 
          happiness: 10,
          reputation: -2,
          innovation: 2
        }
      },
      {
        text: "Keep pet-free policy",
        effects: { 
          happiness: -10,
          reputation: 5,   // Professional image
          revenue: 200     // No additional maintenance
        }
      }
    ],
    icon: <Heart className="w-6 h-6 text-yellow-500" />,
    iconColor: "text-yellow-500"
  },
  {
    id: 4,
    title: "Innovation Challenge",
    description: "Your R&D team has some wild ideas! (Level 5+ Tip: Innovation drives long-term growth)",
    options: [
      {
        text: "Fund experimental projects",
        effects: { 
          value: -30000,
          innovation: 25,
          reputation: 15,
          revenue: -2000,
          happiness: 15
        }
      },
      {
        text: "Focus on practical improvements",
        effects: { 
          innovation: 10,
          value: -10000,
          revenue: 1000,
          happiness: -5    // Less exciting work
        }
      },
      {
        text: "Maintain current projects",
        effects: { 
          innovation: -10,
          happiness: -8,
          reputation: -5,
          revenue: 500     // Short-term savings
        }
      }
    ],
    icon: <Brain className="w-6 h-6 text-blue-500" />,
    iconColor: "text-blue-500"
  },
  {
    id: 5,
    title: "Work Environment",
    description: "Time to decide on the office work policy!",
    options: [
      {
        text: "Full remote work",
        effects: { 
          value: 20000,    // Save on office costs
          happiness: 15,
          innovation: -10,  // Less in-person collaboration
          reputation: -5    // Some clients prefer office presence
        }
      },
      {
        text: "Hybrid model",
        effects: { 
          value: 5000,
          happiness: 10,
          innovation: 5,
          revenue: -500    // Maintaining both setups
        }
      },
      {
        text: "Full office return",
        effects: { 
          value: -10000,   // Office costs
          happiness: -15,   // Some prefer remote
          innovation: 15,   // Better collaboration
          reputation: 10    // Traditional business image
        }
      }
    ],
    icon: <Building2 className="w-6 h-6 text-green-500" />,
    iconColor: "text-green-500"
  },
  {
    id: 6,
    title: "Marketing Strategy",
    description: "Choose your company's marketing approach:",
    options: [
      {
        text: "Social Media Focus",
        effects: { 
          value: -5000,
          reputation: 15,
          innovation: 10,
          revenue: -1000,
          happiness: -5    // Social media pressure
        }
      },
      {
        text: "Traditional Marketing",
        effects: { 
          value: -15000,
          reputation: 5,
          revenue: 2000,
          innovation: -10  // Less modern approach
        }
      },
      {
        text: "Word of Mouth Only",
        effects: { 
          value: 5000,     // Save money
          reputation: -10,  // Limited reach
          revenue: -2000,
          innovation: -5
        }
      }
    ],
    icon: <TrendingUp className="w-6 h-6 text-purple-500" />,
    iconColor: "text-purple-500"
  },
  {
    id: 7,
    title: "Team Building",
    description: "How will you strengthen team bonds?",
    options: [
      {
        text: "Extreme Sports Retreat",
        effects: { 
          value: -20000,
          happiness: 25,
          innovation: 15,
          reputation: -5,   // Seen as risky
          employees: -1     // Someone quit in protest
        }
      },
      {
        text: "Volunteer Project",
        effects: { 
          value: -5000,
          happiness: 15,
          reputation: 20,
          revenue: -500,
          innovation: 5
        }
      },
      {
        text: "Online Game Tournament",
        effects: { 
          value: -1000,
          happiness: 10,
          innovation: 5,
          reputation: -10,  // Less professional image
          revenue: 200     // Minimal costs
        }
      }
    ],
    icon: <Users className="w-6 h-6 text-pink-500" />,
    iconColor: "text-pink-500"
  }
];

const StatCard = ({ title, value, icon, format, previousValue }) => {
  const change = value - (previousValue || value);
  const changeColor = change > 0 ? 'text-green-500' : change < 0 ? 'text-red-500' : 'text-blue-500';
  const changeIcon = change > 0 ? '↑' : change < 0 ? '↓' : '→';

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500">{title}</span>
          {icon}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">{format ? format(value) : value}</span>
          {previousValue !== undefined && (
            <span className={`text-xs font-medium ${changeColor}`}>
              {changeIcon} {Math.abs(change).toLocaleString()}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const MetricBar = ({ title, value, icon, previousValue }) => {
  const change = value - (previousValue || value);
  const color = change > 0 ? 'bg-green-500' : change < 0 ? 'bg-red-500' : 'bg-blue-500';
  const changeColor = change > 0 ? 'text-green-500' : change < 0 ? 'text-red-500' : 'text-blue-500';
  const changeIcon = change > 0 ? '↑' : change < 0 ? '↓' : '→';

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">{title}</span>
        {icon}
      </div>
      <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div 
          className={`absolute top-0 left-0 h-full ${color} rounded-full`}
          animate={{ width: `${value}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 30 }}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{value}%</span>
        {previousValue !== undefined && (
          <span className={`text-sm font-medium ${changeColor}`}>
            {changeIcon} {Math.abs(change)}%
          </span>
        )}
      </div>
    </div>
  );
};

export default function LearnPage() {
  const [, setLocation] = useLocation();
  const [showCEOGame, setShowCEOGame] = useState(false);
  const [isBoardRoomMode, setIsBoardRoomMode] = useState(false);
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  const [gameState, setGameState] = useState({
    company: INITIAL_COMPANY,
    previousCompany: null as Company | null,
    level: 1,
    xp: 0,
    decisions: 0,
    currentDecision: null as Decision | null,
    decisionHistory: [] as {
      decision: Decision;
      effect: any;
      timestamp: string;
    }[]
  });

  // Add ref to track scroll position
  const scrollRef = useRef<HTMLDivElement>(null);

  // Add effect to track state changes
  useEffect(() => {
    console.log('Game state changed:', {
      showCEOGame,
      gameState,
      timestamp: new Date().toISOString()
    });
  }, [gameState, showCEOGame]);

  const xpProgress = (gameState.xp % 100) / 100 * 100;

  const handleDecision = (effects: any) => {
    // Save current scroll position
    const currentScroll = scrollRef.current?.scrollTop || 0;
    
    // Store previous values for comparison
    const previousCompany = { ...gameState.company };
    
    const newCompany = { ...gameState.company };
    
    // Apply effects to company metrics
    Object.entries(effects).forEach(([key, value]) => {
      if (key in newCompany) {
        // @ts-ignore
        newCompany[key] += value as number;
        
        // Clamp percentage values between 0 and 100
        if (key === 'happiness' || key === 'innovation' || key === 'reputation') {
          newCompany[key] = Math.max(0, Math.min(100, newCompany[key]));
        }
        // Ensure minimum values for numerical metrics
        if (key === 'value') {
          newCompany[key] = Math.max(1000, newCompany[key]); // Minimum company value
        }
        if (key === 'revenue') {
          newCompany[key] = Math.max(0, newCompany[key]);
        }
        if (key === 'employees') {
          newCompany[key] = Math.max(1, newCompany[key]); // At least 1 employee
        }
      }
    });

    // Calculate new XP and level
    const newXP = gameState.xp + (isBoardRoomMode ? 20 : 10);
    const newLevel = Math.floor(newXP / 100) + 1;

    // Update game state
    setGameState(prev => ({
      ...prev,
      company: newCompany,
      previousCompany, // Store previous values for comparison
      decisions: prev.decisions + 1,
      xp: newXP,
      level: newLevel,
      decisionHistory: [
        {
          decision: prev.currentDecision!,
          effect: effects,
          timestamp: new Date().toISOString()
        },
        ...prev.decisionHistory
      ]
    }));

    // Generate next decision immediately
    generateDecision();

    // Restore scroll position after state updates
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = currentScroll;
      }
    });
  };

  const generateDecision = () => {
    const decisions = isBoardRoomMode ? BOARDROOM_DECISIONS : NORMAL_DECISIONS;
    
    // Filter out decisions that have already been made in the current session
    const availableDecisions = decisions.filter(decision => 
      !gameState.decisionHistory.some(historyItem => 
        historyItem.decision.title === decision.title
      )
    );

    // If we've used all decisions, reset the pool
    const decisionsToUse = availableDecisions.length > 0 ? availableDecisions : decisions;
    
    const randomIndex = Math.floor(Math.random() * decisionsToUse.length);
    setGameState(prev => ({
      ...prev,
      currentDecision: decisionsToUse[randomIndex]
    }));
  };

  const resetGame = () => {
    setGameState({
      company: INITIAL_COMPANY,
      level: 1,
      xp: 0,
      decisions: 0,
      currentDecision: null,
      decisionHistory: [],
      previousCompany: null
    });
    setShowResetConfirmation(false);
    setIsBoardRoomMode(false);
  };

  const ResetConfirmationDialog = () => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <Card className="w-[90%] max-w-md mx-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-yellow-500" />
            Reset Game?
          </CardTitle>
          <CardDescription>
            Are you sure you want to reset? You will lose all your progress and return to mode selection.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setShowResetConfirmation(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            onClick={resetGame}
          >
            Reset Game
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const CEOGameInterface = () => {
    return (
      <div className="fixed inset-0 bg-white z-50">
        <div 
          ref={scrollRef}
          className="container mx-auto px-4 py-8 h-full overflow-y-auto"
        >
          <div className="mb-6 sticky top-0 bg-white z-10 py-4">
            <div className="flex justify-between items-center">
              <Button
                onClick={() => {
                  setShowCEOGame(false);
                  setIsBoardRoomMode(false);
                }}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Games
              </Button>
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-2 ${isBoardRoomMode ? 'text-red-600' : 'text-blue-600'}`}>
                  {isBoardRoomMode ? (
                    <>
                      <Building2 className="w-5 h-5" />
                      <span className="font-semibold">CEO Simulator - Board Room Mode</span>
                    </>
                  ) : (
                    <>
                      <Briefcase className="w-5 h-5" />
                      <span className="font-semibold">CEO Simulator - Normal Mode</span>
                    </>
                  )}
                </div>
                <Button
                  onClick={() => setShowResetConfirmation(true)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Reset Game
                </Button>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{gameState.company.name}</h1>
            <p className="text-gray-600">Level {gameState.level} • {gameState.decisions} Decisions Made</p>
          </div>

          {/* Numerical Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatCard
              title="Company Value"
              value={gameState.company.value}
              icon={<DollarSign className="w-5 h-5 text-green-500" />}
              format={(v) => "$" + v.toLocaleString()}
              previousValue={gameState.previousCompany?.value}
            />
            <StatCard
              title="Monthly Revenue"
              value={gameState.company.revenue}
              icon={<TrendingUp className="w-5 h-5 text-blue-500" />}
              format={(v) => "$" + v.toLocaleString()}
              previousValue={gameState.previousCompany?.revenue}
            />
            <StatCard
              title="Team Size"
              value={gameState.company.employees}
              icon={<Users className="w-5 h-5 text-purple-500" />}
              format={(v) => v + " employees"}
              previousValue={gameState.previousCompany?.employees}
            />
          </div>

          {/* Percentage Metrics */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="grid gap-6">
                <MetricBar
                  title="Employee Happiness"
                  value={gameState.company.happiness}
                  icon={<Heart className="w-5 h-5 text-red-500" />}
                  previousValue={gameState.previousCompany?.happiness}
                />
                <MetricBar
                  title="Innovation Level"
                  value={gameState.company.innovation}
                  icon={<Lightbulb className="w-5 h-5 text-yellow-500" />}
                  previousValue={gameState.previousCompany?.innovation}
                />
                <MetricBar
                  title="Company Reputation"
                  value={gameState.company.reputation}
                  icon={<Star className="w-5 h-5 text-yellow-500" />}
                  previousValue={gameState.previousCompany?.reputation}
                />
              </div>
            </CardContent>
          </Card>

          {/* Current Decision */}
          <div className="mb-8">
            {gameState.currentDecision ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    {gameState.currentDecision.icon && (
                      <gameState.currentDecision.icon 
                        className={`w-6 h-6 ${gameState.currentDecision.iconColor}`} 
                      />
                    )}
                    {gameState.currentDecision.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{gameState.currentDecision.description}</p>
                  <div className="grid gap-3">
                    {gameState.currentDecision.options.map((option, index) => (
                      <Button
                        key={index}
                        onClick={() => handleDecision(option.effects)}
                        variant="outline"
                        className="w-full text-left justify-start h-auto py-3 px-4"
                      >
                        {option.text}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="flex justify-center">
                <Button 
                  onClick={() => generateDecision()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Next Decision
                </Button>
              </div>
            )}
          </div>

          {/* Decision History */}
          {gameState.decisionHistory.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Decision History</h2>
              <div className="space-y-4">
                {gameState.decisionHistory.map((historyItem, index) => (
                  <Card key={index} className="bg-gray-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-lg">
                        {historyItem.decision.icon && (
                          <historyItem.decision.icon 
                            className={`w-6 h-6 ${historyItem.decision.iconColor}`}
                          />
                        )}
                        {historyItem.decision.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        {new Date(historyItem.timestamp).toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
        {showResetConfirmation && <ResetConfirmationDialog />}
      </div>
    );
  };

  const ModeSelection = () => (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <div className="mb-6 sticky top-0 bg-white z-10 py-4">
          <Button
            onClick={() => setShowCEOGame(false)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Games
          </Button>
        </div>
        
        <h1 className="text-3xl font-bold mb-2">CEO Simulator</h1>
        <p className="text-gray-600 mb-8">Choose your preferred mode to start making decisions as a CEO</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">Normal Mode</CardTitle>
                  <CardDescription>Day-to-day operational decisions</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2 mb-6 text-gray-600">
                <li>Manage routine operations</li>
                <li>Lower risk decisions</li>
                <li>Steady progression</li>
                <li>Perfect for learning</li>
              </ul>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  setIsBoardRoomMode(false);
                  generateDecision();
                }}
              >
                Start Normal Mode
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Building2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">Board Room Mode</CardTitle>
                  <CardDescription>High-stakes strategic decisions</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2 mb-6 text-gray-600">
                <li>Strategic company-wide decisions</li>
                <li>High risk, high reward</li>
                <li>Major impact on metrics</li>
                <li>For experienced players</li>
              </ul>
              <Button 
                className="w-full bg-red-600 hover:bg-red-700"
                onClick={() => {
                  setIsBoardRoomMode(true);
                  generateDecision();
                }}
              >
                Start Board Room Mode
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="container mx-auto px-4 py-8">
        <motion.h1 
          className="text-3xl font-bold mb-8 text-gray-900"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Learning Games
        </motion.h1>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* CEO Simulator Card */}
          <motion.div variants={item}>
            <Card className="hover:shadow-lg transition-shadow duration-200 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-orange-100/50 to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
              <CardHeader>
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="p-2 bg-orange-100 rounded-lg"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Briefcase className="w-6 h-6 text-orange-600" />
                  </motion.div>
                  <div>
                    <CardTitle className="text-xl">CEO Simulator</CardTitle>
                    <CardDescription>Make strategic decisions as a CEO in two exciting modes: Board Room (high-stakes) or Normal (day-to-day operations)</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full bg-orange-600 hover:bg-orange-700 transform transition-transform hover:scale-102 active:scale-98"
                  onClick={() => setShowCEOGame(true)}
                >
                  Start CEO Simulator
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Time Attack Quiz */}
          <motion.div variants={item}>
            <Card className="hover:shadow-lg transition-shadow duration-200 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-green-100/50 to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
              <CardHeader>
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="p-2 bg-green-100 rounded-lg"
                    whileHover={{ scale: 1.1, rotate: -5 }}
                  >
                    <Trophy className="w-6 h-6 text-green-600" />
                  </motion.div>
                  <div>
                    <CardTitle className="text-xl">Ticket Time Attack</CardTitle>
                    <CardDescription>Test your knowledge with quick questions about investing and earn raffle tickets</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 transform transition-transform hover:scale-102 active:scale-98"
                  onClick={() => setLocation("/time-attack")}
                >
                  Start Game
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Market Adventure */}
          <motion.div variants={item}>
            <Card className="hover:shadow-lg transition-shadow duration-200 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-yellow-100/50 to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
              <CardHeader>
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="p-2 bg-yellow-100 rounded-lg"
                    whileHover={{ scale: 1.1, rotate: -5 }}
                  >
                    <Gamepad2 className="w-6 h-6 text-yellow-600" />
                  </motion.div>
                  <div>
                    <CardTitle className="text-xl">Market Adventure</CardTitle>
                    <CardDescription>Simulate market trading and build your virtual portfolio</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full bg-yellow-600 hover:bg-yellow-700 transform transition-transform hover:scale-102 active:scale-98"
                  onClick={() => setLocation("/market-adventure")}
                >
                  Start Adventure
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Historical Simulations */}
          <motion.div variants={item}>
            <Card className="hover:shadow-lg transition-shadow duration-200 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-purple-100/50 to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
              <CardHeader>
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="p-2 bg-purple-100 rounded-lg"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <History className="w-6 h-6 text-purple-600" />
                  </motion.div>
                  <div>
                    <CardTitle className="text-xl">Historical Investor Journey</CardTitle>
                    <CardDescription>Walk through the career of famous investors and their key decisions</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full bg-purple-600 hover:bg-purple-700 transform transition-transform hover:scale-102 active:scale-98"
                  onClick={() => setLocation("/investor-simulator")}
                >
                  Start Journey
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
      <AppNavigation />
      
      <AnimatePresence mode="wait">
        {showCEOGame && !gameState.currentDecision && <ModeSelection />}
        {showCEOGame && gameState.currentDecision && <CEOGameInterface />}
      </AnimatePresence>
    </div>
  );
} 