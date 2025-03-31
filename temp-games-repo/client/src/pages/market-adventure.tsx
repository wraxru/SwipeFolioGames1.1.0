import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import AppNavigation from "@/components/app-navigation";
import { 
  ArrowLeft, ArrowRight, Coins, Trophy, Star, TrendingUp, TrendingDown, Save, Lock,
  Rocket, Leaf, Heart, Database, Zap, Building2, Globe, Cpu, Landmark, Car, Cloud, Brain, Space, Atom, RefreshCcw
} from "lucide-react";

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

interface GameState {
  money: number;
  portfolio: { [key: string]: number };
  level: number;
  xp: number;
  unlockedStocks: string[];
  currentEvent: MarketEvent | null;
  lastSaved: number;
  totalTrades: number;
}

const SAVE_KEY = "market_adventure_save";
const AUTO_SAVE_INTERVAL = 60000;
const XP_PER_LEVEL = 100;
const INITIAL_MONEY = 1;

// Define stock tiers
const STOCK_TIERS = [
  { name: "Penny Stocks", minPrice: 0.05, maxPrice: 1, requiredLevel: 1 },
  { name: "Small Caps", minPrice: 1, maxPrice: 10, requiredLevel: 2 },
  { name: "Mid Caps", minPrice: 10, maxPrice: 50, requiredLevel: 3 },
  { name: "Large Caps", minPrice: 50, maxPrice: 200, requiredLevel: 5 },
  { name: "Blue Chips", minPrice: 200, maxPrice: 1000, requiredLevel: 8 },
  { name: "Tech Giants", minPrice: 1000, maxPrice: 10000, requiredLevel: 12 },
  { name: "Alien Tech", minPrice: 10000, maxPrice: 1000000, requiredLevel: 15 }
];

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
  {
    id: 104,
    name: "MineralX",
    symbol: "MINX",
    price: 0.20,
    change: 0,
    marketCap: 250000,
    industry: "Mining",
    description: "Small-scale mineral exploration.",
    tier: 1,
    volatility: 0.07
  },
  {
    id: 105,
    name: "EduTech",
    symbol: "EDTK",
    price: 0.25,
    change: 0,
    marketCap: 300000,
    industry: "Education",
    description: "Educational technology solutions.",
    tier: 1,
    volatility: 0.04
  },
  {
    id: 106,
    name: "SolarMicro",
    symbol: "SOLM",
    price: 0.30,
    change: 0,
    marketCap: 350000,
    industry: "Energy",
    description: "Small-scale solar energy solutions.",
    tier: 1,
    volatility: 0.05
  },
  {
    id: 107,
    name: "GameStart",
    symbol: "GAME",
    price: 0.35,
    change: 0,
    marketCap: 400000,
    industry: "Gaming",
    description: "Indie game development studio.",
    tier: 1,
    volatility: 0.08
  },
  {
    id: 108,
    name: "LocalMedia",
    symbol: "LMED",
    price: 0.40,
    change: 0,
    marketCap: 450000,
    industry: "Media",
    description: "Local news and content creation.",
    tier: 1,
    volatility: 0.06
  },
  {
    id: 109,
    name: "SmartHome",
    symbol: "SHOM",
    price: 0.45,
    change: 0,
    marketCap: 500000,
    industry: "IoT",
    description: "Smart home automation devices.",
    tier: 1,
    volatility: 0.07
  },
  {
    id: 110,
    name: "FoodTech",
    symbol: "FDTK",
    price: 0.50,
    change: 0,
    marketCap: 550000,
    industry: "Food",
    description: "Food technology and delivery solutions.",
    tier: 1,
    volatility: 0.05
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
  {
    id: 203,
    name: "MedTech Solutions",
    symbol: "MEDS",
    price: 4.00,
    change: 0,
    marketCap: 7000000,
    industry: "Healthcare",
    description: "Medical device manufacturer.",
    tier: 2,
    volatility: 0.05
  },
  {
    id: 204,
    name: "UrbanFarms",
    symbol: "UFARM",
    price: 4.75,
    change: 0,
    marketCap: 8000000,
    industry: "Agriculture",
    description: "Urban farming solutions.",
    tier: 2,
    volatility: 0.04
  },
  {
    id: 205,
    name: "SportsTech",
    symbol: "SPRT",
    price: 5.50,
    change: 0,
    marketCap: 9000000,
    industry: "Sports",
    description: "Sports technology and analytics.",
    tier: 2,
    volatility: 0.08
  },
  {
    id: 206,
    name: "CyberGuard",
    symbol: "CYBG",
    price: 6.25,
    change: 0,
    marketCap: 10000000,
    industry: "Cybersecurity",
    description: "Digital security solutions.",
    tier: 2,
    volatility: 0.09
  },
  {
    id: 207,
    name: "RetailTech",
    symbol: "RETK",
    price: 7.00,
    change: 0,
    marketCap: 11000000,
    industry: "Retail",
    description: "Retail technology solutions.",
    tier: 2,
    volatility: 0.06
  },
  {
    id: 208,
    name: "FinTech Plus",
    symbol: "FNTP",
    price: 7.75,
    change: 0,
    marketCap: 12000000,
    industry: "Finance",
    description: "Financial technology services.",
    tier: 2,
    volatility: 0.07
  },
  {
    id: 209,
    name: "CloudSecure",
    symbol: "CSEC",
    price: 8.50,
    change: 0,
    marketCap: 13000000,
    industry: "Cloud",
    description: "Cloud security solutions.",
    tier: 2,
    volatility: 0.08
  },
  {
    id: 210,
    name: "BioInnovate",
    symbol: "BINV",
    price: 9.25,
    change: 0,
    marketCap: 14000000,
    industry: "Biotech",
    description: "Biotechnology research.",
    tier: 2,
    volatility: 0.09
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
  {
    id: 303,
    name: "HealthNet Global",
    symbol: "HLNG",
    price: 35.00,
    change: 0,
    marketCap: 70000000,
    industry: "Healthcare",
    description: "Global healthcare network.",
    tier: 3,
    volatility: 0.06
  },
  {
    id: 304,
    name: "SmartLogistics",
    symbol: "SLOG",
    price: 40.00,
    change: 0,
    marketCap: 80000000,
    industry: "Transportation",
    description: "AI-powered logistics solutions.",
    tier: 3,
    volatility: 0.08
  },
  {
    id: 305,
    name: "CyberDefense",
    symbol: "CYBD",
    price: 42.50,
    change: 0,
    marketCap: 90000000,
    industry: "Cybersecurity",
    description: "Advanced cybersecurity systems.",
    tier: 3,
    volatility: 0.09
  },
  {
    id: 306,
    name: "BioMed Research",
    symbol: "BMRS",
    price: 44.00,
    change: 0,
    marketCap: 100000000,
    industry: "Biotech",
    description: "Biomedical research and development.",
    tier: 3,
    volatility: 0.10
  },
  {
    id: 307,
    name: "QuantumComputing",
    symbol: "QCOM",
    price: 46.00,
    change: 0,
    marketCap: 110000000,
    industry: "Technology",
    description: "Quantum computing solutions.",
    tier: 3,
    volatility: 0.11
  },
  {
    id: 308,
    name: "AeroSpace Systems",
    symbol: "AERO",
    price: 47.50,
    change: 0,
    marketCap: 120000000,
    industry: "Aerospace",
    description: "Aerospace technology and systems.",
    tier: 3,
    volatility: 0.09
  },
  {
    id: 309,
    name: "RoboTech",
    symbol: "RBTC",
    price: 48.50,
    change: 0,
    marketCap: 130000000,
    industry: "Robotics",
    description: "Robotics and automation solutions.",
    tier: 3,
    volatility: 0.08
  },
  {
    id: 310,
    name: "MetaVerse",
    symbol: "META",
    price: 49.00,
    change: 0,
    marketCap: 140000000,
    industry: "Virtual Reality",
    description: "Virtual reality platforms.",
    tier: 3,
    volatility: 0.10
  },

  // Tier 4 - Large Caps
  {
    id: 401,
    name: "MegaTech Industries",
    symbol: "MEGA",
    price: 150.00,
    change: 0,
    marketCap: 500000000,
    industry: "Technology",
    description: "Diversified technology conglomerate.",
    tier: 4,
    volatility: 0.09
  },
  {
    id: 402,
    name: "FusionEnergy",
    symbol: "FUSN",
    price: 165.00,
    change: 0,
    marketCap: 550000000,
    industry: "Energy",
    description: "Fusion energy research.",
    tier: 4,
    volatility: 0.10
  },
  {
    id: 403,
    name: "BioGenetics",
    symbol: "BGEN",
    price: 175.00,
    change: 0,
    marketCap: 600000000,
    industry: "Biotech",
    description: "Genetic research and therapy.",
    tier: 4,
    volatility: 0.11
  },
  {
    id: 404,
    name: "SpaceX Clone",
    symbol: "SPXC",
    price: 180.00,
    change: 0,
    marketCap: 650000000,
    industry: "Aerospace",
    description: "Space exploration technology.",
    tier: 4,
    volatility: 0.12
  },
  {
    id: 405,
    name: "QuantumBank",
    symbol: "QBNK",
    price: 185.00,
    change: 0,
    marketCap: 700000000,
    industry: "Finance",
    description: "Quantum-secure banking.",
    tier: 4,
    volatility: 0.08
  },
  {
    id: 406,
    name: "NanoTech Labs",
    symbol: "NANO",
    price: 190.00,
    change: 0,
    marketCap: 750000000,
    industry: "Technology",
    description: "Nanotechnology research.",
    tier: 4,
    volatility: 0.11
  },
  {
    id: 407,
    name: "AI Systems",
    symbol: "AISYS",
    price: 192.50,
    change: 0,
    marketCap: 800000000,
    industry: "Technology",
    description: "Advanced AI solutions.",
    tier: 4,
    volatility: 0.10
  },
  {
    id: 408,
    name: "SmartCity",
    symbol: "CITY",
    price: 195.00,
    change: 0,
    marketCap: 850000000,
    industry: "Infrastructure",
    description: "Smart city infrastructure.",
    tier: 4,
    volatility: 0.07
  },
  {
    id: 409,
    name: "CloudMatrix",
    symbol: "CLDM",
    price: 197.50,
    change: 0,
    marketCap: 900000000,
    industry: "Cloud",
    description: "Advanced cloud computing.",
    tier: 4,
    volatility: 0.09
  },
  {
    id: 410,
    name: "CyberSec Pro",
    symbol: "CSEC",
    price: 199.00,
    change: 0,
    marketCap: 950000000,
    industry: "Cybersecurity",
    description: "Professional cybersecurity.",
    tier: 4,
    volatility: 0.10
  },

  // Tier 5 - Blue Chips
  {
    id: 501,
    name: "TechGiant Corp",
    symbol: "TGNT",
    price: 500.00,
    change: 0,
    marketCap: 2000000000,
    industry: "Technology",
    description: "Global tech leader.",
    tier: 5,
    volatility: 0.08
  },
  {
    id: 502,
    name: "MegaHealth",
    symbol: "MHLT",
    price: 600.00,
    change: 0,
    marketCap: 2500000000,
    industry: "Healthcare",
    description: "Global healthcare provider.",
    tier: 5,
    volatility: 0.07
  },
  {
    id: 503,
    name: "GlobalBank",
    symbol: "GBNK",
    price: 700.00,
    change: 0,
    marketCap: 3000000000,
    industry: "Finance",
    description: "International banking.",
    tier: 5,
    volatility: 0.06
  },
  {
    id: 504,
    name: "EnergyFusion",
    symbol: "EFUS",
    price: 750.00,
    change: 0,
    marketCap: 3500000000,
    industry: "Energy",
    description: "Clean energy solutions.",
    tier: 5,
    volatility: 0.09
  },
  {
    id: 505,
    name: "SpaceTech",
    symbol: "SPTC",
    price: 800.00,
    change: 0,
    marketCap: 4000000000,
    industry: "Aerospace",
    description: "Space technology leader.",
    tier: 5,
    volatility: 0.11
  },
  {
    id: 506,
    name: "BioTech Giant",
    symbol: "BTEC",
    price: 850.00,
    change: 0,
    marketCap: 4500000000,
    industry: "Biotech",
    description: "Biotechnology leader.",
    tier: 5,
    volatility: 0.10
  },
  {
    id: 507,
    name: "AI Masters",
    symbol: "AIMS",
    price: 900.00,
    change: 0,
    marketCap: 5000000000,
    industry: "Technology",
    description: "AI technology pioneer.",
    tier: 5,
    volatility: 0.12
  },
  {
    id: 508,
    name: "RoboWorld",
    symbol: "ROBO",
    price: 950.00,
    change: 0,
    marketCap: 5500000000,
    industry: "Robotics",
    description: "Robotics industry leader.",
    tier: 5,
    volatility: 0.09
  },
  {
    id: 509,
    name: "MetaVerse Pro",
    symbol: "MVRS",
    price: 975.00,
    change: 0,
    marketCap: 6000000000,
    industry: "Virtual Reality",
    description: "VR industry pioneer.",
    tier: 5,
    volatility: 0.10
  },
  {
    id: 510,
    name: "QuantumTech",
    symbol: "QNTM",
    price: 999.00,
    change: 0,
    marketCap: 6500000000,
    industry: "Technology",
    description: "Quantum technology leader.",
    tier: 5,
    volatility: 0.11
  },

  // Tier 6 - Tech Giants
  {
    id: 601,
    name: "HyperTech Global",
    symbol: "HPTG",
    price: 2500.00,
    change: 0,
    marketCap: 10000000000,
    industry: "Technology",
    description: "Global tech innovation.",
    tier: 6,
    volatility: 0.10
  },
  {
    id: 602,
    name: "BioGenesis",
    symbol: "BGEN",
    price: 3000.00,
    change: 0,
    marketCap: 12000000000,
    industry: "Biotech",
    description: "Revolutionary biotech.",
    tier: 6,
    volatility: 0.12
  },
  {
    id: 603,
    name: "QuantumVerse",
    symbol: "QVER",
    price: 3500.00,
    change: 0,
    marketCap: 14000000000,
    industry: "Technology",
    description: "Quantum computing leader.",
    tier: 6,
    volatility: 0.13
  },
  {
    id: 604,
    name: "SpaceForce One",
    symbol: "SPFO",
    price: 4000.00,
    change: 0,
    marketCap: 16000000000,
    industry: "Aerospace",
    description: "Space exploration pioneer.",
    tier: 6,
    volatility: 0.14
  },
  {
    id: 605,
    name: "NeuraTech",
    symbol: "NRTC",
    price: 4500.00,
    change: 0,
    marketCap: 18000000000,
    industry: "Technology",
    description: "Neural interface technology.",
    tier: 6,
    volatility: 0.15
  },
  {
    id: 606,
    name: "FusionPower",
    symbol: "FUPW",
    price: 5000.00,
    change: 0,
    marketCap: 20000000000,
    industry: "Energy",
    description: "Fusion energy pioneer.",
    tier: 6,
    volatility: 0.11
  },
  {
    id: 607,
    name: "CyberWorld",
    symbol: "CYBW",
    price: 6000.00,
    change: 0,
    marketCap: 22000000000,
    industry: "Technology",
    description: "Cybersecurity giant.",
    tier: 6,
    volatility: 0.12
  },
  {
    id: 608,
    name: "MegaVerse",
    symbol: "MGVR",
    price: 7000.00,
    change: 0,
    marketCap: 24000000000,
    industry: "Virtual Reality",
    description: "Virtual world pioneer.",
    tier: 6,
    volatility: 0.13
  },
  {
    id: 609,
    name: "RoboTech Pro",
    symbol: "RBTP",
    price: 8000.00,
    change: 0,
    marketCap: 26000000000,
    industry: "Robotics",
    description: "Advanced robotics leader.",
    tier: 6,
    volatility: 0.14
  },
  {
    id: 610,
    name: "AstroMining",
    symbol: "ASTM",
    price: 9000.00,
    change: 0,
    marketCap: 28000000000,
    industry: "Space Mining",
    description: "Asteroid mining pioneer.",
    tier: 6,
    volatility: 0.15
  },

  // Tier 7 - Alien Tech (Ultimate Tier)
  {
    id: 701,
    name: "Xenotech Industries",
    symbol: "XENO",
    price: 50000.00,
    change: 0,
    marketCap: 100000000000,
    industry: "Alien Technology",
    description: "Alien technology research.",
    tier: 7,
    volatility: 0.20
  },
  {
    id: 702,
    name: "StarGate Corp",
    symbol: "GATE",
    price: 60000.00,
    change: 0,
    marketCap: 120000000000,
    industry: "Space Travel",
    description: "Interstellar travel technology.",
    tier: 7,
    volatility: 0.22
  },
  {
    id: 703,
    name: "AlienAI Systems",
    symbol: "AAIS",
    price: 70000.00,
    change: 0,
    marketCap: 140000000000,
    industry: "Alien AI",
    description: "Alien-inspired AI technology.",
    tier: 7,
    volatility: 0.25
  },
  {
    id: 704,
    name: "GalacticEnergy",
    symbol: "GLCE",
    price: 80000.00,
    change: 0,
    marketCap: 160000000000,
    industry: "Energy",
    description: "Alien energy technology.",
    tier: 7,
    volatility: 0.23
  },
  {
    id: 705,
    name: "UFO Dynamics",
    symbol: "UFOD",
    price: 90000.00,
    change: 0,
    marketCap: 180000000000,
    industry: "Transportation",
    description: "Anti-gravity technology.",
    tier: 7,
    volatility: 0.24
  },
  {
    id: 706,
    name: "AlienMed",
    symbol: "AMED",
    price: 100000.00,
    change: 0,
    marketCap: 200000000000,
    industry: "Healthcare",
    description: "Alien medical technology.",
    tier: 7,
    volatility: 0.21
  },
  {
    id: 707,
    name: "Telepathy Tech",
    symbol: "TELE",
    price: 150000.00,
    change: 0,
    marketCap: 220000000000,
    industry: "Communication",
    description: "Telepathic communication tech.",
    tier: 7,
    volatility: 0.26
  },
  {
    id: 708,
    name: "Mars Colony",
    symbol: "MARS",
    price: 200000.00,
    change: 0,
    marketCap: 240000000000,
    industry: "Space Colonization",
    description: "Mars colonization project.",
    tier: 7,
    volatility: 0.27
  },
  {
    id: 709,
    name: "TimeWarp",
    symbol: "TIME",
    price: 250000.00,
    change: 0,
    marketCap: 260000000000,
    industry: "Time Technology",
    description: "Time manipulation research.",
    tier: 7,
    volatility: 0.28
  },
  {
    id: 710,
    name: "DimensionX",
    symbol: "DIMX",
    price: 300000.00,
    change: 0,
    marketCap: 280000000000,
    industry: "Dimensional Tech",
    description: "Inter-dimensional travel.",
    tier: 7,
    volatility: 0.30
  }
];

export default function MarketAdventure() {
  // Clear any existing save data immediately
  localStorage.removeItem(SAVE_KEY);

  const [gameState, setGameState] = useState<GameState>({
    money: INITIAL_MONEY,
    portfolio: {},
    level: 1,
    xp: 0,
    unlockedStocks: ["MCRO", "LEAF", "HLTH"],
    currentEvent: null,
    lastSaved: Date.now(),
    totalTrades: 0
  });

  const [stocks, setStocks] = useState<Stock[]>(INITIAL_STOCKS);
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [showTutorial, setShowTutorial] = useState(true);  // Force show tutorial
  const [showSaveMessage, setShowSaveMessage] = useState(false);

  // Calculate XP progress
  const xpProgress = (gameState.xp % XP_PER_LEVEL) / XP_PER_LEVEL * 100;

  const addXP = (amount: number) => {
    setGameState(prev => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1;
      const leveledUp = newLevel > prev.level;

      // Unlock new stocks when leveling up
      let newUnlockedStocks = [...prev.unlockedStocks];
      if (leveledUp) {
        const newTierStocks = INITIAL_STOCKS.filter(stock => 
          !prev.unlockedStocks.includes(stock.symbol) && 
          STOCK_TIERS[stock.tier - 1].requiredLevel <= newLevel
        );
        newUnlockedStocks = [...newUnlockedStocks, ...newTierStocks.map(s => s.symbol)];
      }

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        unlockedStocks: newUnlockedStocks
      };
    });
  };

  const saveGame = () => {
    const stateToSave = {
      ...gameState,
      currentEvent: null, // Don't save the event state
      lastSaved: Date.now()
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(stateToSave));
    setShowSaveMessage(true);
    setTimeout(() => setShowSaveMessage(false), 2000);
  };

  useEffect(() => {
    const autoSaveInterval = setInterval(saveGame, AUTO_SAVE_INTERVAL);
    return () => clearInterval(autoSaveInterval);
  }, [gameState]);

  const handleBuy = (stock: Stock) => {
    if (gameState.money >= stock.price) {
      setGameState(prev => {
        const newPortfolio = {
          ...prev.portfolio,
          [stock.symbol]: (prev.portfolio[stock.symbol] || 0) + 1
        };
        const totalStocks = Object.values(newPortfolio).reduce((sum, count) => sum + count, 0);
        
        return {
          ...prev,
          money: prev.money - stock.price,
          portfolio: newPortfolio,
          totalTrades: prev.totalTrades + 1
        };
      });
      
      // Award XP for trading
      addXP(5);
      saveGame();
    }
  };

  const handleSell = (stock: Stock) => {
    if (gameState.portfolio[stock.symbol] > 0) {
      setGameState(prev => {
        const newPortfolio = {
          ...prev.portfolio,
          [stock.symbol]: prev.portfolio[stock.symbol] - 1
        };
        
        // Remove stock from portfolio if count reaches 0
        if (newPortfolio[stock.symbol] === 0) {
          delete newPortfolio[stock.symbol];
        }
        
        return {
          ...prev,
          money: prev.money + stock.price,
          portfolio: newPortfolio,
          totalTrades: prev.totalTrades + 1
        };
      });
      
      // Award XP for trading
      addXP(5);
      saveGame();
    }
  };

  const generateEvent = () => {
    const events = [
      {
        type: "positive",
        message: "Market Surge: All stocks are trending upward!",
        icon: <TrendingUp className="w-6 h-6 text-green-500" />,
        color: "bg-green-100"
      },
      {
        type: "negative",
        message: "Market Dip: Prices are falling across the board.",
        icon: <TrendingDown className="w-6 h-6 text-red-500" />,
        color: "bg-red-100"
      },
      {
        type: "positive",
        message: "Tech Boom: Technology stocks are rising!",
        icon: <Cpu className="w-6 h-6 text-blue-500" />,
        color: "bg-blue-100"
      },
      {
        type: "negative",
        message: "Economic Crisis: Markets are volatile!",
        icon: <TrendingDown className="w-6 h-6 text-orange-500" />,
        color: "bg-orange-100"
      },
      {
        type: "positive",
        message: "Innovation Wave: Tech and Biotech stocks surge!",
        icon: <Zap className="w-6 h-6 text-purple-500" />,
        color: "bg-purple-100"
      }
    ];
    return events[Math.floor(Math.random() * events.length)];
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // Update stock prices
      setStocks(prev => prev.map(stock => {
        const volatilityFactor = stock.volatility * (1 + (gameState.level - 1) * 0.1);
        const priceChange = (Math.random() - 0.5) * volatilityFactor;
        const newPrice = Math.max(stock.price * (1 + priceChange), STOCK_TIERS[stock.tier - 1].minPrice);
        
        return {
          ...stock,
          price: newPrice,
          change: priceChange * 100
        };
      }));

      // Generate random events with 10% chance
      if (Math.random() < 0.1) {
        const events = [
          {
            type: "positive" as const,
            message: "Market Surge: All stocks are trending upward!",
            icon: <TrendingUp className="w-6 h-6 text-green-500" />,
            color: "bg-green-100"
          },
          {
            type: "negative" as const,
            message: "Market Dip: Prices are falling across the board.",
            icon: <TrendingDown className="w-6 h-6 text-red-500" />,
            color: "bg-red-100"
          },
          {
            type: "positive" as const,
            message: "Tech Boom: Technology stocks are rising!",
            icon: <Cpu className="w-6 h-6 text-blue-500" />,
            color: "bg-blue-100"
          },
          {
            type: "negative" as const,
            message: "Economic Crisis: Markets are volatile!",
            icon: <TrendingDown className="w-6 h-6 text-orange-500" />,
            color: "bg-orange-100"
          },
          {
            type: "positive" as const,
            message: "Innovation Wave: Tech and Biotech stocks surge!",
            icon: <Zap className="w-6 h-6 text-purple-500" />,
            color: "bg-purple-100"
          }
        ];
        const newEvent = events[Math.floor(Math.random() * events.length)];
        setGameState(prev => ({
          ...prev,
          currentEvent: newEvent
        }));
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [gameState.level]);

  // Calculate total portfolio value for the stats display
  const totalPortfolioValue = Object.entries(gameState.portfolio).reduce((total, [symbol, quantity]) => {
    const stock = stocks.find(s => s.symbol === symbol);
    return total + (stock ? stock.price * quantity : 0);
  }, 0);

  // Render the game stats section
  const GameStats = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-gray-500">Cash</span>
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-yellow-500" />
              <span className="text-lg font-semibold">
                ${gameState.money.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-gray-500">Level Progress</span>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-blue-500" />
                <span className="text-lg font-semibold">Level {gameState.level}</span>
              </div>
              <Progress value={xpProgress} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-gray-500">Experience Points</span>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-purple-500" />
              <span className="text-lg font-semibold">{gameState.xp} XP</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-gray-500">Portfolio Value</span>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-lg font-semibold">
                ${totalPortfolioValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Render the market overview screen
  const MarketOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {STOCK_TIERS.map((tier, index) => {
        const isLocked = tier.requiredLevel > gameState.level;
        const tierStocks = stocks.filter(stock => stock.tier === index + 1);
        if (tierStocks.length === 0) return null;

        return (
          <motion.div
            key={tier.name}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className={`hover:shadow-lg transition-shadow duration-200 cursor-pointer overflow-hidden relative ${
                isLocked ? 'opacity-50' : ''
              }`}
              onClick={() => !isLocked && setSelectedTier(index + 1)}
            >
              <div className={`absolute inset-0 pointer-events-none ${
                index === 0 ? 'bg-yellow-500/5' : 
                index === 1 ? 'bg-green-500/5' : 
                index === 2 ? 'bg-blue-500/5' : 
                index === 3 ? 'bg-purple-500/5' : 
                index === 4 ? 'bg-red-500/5' : 
                index === 5 ? 'bg-indigo-500/5' : 
                'bg-pink-500/5'
              }`} />
              <CardHeader>
                <CardTitle className="flex items-center justify-between relative z-10">
                  <span className="text-xl font-bold">{tier.name}</span>
                  {isLocked && (
                    <div className="flex items-center gap-2">
                      <Lock className="w-5 h-5 text-gray-500" />
                      <span className="text-sm text-gray-500">Level {tier.requiredLevel}</span>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="aspect-square bg-white rounded-lg mb-4 p-6 shadow-sm border border-gray-100">
                  <div className="w-full h-full relative">
                    {/* Main tier icon */}
                    <div className={`
                      absolute inset-0 flex items-center justify-center
                      ${index === 0 ? 'text-yellow-500' : ''}
                      ${index === 1 ? 'text-green-500' : ''}
                      ${index === 2 ? 'text-blue-500' : ''}
                      ${index === 3 ? 'text-purple-500' : ''}
                      ${index === 4 ? 'text-red-500' : ''}
                      ${index === 5 ? 'text-indigo-500' : ''}
                      ${index === 6 ? 'text-violet-500' : ''}
                    `}>
                      {index === 0 && <Coins className="w-20 h-20" />}
                      {index === 1 && <Building2 className="w-20 h-20" />}
                      {index === 2 && <Globe className="w-20 h-20" />}
                      {index === 3 && <Landmark className="w-20 h-20" />}
                      {index === 4 && <Rocket className="w-20 h-20" />}
                      {index === 5 && <Cpu className="w-20 h-20" />}
                      {index === 6 && <Atom className="w-20 h-20" />}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Price Range:</span>
                    <span className="font-medium">
                      ${tier.minPrice.toLocaleString()} - ${tier.maxPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Available Stocks:</span>
                    <span className="font-medium">{tierStocks.length}</span>
                  </div>
                  {isLocked && (
                    <div className="mt-2 text-center py-2 bg-gray-100 rounded-md">
                      <p className="text-sm text-gray-600">
                        Unlock at Level {tier.requiredLevel}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );

  // Render the trading interface for a specific tier
  const TradingInterface = () => {
    const tierStocks = stocks.filter(stock => stock.tier === selectedTier);
    
    return (
      <div className="space-y-6 bg-white">
        {/* Back button */}
        <div className="flex items-center justify-between">
          <Button
            onClick={() => setSelectedTier(null)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Market
          </Button>
          <div className="flex items-center gap-2">
            <span className={`
              p-2 rounded-full
              ${selectedTier === 1 ? 'bg-yellow-100 text-yellow-500' : ''}
              ${selectedTier === 2 ? 'bg-green-100 text-green-500' : ''}
              ${selectedTier === 3 ? 'bg-blue-100 text-blue-500' : ''}
              ${selectedTier === 4 ? 'bg-purple-100 text-purple-500' : ''}
              ${selectedTier === 5 ? 'bg-red-100 text-red-500' : ''}
              ${selectedTier === 6 ? 'bg-indigo-100 text-indigo-500' : ''}
              ${selectedTier === 7 ? 'bg-violet-100 text-violet-500' : ''}
            `}>
              {selectedTier === 1 && <Coins className="w-6 h-6" />}
              {selectedTier === 2 && <Building2 className="w-6 h-6" />}
              {selectedTier === 3 && <Globe className="w-6 h-6" />}
              {selectedTier === 4 && <Landmark className="w-6 h-6" />}
              {selectedTier === 5 && <Rocket className="w-6 h-6" />}
              {selectedTier === 6 && <Cpu className="w-6 h-6" />}
              {selectedTier === 7 && <Atom className="w-6 h-6" />}
            </span>
            <h2 className="text-2xl font-bold">{STOCK_TIERS[selectedTier - 1].name}</h2>
          </div>
        </div>

        {/* Stock grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tierStocks.map(stock => (
            <Card key={stock.id} className="relative overflow-hidden bg-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {stock.industry === 'Technology' && <Cpu className="w-4 h-4" />}
                    {stock.industry === 'Healthcare' && <Heart className="w-4 h-4" />}
                    {stock.industry === 'Finance' && <Landmark className="w-4 h-4" />}
                    {stock.industry === 'Energy' && <Zap className="w-4 h-4" />}
                    {stock.industry === 'Retail' && <Building2 className="w-4 h-4" />}
                    <h3 className="font-semibold">{stock.name}</h3>
                  </div>
                  <div className="text-sm text-gray-500">{stock.symbol}</div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold">${stock.price.toFixed(2)}</div>
                    <div className={`flex items-center gap-1 ${
                      stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stock.change >= 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      {Math.abs(stock.change).toFixed(2)}%
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">{stock.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <div>Market Cap: ${(stock.marketCap / 1000000).toFixed(1)}M</div>
                    <div>Vol: {(stock.volatility * 100).toFixed(1)}%</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  onClick={() => handleBuy(stock)}
                  className="flex-1 mr-2 bg-green-600 hover:bg-green-700"
                  disabled={gameState.money < stock.price}
                >
                  Buy
                </Button>
                <Button
                  onClick={() => handleSell(stock)}
                  className="flex-1 ml-2 bg-red-600 hover:bg-red-700"
                  disabled={!gameState.portfolio[stock.symbol] || gameState.portfolio[stock.symbol] <= 0}
                >
                  Sell
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const resetGame = () => {
    const initialState = {
      money: INITIAL_MONEY,
      portfolio: {},
      level: 1,
      xp: 0,
      unlockedStocks: ["MCRO", "LEAF", "HLTH"],
      currentEvent: null,
      lastSaved: Date.now(),
      totalTrades: 0
    };
    setGameState(initialState);
    localStorage.removeItem(SAVE_KEY);
    setSelectedTier(null);
    setShowSaveMessage(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 bg-white">
        {/* Back to Games Button */}
        <div className="mb-6">
          <Button
            onClick={() => window.location.href = '/learn'}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Games
          </Button>
        </div>

        <GameStats />

        {/* Save Button */}
        <div className="flex justify-end mb-4">
          <Button 
            onClick={saveGame}
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Game
          </Button>
        </div>

        {/* Save Message */}
        <AnimatePresence>
          {showSaveMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-4 right-4 bg-green-100 border border-green-200 rounded-lg p-4"
            >
              <p className="text-green-800">Game saved!</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Market Event */}
        <AnimatePresence>
          {gameState.currentEvent && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <div className={`${gameState.currentEvent.color} border rounded-lg p-4 relative`}>
                <div className="flex items-center gap-3">
                  {gameState.currentEvent.icon}
                  <h3 className={`font-semibold ${
                    gameState.currentEvent.type === "positive" ? "text-green-800" : "text-red-800"
                  }`}>
                    {gameState.currentEvent.message}
                  </h3>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        {selectedTier ? <TradingInterface /> : <MarketOverview />}

        {/* Tutorial Modal */}
        {showTutorial && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="max-w-md mx-4">
              <CardHeader>
                <CardTitle>Welcome to Market Adventure!</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>Start with $1 and grow your portfolio!</p>
                  <p>Begin with penny stocks and work your way up.</p>
                  <p>Earn XP by trading to unlock higher-tier stocks.</p>
                  <p>Each level unlocks new investment opportunities.</p>
                  <p>Your progress is automatically saved.</p>
                  <Button 
                    className="w-full"
                    onClick={() => setShowTutorial(false)}
                  >
                    Start Trading
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      <AppNavigation />
    </div>
  );
} 