import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { useGameState } from '@/hooks/use-game-state';
import { GameHeader, GameOver } from './ui/game-elements';
import { 
  ArrowLeft, ArrowRight, Coins, Trophy, Star, TrendingUp, TrendingDown, 
  Save, Lock, Rocket, Leaf, Heart, Database, Zap, Building2, Globe, 
  Cpu, Landmark, Car, Cloud, Brain, Space, Atom, RefreshCcw, DollarSign, Calendar, BarChart2
} from 'lucide-react';

// Interfaces
interface Stock {
  id: number;
  name: string;
  symbol: string;
  price: number;
  change: number;
  marketCap: number;
  industry: string;
  description: string;
  tier: number;
  volatility: number;
}

interface MarketEvent {
  type: "positive" | "negative";
  message: string;
  icon: JSX.Element;
  color: string;
}

// Constants
const XP_PER_LEVEL = 100;
const INITIAL_MONEY = 1000;

// Stock tiers
const STOCK_TIERS = [
  { 
    name: "Penny Stocks", 
    minPrice: 0.05, 
    maxPrice: 1, 
    requiredLevel: 1,
    icon: <Coins className="w-4 h-4" />
  },
  { 
    name: "Small Caps", 
    minPrice: 1, 
    maxPrice: 10, 
    requiredLevel: 2,
    icon: <Building2 className="w-4 h-4" />
  },
  { 
    name: "Mid Caps", 
    minPrice: 10, 
    maxPrice: 50, 
    requiredLevel: 3,
    icon: <TrendingUp className="w-4 h-4" />
  },
  { 
    name: "Large Caps", 
    minPrice: 50, 
    maxPrice: 200, 
    requiredLevel: 5,
    icon: <Star className="w-4 h-4" />
  },
  { 
    name: "Blue Chips", 
    minPrice: 200, 
    maxPrice: 1000, 
    requiredLevel: 8,
    icon: <Trophy className="w-4 h-4" />
  }
];

// Initial stocks
const INITIAL_STOCKS: Stock[] = [
  // Tier 1 - Penny Stocks
  {
    id: 101,
    name: "MicroTech Solutions",
    symbol: "MCRO",
    price: 0.05,
    change: 0,
    marketCap: 100000,
    industry: "Technology",
    description: "Small tech startup with innovative software solutions.",
    tier: 1,
    volatility: 0.05
  },
  {
    id: 102,
    name: "GreenLeaf Farms",
    symbol: "LEAF",
    price: 0.08,
    change: 0,
    marketCap: 150000,
    industry: "Agriculture",
    description: "Sustainable farming and organic produce.",
    tier: 1,
    volatility: 0.04
  },
  {
    id: 103,
    name: "HealthCore Labs",
    symbol: "HLTH",
    price: 0.15,
    change: 0,
    marketCap: 200000,
    industry: "Healthcare",
    description: "Medical research and diagnostics.",
    tier: 1,
    volatility: 0.06
  },
  // Tier 2 - Small Caps
  {
    id: 201,
    name: "DataFlow Analytics",
    symbol: "DATA",
    price: 2.50,
    change: 0,
    marketCap: 5000000,
    industry: "Technology",
    description: "Business analytics solutions.",
    tier: 2,
    volatility: 0.06
  },
  {
    id: 202,
    name: "EcoEnergy Systems",
    symbol: "ECO",
    price: 3.25,
    change: 0,
    marketCap: 6000000,
    industry: "Energy",
    description: "Renewable energy technology.",
    tier: 2,
    volatility: 0.07
  },
  // Tier 3 - Mid Caps
  {
    id: 301,
    name: "GlobalTech Solutions",
    symbol: "GTEC",
    price: 25.00,
    change: 0,
    marketCap: 50000000,
    industry: "Technology",
    description: "Global technology solutions provider.",
    tier: 3,
    volatility: 0.08
  },
  {
    id: 302,
    name: "RenewPower",
    symbol: "RNPW",
    price: 30.00,
    change: 0,
    marketCap: 60000000,
    industry: "Energy",
    description: "Renewable energy infrastructure.",
    tier: 3,
    volatility: 0.07
  },
  // Tier 4 - Large Caps
  {
    id: 401,
    name: "QuantumAI Systems",
    symbol: "QANT",
    price: 75.00,
    change: 0,
    marketCap: 15000000000,
    industry: "Technology",
    description: "Leading artificial intelligence and quantum computing solutions.",
    tier: 4,
    volatility: 0.04
  },
  {
    id: 402,
    name: "GreenPower Global",
    symbol: "GRPW",
    price: 82.50,
    change: 0,
    marketCap: 18000000000,
    industry: "Energy",
    description: "Global renewable energy and sustainable infrastructure.",
    tier: 4,
    volatility: 0.035
  },
  {
    id: 403,
    name: "FutureAuto Motors",
    symbol: "FAUT",
    price: 95.00,
    change: 0,
    marketCap: 20000000000,
    industry: "Automotive",
    description: "Electric and autonomous vehicle technology leader.",
    tier: 4,
    volatility: 0.045
  },
  // Tier 5 - Blue Chips
  {
    id: 501,
    name: "MegaBank Financial",
    symbol: "MEGA",
    price: 250.00,
    change: 0,
    marketCap: 150000000000,
    industry: "Finance",
    description: "Global financial services and investment banking leader.",
    tier: 5,
    volatility: 0.02
  },
  {
    id: 502,
    name: "TechGiant Corp",
    symbol: "TGNT",
    price: 450.00,
    change: 0,
    marketCap: 200000000000,
    industry: "Technology",
    description: "Global technology and cloud computing pioneer.",
    tier: 5,
    volatility: 0.025
  },
  {
    id: 503,
    name: "BioMed Innovations",
    symbol: "BIOM",
    price: 380.00,
    change: 0,
    marketCap: 180000000000,
    industry: "Healthcare",
    description: "Leading pharmaceutical and biotechnology research.",
    tier: 5,
    volatility: 0.03
  }
];

// Market events
const MARKET_EVENTS: MarketEvent[] = [
  {
    type: "positive",
    message: "Economic stimulus announced! Markets are up.",
    icon: <TrendingUp />,
    color: "text-green-500"
  },
  {
    type: "negative",
    message: "Inflation concerns are affecting markets.",
    icon: <TrendingDown />,
    color: "text-red-500"
  },
  {
    type: "positive",
    message: "Tech sector experiencing innovation boom!",
    icon: <Cpu />,
    color: "text-blue-500"
  },
  {
    type: "negative",
    message: "Energy crisis affecting manufacturing.",
    icon: <Zap />,
    color: "text-orange-500"
  }
];

// Add new type for price updates
type PriceUpdate = {
  symbol: string;
  change: number;
};

// Add company icons mapping
const COMPANY_ICONS: Record<string, JSX.Element> = {
  MCRO: <Cpu className="w-6 h-6 text-blue-500" />,
  LEAF: <Leaf className="w-6 h-6 text-emerald-500" />,
  HLTH: <Heart className="w-6 h-6 text-rose-500" />,
  DATA: <Database className="w-6 h-6 text-indigo-500" />,
  ECO: <Zap className="w-6 h-6 text-yellow-500" />,
  GTEC: <Globe className="w-6 h-6 text-cyan-500" />,
  RNPW: <Rocket className="w-6 h-6 text-purple-500" />,
  QANT: <Brain className="w-6 h-6 text-violet-500" />,
  GRPW: <Zap className="w-6 h-6 text-green-500" />,
  FAUT: <Car className="w-6 h-6 text-blue-600" />,
  MEGA: <Landmark className="w-6 h-6 text-amber-500" />,
  TGNT: <Cloud className="w-6 h-6 text-sky-500" />,
  BIOM: <Atom className="w-6 h-6 text-pink-500" />
};

export function MarketAdventureGame() {
  const {
    gameState,
    updateScore,
    addTickets,
    resetGame
  } = useGameState();

  // Game state
  const [money, setMoney] = useState(INITIAL_MONEY);
  const [portfolio, setPortfolio] = useState<Record<string, number>>({});
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [stocks, setStocks] = useState<Stock[]>(INITIAL_STOCKS);
  const [unlockedStocks, setUnlockedStocks] = useState<string[]>(["MCRO", "LEAF", "HLTH"]);
  const [currentEvent, setCurrentEvent] = useState<MarketEvent | null>(null);
  const [selectedTier, setSelectedTier] = useState<number | null>(1);
  const [showTutorial, setShowTutorial] = useState(true);
  const [totalTrades, setTotalTrades] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [dayCount, setDayCount] = useState(1);
  const [priceUpdates, setPriceUpdates] = useState<Record<string, number>>({});
  
  // Calculate XP progress
  const xpProgress = (xp % XP_PER_LEVEL) / XP_PER_LEVEL * 100;

  // Start the game
  const startGame = () => {
    setGameStarted(true);
    setShowTutorial(false);
    
    // Start market simulation
    const simInterval = setInterval(() => {
      simulateMarketMovements();
      incrementDay();
      
      // Random events
      if (Math.random() < 0.2) { // 20% chance for an event
        triggerRandomEvent();
      }
    }, 3000); // Update every 3 seconds
    
    return () => clearInterval(simInterval);
  };
  
  // Handle beginning tutorial
  const handleTutorialComplete = () => {
    setShowTutorial(false);
  };
  
  // Add XP to player
  const addXP = (amount: number) => {
    const newXP = xp + amount;
    const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1;
    const leveledUp = newLevel > level;
    
    setXp(newXP);
    
    if (leveledUp) {
      setLevel(newLevel);
      
      // Unlock new stocks when leveling up
      const newTierStocks = INITIAL_STOCKS.filter(stock => 
        !unlockedStocks.includes(stock.symbol) && 
        STOCK_TIERS[stock.tier - 1].requiredLevel <= newLevel
      );
      
      if (newTierStocks.length > 0) {
        const newUnlocked = [...unlockedStocks];
        newTierStocks.slice(0, 2).forEach(stock => {
          newUnlocked.push(stock.symbol);
        });
        setUnlockedStocks(newUnlocked);
      }
    }
  };
  
  // Increment game day
  const incrementDay = () => {
    setDayCount(prev => prev + 1);
    
    // Add a little XP each day
    addXP(1);
    
    // End game after 30 days
    if (dayCount >= 30) {
      endGame();
    }
  };
  
  // Trigger a random market event
  const triggerRandomEvent = () => {
    const randomEvent = MARKET_EVENTS[Math.floor(Math.random() * MARKET_EVENTS.length)];
    setCurrentEvent(randomEvent);
    
    // Apply event effects
    setStocks(prevStocks => {
      return prevStocks.map(stock => {
        const impactFactor = randomEvent.type === "positive" ? 1 : -1;
        const impactStrength = 0.01 + (Math.random() * 0.04); // 1-5% impact
        
        // Adjust price
        const newPrice = stock.price * (1 + (impactFactor * impactStrength * (1.5 - stock.volatility)));
        const priceChange = ((newPrice - stock.price) / stock.price) * 100;
        
        return {
          ...stock,
          price: parseFloat(newPrice.toFixed(2)),
          change: parseFloat(priceChange.toFixed(2))
        };
      });
    });
    
    // Clear event after 5 seconds
    setTimeout(() => {
      setCurrentEvent(null);
    }, 5000);
  };
  
  // Simulate market movements
  const simulateMarketMovements = () => {
    const updates: Record<string, number> = {};
    
    setStocks(prevStocks => {
      return prevStocks.map(stock => {
        // Calculate random market movement
        const volatilityFactor = stock.volatility * (Math.random() - 0.5) * 2;
        const trendFactor = 0.005; // Small upward trend over time
        
        // Update price with bounds to prevent negative values
        let newPrice = stock.price * (1 + (volatilityFactor + trendFactor));
        newPrice = Math.max(0.01, newPrice); // Ensure price doesn't go below 0.01
        
        // Calculate price change percentage
        const priceChange = ((newPrice - stock.price) / stock.price) * 100;
        
        // Store the change in updates
        updates[stock.symbol] = parseFloat(priceChange.toFixed(2));
        
        return {
          ...stock,
          price: parseFloat(newPrice.toFixed(2)),
          change: parseFloat(priceChange.toFixed(2))
        };
      });
    });
    
    // Update the priceUpdates state
    setPriceUpdates(updates);
    
    // Update portfolio value
    updatePortfolioValue();
  };
  
  // Buy stock
  const buyStock = (stock: Stock) => {
    // Check if player has enough money
    if (money < stock.price) {
      return false;
    }
    
    // Update portfolio
    const newPortfolio = { ...portfolio };
    newPortfolio[stock.symbol] = (newPortfolio[stock.symbol] || 0) + 1;
    setPortfolio(newPortfolio);
    
    // Deduct money
    setMoney(prevMoney => parseFloat((prevMoney - stock.price).toFixed(2)));
    
    // Track trade
    setTotalTrades(prev => prev + 1);
    
    // Add XP for trading
    addXP(5);
    
    return true;
  };
  
  // Sell stock
  const sellStock = (stock: Stock) => {
    // Check if player owns this stock
    if (!portfolio[stock.symbol] || portfolio[stock.symbol] <= 0) {
      return false;
    }
    
    // Update portfolio
    const newPortfolio = { ...portfolio };
    newPortfolio[stock.symbol] -= 1;
    
    // Remove from portfolio if zero shares
    if (newPortfolio[stock.symbol] === 0) {
      delete newPortfolio[stock.symbol];
    }
    
    setPortfolio(newPortfolio);
    
    // Add money
    setMoney(prevMoney => parseFloat((prevMoney + stock.price).toFixed(2)));
    
    // Track trade
    setTotalTrades(prev => prev + 1);
    
    // Add XP for trading
    addXP(5);
    
    return true;
  };
  
  // Update portfolio value
  const updatePortfolioValue = () => {
    // Calculate total portfolio value
    const portfolioValue = Object.entries(portfolio).reduce((total, [symbol, shares]) => {
      const stock = stocks.find(s => s.symbol === symbol);
      if (stock) {
        return total + (stock.price * shares);
      }
      return total;
    }, 0);
    
    // Total net worth is cash + portfolio value
    const netWorth = money + portfolioValue;
    
    // Update game score based on net worth
    updateScore(Math.floor(netWorth));
  };
  
  // End game
  const endGame = () => {
    setGameOver(true);
    
    // Calculate final portfolio value
    const portfolioValue = Object.entries(portfolio).reduce((total, [symbol, shares]) => {
      const stock = stocks.find(s => s.symbol === symbol);
      if (stock) {
        return total + (stock.price * shares);
      }
      return total;
    }, 0);
    
    // Final score is cash + portfolio value
    const finalScore = money + portfolioValue;
    
    // Award tickets based on performance
    const ticketsEarned = Math.floor(finalScore / 1000); // 1 ticket per $1000
    addTickets(ticketsEarned);
    
    // Update final score
    updateScore(Math.floor(finalScore));
  };
  
  // Start a new game
  const startNewGame = () => {
    resetGame();
    setMoney(INITIAL_MONEY);
    setPortfolio({});
    setLevel(1);
    setXp(0);
    setStocks(INITIAL_STOCKS);
    setUnlockedStocks(["MCRO", "LEAF", "HLTH"]);
    setCurrentEvent(null);
    setSelectedTier(1);
    setTotalTrades(0);
    setDayCount(1);
    setGameStarted(true);
    setGameOver(false);
    
    startGame();
  };
  
  // Return to games hub
  const returnToHub = () => {
    resetGame();
  };
  
  // Get stocks for the selected tier
  const getStocksForTier = () => {
    if (!selectedTier) return [];
    return stocks.filter(stock => stock.tier === selectedTier && unlockedStocks.includes(stock.symbol));
  };
  
  // Tutorial component
  const renderTutorial = () => {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      >
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">Welcome to Market Adventure!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>In this game, you'll experience the excitement of stock trading:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Start with ${INITIAL_MONEY} and grow your wealth</li>
              <li>Buy low, sell high to maximize profits</li>
              <li>Level up to unlock more advanced stocks</li>
              <li>React to market events that affect stock prices</li>
              <li>Complete 30 trading days to finish the game</li>
            </ul>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={startGame}>Start Trading</Button>
          </CardFooter>
        </Card>
      </motion.div>
    );
  };
  
  // Enhanced StockCard component with modern design
  const StockCard = ({ stock }: { stock: Stock }) => {
    const isUnlocked = unlockedStocks.includes(stock.symbol);
    const owned = portfolio[stock.symbol] || 0;
    const currentChange = priceUpdates[stock.symbol] ?? stock.change;
    
    return (
      <div className="relative">
        <Card className={`
          overflow-hidden
          ${isUnlocked ? 'bg-white hover:shadow-md' : 'bg-gray-50'}
          border border-gray-100
          transition-all duration-200
          rounded-3xl
        `}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                {/* Company Logo */}
                <div className={`
                  w-12 h-12 rounded-2xl flex items-center justify-center
                  ${isUnlocked ? 'bg-gray-50' : 'bg-gray-100'}
                `}>
                  {COMPANY_ICONS[stock.symbol]}
                </div>
                <div>
                  <CardTitle className="text-lg font-bold tracking-tight">
                    {stock.symbol}
                  </CardTitle>
                  <p className="text-sm text-gray-500">{stock.name}</p>
                </div>
              </div>
              {!isUnlocked && (
                <div className="flex items-center space-x-1 text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                  <Lock size={14} />
                  <span className="text-xs">Level {STOCK_TIERS[stock.tier - 1].requiredLevel}</span>
                </div>
              )}
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">${stock.price.toFixed(2)}</span>
                <div className={`
                  flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium
                  ${currentChange >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}
                `}>
                  {currentChange >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  <span>{Math.abs(currentChange).toFixed(2)}%</span>
                </div>
              </div>
              
              {isUnlocked && (
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Coins size={16} className="text-gray-400" />
                    <span>Owned: {owned}</span>
                  </div>
                  <span className="text-sm font-medium">
                    Value: ${(owned * stock.price).toFixed(2)}
                  </span>
                </div>
              )}
              
              <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-xl">
                {stock.description}
              </div>
            </div>
          </CardContent>
          
          {isUnlocked && (
            <CardFooter className="pt-2 flex justify-between gap-2">
              <Button
                variant="outline"
                size="lg"
                className="w-1/2 rounded-xl"
                onClick={() => sellStock(stock)}
                disabled={!owned}
              >
                Sell
              </Button>
              <Button
                variant="default"
                size="lg"
                className="w-1/2 rounded-xl bg-blue-500 hover:bg-blue-600"
                onClick={() => buyStock(stock)}
                disabled={money < stock.price}
              >
                Buy
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    );
  };
  
  // Enhanced game UI
  return (
    <div className="container mx-auto px-4 max-w-4xl">
      {!gameStarted ? (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          {/* Header with tickets */}
          <div className="w-full flex justify-between items-center mb-8 px-4">
            <h1 className="text-xl font-semibold">Market Adventure</h1>
            <div className="flex items-center gap-2 bg-amber-50 px-3 py-1 rounded-full">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span className="text-amber-700 font-medium">3</span>
            </div>
          </div>

          {/* Main content card */}
          <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex flex-col items-center px-6 py-12 text-center">
              {/* Icon */}
              <div className="w-24 h-24 mb-8 bg-emerald-100 rounded-2xl flex items-center justify-center transform rotate-12">
                <TrendingUp className="w-12 h-12 text-emerald-500 transform -rotate-12" />
              </div>

              {/* Title and description */}
              <h2 className="text-2xl font-bold mb-4">Ready to start trading?</h2>
              <p className="text-gray-600 mb-8">
                Buy low, sell high, and build your portfolio to earn raffle tickets!
              </p>

              {/* Start button */}
              <Button
                size="lg"
                onClick={startGame}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-6 rounded-xl transition-all duration-200"
              >
                Start Game
              </Button>
            </div>
          </div>
        </div>
      ) : gameOver ? (
        <GameOver
          score={money}
          onRestart={startNewGame}
          onExit={returnToHub}
          stats={{
            finalBalance: money,
            totalTrades,
            daysPlayed: dayCount,
            level,
          }}
        />
      ) : (
        <div className="space-y-6 py-6">
          {/* Game Header */}
          <div className="bg-white rounded-xl shadow-md p-4 space-y-4">
            {/* Title */}
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Market Trading Adventure</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  <p className="text-sm text-gray-500">Balance</p>
                </div>
                <p className="text-xl font-bold">${money.toFixed(2)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Level {level}</p>
                <Progress value={xpProgress} className="h-2" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <p className="text-sm text-gray-500">Day</p>
                </div>
                <p className="text-xl font-bold">{dayCount}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-purple-500" />
                  <p className="text-sm text-gray-500">Trades</p>
                </div>
                <p className="text-xl font-bold">{totalTrades}</p>
              </div>
            </div>
          </div>

          {/* Market Event Banner */}
          <AnimatePresence>
            {currentEvent && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`
                  rounded-lg p-4 flex items-center justify-between
                  ${currentEvent.type === 'positive' ? 'bg-green-50' : 'bg-red-50'}
                `}
              >
                <div className="flex items-center space-x-3">
                  <div className={`
                    p-2 rounded-full
                    ${currentEvent.type === 'positive' ? 'bg-green-100' : 'bg-red-100'}
                  `}>
                    {currentEvent.icon}
                  </div>
                  <p className={currentEvent.color}>{currentEvent.message}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentEvent(null)}
                >
                  Dismiss
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stock Tiers */}
          <div className="flex overflow-x-auto space-x-2 pb-2">
            {STOCK_TIERS.map((tier, index) => (
              <Button
                key={tier.name}
                variant={selectedTier === index + 1 ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTier(index + 1)}
                className="whitespace-nowrap flex items-center gap-2"
              >
                <span className={selectedTier === index + 1 ? "text-white" : "text-gray-500"}>
                  {tier.icon}
                </span>
                {tier.name}
              </Button>
            ))}
          </div>

          {/* Stocks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {stocks
                .filter(stock => stock.tier === selectedTier)
                .map(stock => (
                  <StockCard key={stock.id} stock={stock} />
                ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}