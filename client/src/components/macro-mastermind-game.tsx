import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useGameState } from '@/hooks/use-game-state';
import { GameHeader, GameOver } from './ui/game-elements';
import { FinancialCardGame } from './financial-card-game';
import { 
  Globe, TrendingUp, TrendingDown, AlertTriangle, DollarSign, ArrowLeft, 
  Briefcase, LineChart, Scale, X, CreditCard, Users, Trophy, Brain,
  Activity, Ban, Handshake, Rocket, Shield
} from 'lucide-react';
import { FaLaptopCode, FaIndustry, FaHandshake, FaBolt, FaChartLine, FaGlobe, FaTrophy, FaBrain, FaCreditCard } from 'react-icons/fa';
import { TbChartBar, TbBuildingFactory2, TbHeartHandshake, TbBolt, TbPigMoney, TbDeviceAnalytics, TbTrendingUp } from 'react-icons/tb';
import type { IconType } from 'react-icons';

// Interfaces for the game
interface MarketSector {
  id: string;
  name: string;
  icon: IconType;
  performance: number;
  volatility: number;
  trend: number;
  history: Array<{ timestamp: number; value: number }>;
}

interface Region {
  id: string;
  name: string;
  path: string;
  center: { x: number, y: number };
  sectors: {
    technology: MarketSector;
    manufacturing: MarketSector;
    services: MarketSector;
    energy: MarketSector;
    finance: MarketSector;
  };
  economicStats: {
    gdp: number;
    politicalStability: number;
    marketHealth: number;
    interestRate: number;
    tradeBalance: number;
  };
  events: GameEvent[];
  relationships: { [key: string]: number };
}

interface GameEvent {
  id: string;
  type: 'political' | 'economic' | 'trade' | 'social' | 'environmental';
  title: string;
  description: string;
  timestamp: number;
  globalImpactFactor: number;
  sectorImpacts: { [sectorId: string]: number };
  policyOptions: PolicyOption[];
  timeLimit: number;
  educationalContent: {
    theory: string;
    realWorldExample: string;
    keyTerms: string[];
  };
}

interface PolicyOption {
  id: string;
  title: string;
  description: string;
  effects: {
    [key: string]: number;
  };
  targetRegion?: string;
  tradeImpact: {
    tariffs?: number;
    restrictions?: string[];
    diplomaticPenalty: number;
  };
}

interface InternationalEvent {
  id: string;
  sourceRegion: string;
  title: string;
  description: string;
  severity: number;
  type: 'trade' | 'political' | 'economic' | 'diplomatic' | 'environmental';
  affectedSectors: string[];
  policyResponses: PolicyResponse[];
  timeToRespond: number; // seconds
  impactDelay: number; // turns before impact if no response
  potentialImpact: {
    market: number;
    diplomatic: { [regionId: string]: number };
    sectors: { [sectorId: string]: number };
  };
}

interface PolicyResponse {
  id: string;
  title: string;
  description: string;
  cost: number;
  effects: {
    domesticMarket: number;
    internationalRelations: { [regionId: string]: number };
    politicalStability: number;
    economicImpact: {
      gdp: number;
      marketHealth: number;
      tradeBalance: number;
    };
    sectorImpacts: { [sectorId: string]: number };
  };
}

interface GameState {
  turn: number;
  availableFunds: number;
  overallMarketHealth: number;
  eventHistory: GameEvent[];
  activeEvents: GameEvent[];
  difficulty: 'easy' | 'medium' | 'hard';
  tutorialCompleted: boolean;
  achievements: string[];
}

interface SectorFocus {
  sector: keyof Region['sectors'];
  intensity: 'low' | 'medium' | 'high';
  description: string;
}

interface EconomicPolicy {
  type: 'expansionary' | 'contractionary' | 'neutral';
  focus: 'domestic' | 'international' | 'balanced';
  description: string;
}

interface TradeEvent {
  id: string;
  type: 'trade_deal' | 'trade_crisis' | 'market_opportunity';
  title: string;
  description: string;
  regionId: string;
  sectorImpacts: { [key: string]: number };
  timeLimit: number;
}

// Initial market sectors configuration
const INITIAL_SECTORS: { [key: string]: MarketSector } = {
  technology: {
    id: 'tech',
    name: 'Technology',
    icon: TbDeviceAnalytics,
    performance: 100,
    volatility: 0.8,
    trend: 0.1,
    history: []
  },
  manufacturing: {
    id: 'mfg',
    name: 'Manufacturing',
    icon: TbBuildingFactory2,
    performance: 100,
    volatility: 0.5,
    trend: 0.05,
    history: []
  },
  services: {
    id: 'srv',
    name: 'Services',
    icon: TbHeartHandshake,
    performance: 100,
    volatility: 0.3,
    trend: 0.03,
    history: []
  },
  energy: {
    id: 'nrg',
    name: 'Energy',
    icon: TbBolt,
    performance: 100,
    volatility: 0.6,
    trend: 0.02,
    history: []
  },
  finance: {
    id: 'fin',
    name: 'Finance',
    icon: TbPigMoney,
    performance: 100,
    volatility: 0.7,
    trend: 0.04,
    history: []
  }
};

// World regions with sector-based configuration
const WORLD_REGIONS: Region[] = [
  {
    id: 'na',
    name: 'North America',
    path: 'M 150 70 L 280 70 L 300 150 L 250 200 L 150 180 Z',
    center: { x: 200, y: 120 },
    sectors: {
      technology: { ...INITIAL_SECTORS.technology, performance: 110, trend: 0.15 },
      manufacturing: { ...INITIAL_SECTORS.manufacturing, performance: 95 },
      services: { ...INITIAL_SECTORS.services, performance: 105 },
      energy: { ...INITIAL_SECTORS.energy, performance: 100 },
      finance: { ...INITIAL_SECTORS.finance, performance: 108 }
    },
    economicStats: {
      gdp: 100,
      politicalStability: 85,
      marketHealth: 90,
      interestRate: 2.5,
      tradeBalance: 0
    },
    events: [],
    relationships: { eu: 90, asia: 70, sa: 85, af: 60 }
  },
  {
    id: 'eu',
    name: 'Europe',
    path: 'M 350 60 L 420 60 L 440 100 L 400 140 L 340 120 Z',
    center: { x: 380, y: 90 },
    sectors: {
      technology: { ...INITIAL_SECTORS.technology, performance: 105, trend: 0.1 },
      manufacturing: { ...INITIAL_SECTORS.manufacturing, performance: 90 },
      services: { ...INITIAL_SECTORS.services, performance: 100 },
      energy: { ...INITIAL_SECTORS.energy, performance: 95 },
      finance: { ...INITIAL_SECTORS.finance, performance: 102 }
    },
    economicStats: {
      gdp: 90,
      politicalStability: 80,
      marketHealth: 85,
      interestRate: 2.0,
      tradeBalance: -5
    },
    events: [],
    relationships: { na: 90, asia: 75, sa: 70, af: 65 }
  },
  {
    id: 'asia',
    name: 'Asia',
    path: 'M 450 80 L 580 80 L 600 160 L 520 200 L 440 150 Z',
    center: { x: 520, y: 130 },
    sectors: {
      technology: { ...INITIAL_SECTORS.technology, performance: 108, trend: 0.12 },
      manufacturing: { ...INITIAL_SECTORS.manufacturing, performance: 92 },
      services: { ...INITIAL_SECTORS.services, performance: 102 },
      energy: { ...INITIAL_SECTORS.energy, performance: 98 },
      finance: { ...INITIAL_SECTORS.finance, performance: 105 }
    },
    economicStats: {
      gdp: 95,
      politicalStability: 75,
      marketHealth: 80,
      interestRate: 3.0,
      tradeBalance: 10
    },
    events: [],
    relationships: { na: 70, eu: 75, sa: 60, af: 70 }
  },
  {
    id: 'sa',
    name: 'South America',
    path: 'M 200 220 L 280 220 L 300 320 L 240 350 L 180 300 Z',
    center: { x: 240, y: 280 },
    sectors: {
      technology: { ...INITIAL_SECTORS.technology, performance: 98, trend: 0.08 },
      manufacturing: { ...INITIAL_SECTORS.manufacturing, performance: 75 },
      services: { ...INITIAL_SECTORS.services, performance: 85 },
      energy: { ...INITIAL_SECTORS.energy, performance: 80 },
      finance: { ...INITIAL_SECTORS.finance, performance: 88 }
    },
    economicStats: {
      gdp: 75,
      politicalStability: 65,
      marketHealth: 70,
      interestRate: 5.0,
      tradeBalance: -2
    },
    events: [],
    relationships: { na: 85, eu: 70, asia: 60, af: 55 }
  },
  {
    id: 'af',
    name: 'Africa',
    path: 'M 350 180 L 450 180 L 470 300 L 400 340 L 330 280 Z',
    center: { x: 400, y: 250 },
    sectors: {
      technology: { ...INITIAL_SECTORS.technology, performance: 95, trend: 0.07 },
      manufacturing: { ...INITIAL_SECTORS.manufacturing, performance: 60 },
      services: { ...INITIAL_SECTORS.services, performance: 65 },
      energy: { ...INITIAL_SECTORS.energy, performance: 60 },
      finance: { ...INITIAL_SECTORS.finance, performance: 68 }
    },
    economicStats: {
      gdp: 60,
      politicalStability: 60,
      marketHealth: 65,
      interestRate: 7.0,
      tradeBalance: -8
    },
    events: [],
    relationships: { na: 60, eu: 65, asia: 70, sa: 55 }
  }
];

// Event templates that can occur in the game
const EVENT_TEMPLATES: GameEvent[] = [
  {
    id: 'evt_trade_agreement',
    type: 'trade',
    title: 'International Trade Agreement',
    description: 'Major trading partners have proposed a new trade agreement that could reshape international commerce.',
    timestamp: 0,
    globalImpactFactor: 0.7,
    sectorImpacts: {
      technology: 5,
      manufacturing: 8,
      services: 3,
      energy: 2,
      finance: 4
    },
    policyOptions: [
      {
        id: 'policy_embrace',
        title: 'Embrace Agreement',
        description: 'Fully support and sign the trade agreement.',
        effects: {
          technology: 5,
          manufacturing: 8,
          services: 3,
          energy: 2,
          finance: 4,
          tradeBalance: 10
        },
        longTermEffects: {
          description: 'Strengthened international trade relationships but some domestic industries may struggle with competition.',
          duration: 5,
          sectorEffects: {
            manufacturing: -2,
            technology: 5
          }
        }
      },
      {
        id: 'policy_negotiate',
        title: 'Negotiate Terms',
        description: 'Seek modifications to better protect your interests.',
        effects: {
          technology: 2,
          manufacturing: 3,
          services: 2,
          energy: 1,
          finance: 2,
          tradeBalance: 5
        },
        longTermEffects: {
          description: 'Balanced approach maintains stability while gaining some benefits.',
          duration: 3,
          sectorEffects: {
            manufacturing: 1,
            technology: 2
          }
        }
      },
      {
        id: 'policy_reject',
        title: 'Reject Agreement',
        description: 'Decline participation to protect domestic markets.',
        effects: {
          technology: -2,
          manufacturing: -3,
          services: -1,
          energy: -1,
          finance: -2,
          tradeBalance: -5
        },
        longTermEffects: {
          description: 'Protected domestic industries but international relationships strained.',
          duration: 4,
          sectorEffects: {
            manufacturing: 3,
            technology: -4
          }
        }
      }
    ],
    timeLimit: 30,
    educationalContent: {
      theory: 'Trade agreements typically aim to reduce barriers to international commerce through tariff reduction and standardization.',
      realWorldExample: 'The USMCA (United States-Mexico-Canada Agreement) replaced NAFTA in 2020, modernizing trade relations in North America.',
      keyTerms: ['Tariff', 'Trade Deficit', 'Protectionism', 'Free Trade']
    }
  },
  {
    id: 'evt_tech_innovation',
    type: 'economic',
    title: 'Technological Breakthrough',
    description: 'A major technological breakthrough has emerged that could transform multiple industries.',
    timestamp: 0,
    globalImpactFactor: 0.8,
    sectorImpacts: {
      technology: 12,
      manufacturing: 6,
      services: 4,
      energy: 5,
      finance: 3
    },
    policyOptions: [
      {
        id: 'policy_invest',
        title: 'Government Investment',
        description: 'Provide substantial funding to accelerate adoption.',
        effects: {
          technology: 12,
          manufacturing: 6,
          services: 4,
          energy: 5,
          finance: 3,
          marketHealth: 10
        },
        longTermEffects: {
          description: 'Accelerated technological transformation with competitive advantage.',
          duration: 6,
          sectorEffects: {
            technology: 8,
            manufacturing: 4
          }
        }
      },
      {
        id: 'policy_partnership',
        title: 'Public-Private Partnership',
        description: 'Collaborate with private industry for balanced implementation.',
        effects: {
          technology: 8,
          manufacturing: 4,
          services: 3,
          energy: 3,
          finance: 2,
          marketHealth: 5
        },
        longTermEffects: {
          description: 'Sustainable integration with balanced risk and reward.',
          duration: 4,
          sectorEffects: {
            technology: 5,
            manufacturing: 3
          }
        }
      },
      {
        id: 'policy_wait',
        title: 'Wait and See',
        description: 'Allow market forces to naturally integrate the technology.',
        effects: {
          technology: 4,
          manufacturing: 2,
          services: 1,
          energy: 1,
          finance: 1,
          marketHealth: 0
        },
        longTermEffects: {
          description: 'Slower adoption but fewer disruptions to existing systems.',
          duration: 2,
          sectorEffects: {
            technology: 2,
            manufacturing: 1
          }
        }
      }
    ],
    timeLimit: 25,
    educationalContent: {
      theory: 'Technological innovation drives economic growth through improved productivity and creation of new markets.',
      realWorldExample: 'The internet revolution transformed global business models and created trillion-dollar tech companies.',
      keyTerms: ['Innovation', 'Disruption', 'Productivity', 'Research & Development']
    }
  },
  {
    id: 'evt_financial_crisis',
    type: 'economic',
    title: 'Financial Market Turbulence',
    description: 'Financial markets are experiencing extreme volatility, threatening economic stability.',
    timestamp: 0,
    globalImpactFactor: 0.9,
    sectorImpacts: {
      technology: -6,
      manufacturing: -5,
      services: -7,
      energy: -4,
      finance: -15
    },
    policyOptions: [
      {
        id: 'policy_bailout',
        title: 'Financial Sector Bailout',
        description: 'Provide emergency funds to stabilize financial institutions.',
        effects: {
          technology: -3,
          manufacturing: -2,
          services: -3,
          energy: -2,
          finance: -5,
          marketHealth: 15
        },
        longTermEffects: {
          description: 'Immediate stability but potential moral hazard and public debt concerns.',
          duration: 5,
          sectorEffects: {
            finance: 10,
            technology: -1
          }
        }
      },
      {
        id: 'policy_regulation',
        title: 'Increase Regulation',
        description: 'Implement stricter financial regulations to prevent future crises.',
        effects: {
          technology: -4,
          manufacturing: -3,
          services: -4,
          energy: -3,
          finance: -8,
          marketHealth: 5
        },
        longTermEffects: {
          description: 'More stable financial system but potentially slower growth.',
          duration: 7,
          sectorEffects: {
            finance: 5,
            technology: -2
          }
        }
      },
      {
        id: 'policy_austerity',
        title: 'Austerity Measures',
        description: 'Cut government spending to maintain fiscal discipline.',
        effects: {
          technology: -5,
          manufacturing: -4,
          services: -6,
          energy: -3,
          finance: -10,
          marketHealth: -5
        },
        longTermEffects: {
          description: 'Reduced debt but prolonged economic downturn.',
          duration: 8,
          sectorEffects: {
            finance: -2,
            technology: -3
          }
        }
      }
    ],
    timeLimit: 20,
    educationalContent: {
      theory: 'Financial crises can originate from asset bubbles, excessive leverage, or systemic risk, requiring decisive policy intervention.',
      realWorldExample: 'The 2008 Global Financial Crisis led to unprecedented government intervention in financial markets worldwide.',
      keyTerms: ['Systemic Risk', 'Liquidity', 'Bailout', 'Moral Hazard']
    }
  }
];

// Add new trade regulation events
const TRADE_EVENTS: GameEvent[] = [
  {
    id: 'trade_tariff',
    type: 'trade',
    title: 'Trade Tension',
    description: 'A region is considering imposing new tariffs on your goods.',
    timestamp: 0,
    globalImpactFactor: 0.6,
    sectorImpacts: {
      manufacturing: -5,
      technology: -3,
      services: -2
    },
    policyOptions: [
      {
        id: 'impose_counter_tariffs',
        title: 'Impose Counter-Tariffs',
        description: 'Respond with your own tariffs on their goods.',
        effects: {
          manufacturing: -3,
          technology: -2,
          marketHealth: -5,
          tradeBalance: -10
        },
        tradeImpact: {
          tariffs: 15,
          diplomaticPenalty: -20
        }
      },
      {
        id: 'negotiate',
        title: 'Negotiate Trade Terms',
        description: 'Attempt to reach a diplomatic solution.',
        effects: {
          manufacturing: 2,
          technology: 1,
          marketHealth: 5,
          tradeBalance: 5
        },
        tradeImpact: {
          diplomaticPenalty: 10
        }
      }
    ],
    timeLimit: 2,
    educationalContent: {
      theory: 'Trade wars often lead to mutual economic damage.',
      realWorldExample: 'The 2018-2020 US-China trade war affected global supply chains.',
      keyTerms: ['Tariffs', 'Trade War', 'Economic Retaliation']
    }
  }
];

// Add new global events
const GLOBAL_EVENTS: InternationalEvent[] = [
  {
    id: 'global_recession',
    sourceRegion: 'global',
    title: 'Global Recession Warning',
    description: 'Economic indicators suggest an impending global recession.',
    severity: 8,
    type: 'economic',
    affectedSectors: ['finance', 'manufacturing', 'services'],
    timeToRespond: 2,
    impactDelay: 1,
    potentialImpact: {
      market: -15,
      diplomatic: {},
      sectors: {
        finance: -10,
        manufacturing: -8,
        services: -6,
        technology: -5,
        energy: -4
      }
    },
    policyResponses: [
      {
        id: 'stimulus',
        title: 'Economic Stimulus',
        description: 'Implement a major stimulus package to protect the economy',
        cost: 200,
        effects: {
          domesticMarket: 10,
          internationalRelations: {},
          politicalStability: 5,
          economicImpact: {
            gdp: 5,
            marketHealth: 8,
            tradeBalance: -10
          },
          sectorImpacts: {
            finance: 8,
            manufacturing: 6,
            services: 5
          }
        }
      },
      {
        id: 'austerity',
        title: 'Austerity Measures',
        description: 'Cut spending to maintain fiscal stability',
        cost: 50,
        effects: {
          domesticMarket: -5,
          internationalRelations: {},
          politicalStability: -8,
          economicImpact: {
            gdp: -3,
            marketHealth: -4,
            tradeBalance: 5
          },
          sectorImpacts: {
            finance: -4,
            manufacturing: -6,
            services: -8
          }
        }
      }
    ]
  }
];

export function MacroMastermindGame() {
  const {
    gameState: externalGameState,
    updateScore,
    addTickets,
    resetGame
  } = useGameState();
  
  // Game phase management
  const [gamePhase, setGamePhase] = useState<'selection' | 'tutorial' | 'region-selection' | 'playing' | 'ended'>('selection');
  const [playerRegion, setPlayerRegion] = useState<Region | null>(null);
  const [regions, setRegions] = useState<Region[]>(WORLD_REGIONS);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [activeEvents, setActiveEvents] = useState<InternationalEvent[]>([]);
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [gameTurn, setGameTurn] = useState(1);
  const [gameSpeed, setGameSpeed] = useState<'Slow' | 'Normal' | 'Fast'>('Normal');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [showTutorial, setShowTutorial] = useState(true);
  const [gameMode, setGameMode] = useState<'macro' | 'cards'>('macro');
  const [gameOver, setGameOver] = useState(false);
  
  // Game state tracking
  const [internalGameState, setInternalGameState] = useState<GameState>({
    turn: 1,
    availableFunds: 1000,
    overallMarketHealth: 100,
    eventHistory: [],
    activeEvents: [],
    difficulty: 'medium',
    tutorialCompleted: false,
    achievements: []
  });
  
  // SVG reference for the world map
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Game simulation interval
  const [simInterval, setSimIntervalState] = useState<NodeJS.Timeout | null>(null);
  const [canAdvanceTurn, setCanAdvanceTurn] = useState(true);
  const [pendingActions, setPendingActions] = useState<string[]>([]);
  
  // New state for hovered region
  const [hoveredRegion, setHoveredRegion] = useState<Region | null>(null);
  
  // Add new state for sector focus and economic policy
  const [selectedSectorFocus, setSelectedSectorFocus] = useState<SectorFocus | null>(null);
  const [selectedPolicy, setSelectedPolicy] = useState<EconomicPolicy | null>(null);
  
  // Add new state for active trade events
  const [activeTradeEvents, setActiveTradeEvents] = useState<TradeEvent[]>([]);
  
  // Add new state for tracking regions we've acted on this turn
  const [regionsActedOn, setRegionsActedOn] = useState<Set<string>>(new Set());
  
  // Initialize the game when a region is selected
  const initializeGame = (regionId: string) => {
    const selected = regions.find(r => r.id === regionId);
    if (!selected) return;
    
    setPlayerRegion(selected);
    setGamePhase('playing');
    // Initialize with all required actions
    setPendingActions([
      'Choose a sector to focus on',
      'Set economic policy',
      'Review trade relations'
    ]);
    
    // Remove automatic turn advancement
    if (simInterval) {
      clearInterval(simInterval);
      setSimIntervalState(null);
    }
  };
  
  // Clean up interval on component unmount
  useEffect(() => {
    return () => {
      if (simInterval) clearInterval(simInterval);
    };
  }, [simInterval]);
  
  // Simulate market movements
  const simulateMarketMovements = () => {
    if (!playerRegion) return;
    
    setRegions(prevRegions => {
      return prevRegions.map(region => {
        // Calculate trade impacts from other regions
        const tradeImpacts = prevRegions
          .filter(r => r.id !== region.id)
          .reduce((acc, otherRegion) => {
            const relationship = region.relationships[otherRegion.id] || 50;
            const tradeFactor = (relationship - 50) / 100; // -0.5 to 0.5
            
            return {
              technology: acc.technology + (tradeFactor * 2),
              manufacturing: acc.manufacturing + (tradeFactor * 3),
              services: acc.services + (tradeFactor * 1),
              energy: acc.energy + (tradeFactor * 2),
              finance: acc.finance + (tradeFactor * 1.5)
            };
          }, { technology: 0, manufacturing: 0, services: 0, energy: 0, finance: 0 });

        if (region.id === playerRegion.id) {
          const updatedSectors = Object.entries(region.sectors).reduce((acc, [key, sector]) => {
            const tradeEffect = tradeImpacts[key as keyof typeof tradeImpacts] || 0;
            const volatilityFactor = sector.volatility * (Math.random() - 0.5) * 2;
            const trendFactor = sector.trend;
            
            let newPerformance = sector.performance * (1 + (volatilityFactor + trendFactor + tradeEffect) / 100);
            newPerformance = Math.max(40, Math.min(160, newPerformance));
            
            return {
              ...acc,
              [key]: {
                ...sector,
                performance: newPerformance,
                history: [...sector.history, { timestamp: Date.now(), value: newPerformance }].slice(-50)
              }
            };
          }, {});

          return {
            ...region,
            sectors: updatedSectors as typeof region.sectors,
            economicStats: {
              ...region.economicStats,
              marketHealth: Math.min(100, Math.max(0, region.economicStats.marketHealth + 
                Object.values(tradeImpacts).reduce((sum, val) => sum + val, 0) / 5)),
              tradeBalance: region.economicStats.tradeBalance + 
                Object.values(tradeImpacts).reduce((sum, val) => sum + val, 0) / 10
            }
          };
        }
        
        // Simpler simulation for AI regions
        return {
          ...region,
          economicStats: {
            ...region.economicStats,
            marketHealth: Math.min(100, Math.max(0, region.economicStats.marketHealth + (Math.random() * 6 - 3))),
            tradeBalance: region.economicStats.tradeBalance + (Math.random() * 4 - 2)
          }
        };
      });
    });
  };
  
  // Check for events
  const checkForEvents = () => {
    // Process existing events
    setActiveEvents(prev => {
      return prev.filter(event => {
        // Apply event impacts if the time to respond has passed
        if (event.impactDelay <= 0) {
          applyEventImpact(event);
          return false; // Remove the event
        }
        
        // Decrement the impact delay
        return {
          ...event,
          impactDelay: event.impactDelay - 1
        };
      });
    });
  };
  
  // Apply event impact if no response was chosen
  const applyEventImpact = (event: InternationalEvent) => {
    if (!playerRegion) return;
    
    setRegions(prevRegions => {
      return prevRegions.map(region => {
        if (region.id === playerRegion.id) {
          // Apply sector impacts
          const updatedSectors = Object.entries(region.sectors).reduce((acc, [key, sector]) => {
            const impact = event.potentialImpact.sectors[key] || 0;
            
            return {
              ...acc,
              [key]: {
                ...sector,
                performance: Math.max(40, Math.min(160, sector.performance * (1 + impact / 100)))
              }
            };
          }, {});
          
          // Apply market health impact
          const updatedStats = {
            ...region.economicStats,
            marketHealth: Math.max(0, Math.min(100, region.economicStats.marketHealth + event.potentialImpact.market))
          };
          
          // Apply diplomatic impacts
          const updatedRelationships = { ...region.relationships };
          Object.entries(event.potentialImpact.diplomatic).forEach(([regionId, impact]) => {
            if (regionId in updatedRelationships) {
              updatedRelationships[regionId] = Math.max(0, Math.min(100, updatedRelationships[regionId] + impact));
            }
          });
          
          return {
            ...region,
            sectors: updatedSectors as typeof region.sectors,
            economicStats: updatedStats,
            relationships: updatedRelationships
          };
        }
        return region;
      });
    });
  };
  
  // Trigger a random event
  const triggerRandomEvent = () => {
    if (!playerRegion) return;
    
    // Select a random event template
    const template = EVENT_TEMPLATES[Math.floor(Math.random() * EVENT_TEMPLATES.length)];
    
    // Create a new event with current timestamp
    const newEvent: GameEvent = {
      ...template,
      id: `${template.id}_${Date.now()}`,
      timestamp: Date.now()
    };
    
    setCurrentEvent(newEvent);
    setShowEventDetails(true);
  };
  
  // Original advanceTurn function
  const advanceTurn = () => {
    console.log('Attempting to advance turn...');
    console.log('Pending actions:', pendingActions);
    
    // Only allow advancing turn if all actions are completed
    if (pendingActions.length > 0) {
      console.log('Cannot advance turn - pending actions remain:', pendingActions);
      return;
    }
    
    console.log('Advancing turn...');
    setGameTurn(prev => {
      const newTurn = prev + 1;
      
      if (newTurn > 20) {
        endGame();
        return prev;
      }
      
      // Process trade events
      setActiveTradeEvents(prevEvents => {
        const updatedEvents = prevEvents.map(event => ({
          ...event,
          timeLimit: event.timeLimit - 1
        })).filter(event => event.timeLimit > 0);
        
        console.log('Updated trade events:', updatedEvents);
        
        // Apply impacts from events that have expired
        prevEvents
          .filter(event => event.timeLimit <= 1)
          .forEach(event => {
            console.log('Applying expired event:', event);
            if (playerRegion) {
              setRegions(prevRegions => {
                return prevRegions.map(region => {
                  if (region.id === playerRegion.id) {
                    // Apply sector impacts
                    const updatedSectors = Object.entries(region.sectors).reduce((acc, [key, sector]) => {
                      const impact = event.sectorImpacts[key] || 0;
                      return {
                        ...acc,
                        [key]: {
                          ...sector,
                          performance: Math.max(40, Math.min(160, 
                            sector.performance * (1 + impact / 100)
                          ))
                        }
                      };
                    }, {});
                    
                    return {
                      ...region,
                      sectors: updatedSectors as typeof region.sectors
                    };
                  }
                  return region;
                });
              });
            }
          });
        
        return updatedEvents;
      });
      
      // Simulate market movements and AI decisions
      simulateMarketMovements();
      simulateAIRegionDecisions();
      checkForEvents();
      
      // Reset regions acted on for the new turn
      setRegionsActedOn(new Set());
      
      // Reset pending actions for next turn
      setPendingActions([
        'Choose a sector to focus on',
        'Set economic policy',
        'Review trade relations'
      ]);
      
      return newTurn;
    });
  };
  
  // Add action completion handler
  const completeAction = (action: string) => {
    setPendingActions(prev => {
      const newPendingActions = prev.filter(a => a !== action);
      console.log('Completed action:', action);
      console.log('Remaining actions:', newPendingActions);
      return newPendingActions;
    });
  };
  
  // Handle policy selection for an event
  const handlePolicySelection = (policyOption: PolicyOption) => {
    if (!playerRegion || !currentEvent) return;
    
    // Apply immediate policy effects to the player's region
    setRegions(prevRegions => {
      return prevRegions.map(region => {
        if (region.id === playerRegion.id) {
          // Apply sector effects
          const updatedSectors = Object.entries(region.sectors).reduce((acc, [key, sector]) => {
            const impact = policyOption.effects[key] || 0;
            
            return {
              ...acc,
              [key]: {
                ...sector,
                performance: Math.max(40, Math.min(160, sector.performance * (1 + impact / 100))),
                trend: sector.trend + (impact / 500) // Small adjustment to trend
              }
            };
          }, {});
          
          // Apply economic stat changes
          const updatedStats = {
            ...region.economicStats
          };
          
          if (policyOption.effects.marketHealth !== undefined) {
            updatedStats.marketHealth = Math.max(0, Math.min(100, region.economicStats.marketHealth + policyOption.effects.marketHealth));
          }
          
          if (policyOption.effects.interestRate !== undefined) {
            updatedStats.interestRate = Math.max(0, region.economicStats.interestRate + policyOption.effects.interestRate);
          }
          
          if (policyOption.effects.tradeBalance !== undefined) {
            updatedStats.tradeBalance = region.economicStats.tradeBalance + policyOption.effects.tradeBalance;
          }
          
          return {
            ...region,
            sectors: updatedSectors as typeof region.sectors,
            economicStats: updatedStats,
            events: [...region.events, currentEvent]
          };
        }
        return region;
      });
    });
    
    // Add to event history
    setInternalGameState(prev => ({
      ...prev,
      eventHistory: [...prev.eventHistory, currentEvent],
      availableFunds: prev.availableFunds - 100 // Example cost for policy implementation
    }));
    
    // Close the event modal
    setCurrentEvent(null);
    setShowEventDetails(false);
    
    // Award XP for handling an event
    const eventImpact = Math.abs(
      Object.values(currentEvent.sectorImpacts).reduce((sum, val) => sum + val, 0)
    );
    const xpGained = Math.floor(eventImpact / 5);
    addXP(xpGained);
  };
  
  // Add XP and possibly tickets
  const addXP = (amount: number) => {
    // For this game, we'll directly convert XP to score
    updateScore(prev => prev + amount);
    
    // Potentially award tickets for significant policy decisions
    if (amount >= 10) {
      addTickets(1);
    }
  };
  
  // End the game
  const endGame = () => {
    // Clean up interval
    if (simInterval) {
      clearInterval(simInterval);
      setSimIntervalState(null);
    }
    
    setGamePhase('ended');
    
    // Calculate final score based on economic health and relationships
    if (playerRegion) {
      const economicScore = playerRegion.economicStats.marketHealth +
                          playerRegion.economicStats.gdp +
                          playerRegion.economicStats.politicalStability;
      
      const relationshipScore = Object.values(playerRegion.relationships).reduce((sum, val) => sum + val, 0) / 4;
      
      const sectorScore = Object.values(playerRegion.sectors).reduce((sum, sector) => sum + sector.performance, 0) / 5;
      
      const finalScore = Math.floor((economicScore + relationshipScore + sectorScore) / 3);
      
      // Update final score
      updateScore(finalScore);
      
      // Award tickets based on final score
      const ticketsEarned = Math.floor(finalScore / 50);
      addTickets(ticketsEarned);
    }
  };
  
  // Restart game
  const restartGame = () => {
    // Reset game state
    setRegions(WORLD_REGIONS);
    setPlayerRegion(null);
    setSelectedRegion(null);
    setActiveEvents([]);
    setCurrentEvent(null);
    setShowEventDetails(false);
    setGameTurn(1);
    setInternalGameState({
      turn: 1,
      availableFunds: 1000,
      overallMarketHealth: 100,
      eventHistory: [],
      activeEvents: [],
      difficulty: difficulty,
      tutorialCompleted: true,
      achievements: []
    });
    
    // Clean up interval
    if (simInterval) {
      clearInterval(simInterval);
      setSimIntervalState(null);
    }
    
    // Reset to selection phase
    setGamePhase('selection');
    
    // Reset external game state
    resetGame();
  };
  
  // Return to games hub
  const returnToHub = () => {
    resetGame();
  };
  
  // Render game mode selection
  const renderGameModeSelection = () => {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        {/* Header with tickets */}
        <div className="w-full max-w-4xl flex justify-between items-center mb-8 px-4">
          <h1 className="text-xl font-semibold">Macro Mastermind</h1>
          <div className="flex items-center gap-2 bg-amber-50 px-3 py-1 rounded-full">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="text-amber-700 font-medium">3</span>
          </div>
        </div>

        {/* Main content card */}
        <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex flex-col items-center px-6 py-12 text-center">
            {/* Icon */}
            <div className="w-24 h-24 mb-8 bg-blue-100 rounded-2xl flex items-center justify-center transform rotate-12">
              <Brain className="w-12 h-12 text-blue-500 transform -rotate-12" />
            </div>

            {/* Title and description */}
            <h2 className="text-2xl font-bold mb-4">Ready to test your knowledge?</h2>
            <p className="text-gray-600 mb-8">
              Choose your learning experience to earn raffle tickets!
            </p>

            {/* Game mode buttons */}
            <div className="space-y-4 w-full">
              <Button
                size="lg"
                onClick={() => {
                  setGameMode('macro');
                  setGamePhase('region-selection');
                  setShowTutorial(false);
                }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-6 rounded-xl transition-all duration-200"
              >
                <Globe className="w-5 h-5 mr-2" />
                Global Economics
              </Button>

              <Button
                size="lg"
                onClick={() => {
                  setGameMode('cards');
                  setGamePhase('playing');
                  setShowTutorial(false);
                }}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-6 rounded-xl transition-all duration-200"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Financial Metrics
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render tutorial
  const renderTutorial = () => {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm z-50"
      >
        <Card className="w-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Welcome to Macro Mastermind</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">Choose your preferred learning experience:</p>
            <ul className="list-disc pl-4 text-sm space-y-1">
              <li>Macro Mastermind: Master global economics and market dynamics</li>
              <li>Financial Metrics Battle: Learn metrics through strategic card battles</li>
            </ul>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button size="sm" onClick={() => setShowTutorial(false)}>Got it!</Button>
          </CardFooter>
        </Card>
      </motion.div>
    );
  };
  
  // Region selection component
  const renderRegionSelection = () => {
    return (
      <div className="max-w-4xl mx-auto mt-6 p-4">
        <GameHeader
          title="Macro Mastermind"
          description="Global Economic Simulation"
          icon={<Globe className="h-6 w-6" />}
        />
        
        <Card className="mt-6 overflow-hidden">
          <CardHeader>
            <CardTitle>Select Your Region</CardTitle>
            <CardDescription>Each region has unique economic strengths and challenges</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Simple region selection with colored blocks instead of SVG map */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {regions.map(region => (
                  <motion.div
                    key={region.id}
                    className={`p-4 rounded-lg border cursor-pointer ${
                      selectedRegion?.id === region.id ? 'border-primary bg-primary/10' : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedRegion(region)}
                  >
                    <h3 className="font-bold mb-2">{region.name}</h3>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>GDP:</span>
                        <span>{region.economicStats.gdp}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tech:</span>
                        <span>{Math.round(region.sectors.technology.performance)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Finance:</span>
                        <span>{Math.round(region.sectors.finance.performance)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {selectedRegion && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 border rounded-lg"
              >
                <h3 className="font-bold text-lg mb-2">{selectedRegion.name}</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div>
                    <div className="text-sm text-gray-500">GDP Rating</div>
                    <div className="flex items-center">
                      <Progress value={selectedRegion.economicStats.gdp} className="h-2 flex-grow" />
                      <span className="ml-2 text-sm font-medium">{selectedRegion.economicStats.gdp}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Market Health</div>
                    <div className="flex items-center">
                      <Progress value={selectedRegion.economicStats.marketHealth} className="h-2 flex-grow" />
                      <span className="ml-2 text-sm font-medium">{selectedRegion.economicStats.marketHealth}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Political Stability</div>
                    <div className="flex items-center">
                      <Progress value={selectedRegion.economicStats.politicalStability} className="h-2 flex-grow" />
                      <span className="ml-2 text-sm font-medium">{selectedRegion.economicStats.politicalStability}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Interest Rate</div>
                    <div className="font-medium">{selectedRegion.economicStats.interestRate}%</div>
                  </div>
                </div>
                
                <h4 className="font-medium mt-4 mb-2">Key Sectors</h4>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(selectedRegion.sectors).map(([id, sector]) => (
                    <div key={id} className="text-sm">
                      <div className="font-medium">{sector.name}</div>
                      <div className={`flex items-center ${
                        sector.performance > 100 ? 'text-green-500' : sector.performance < 95 ? 'text-red-500' : 'text-yellow-500'
                      }`}>
                        {sector.performance.toFixed(1)}
                        {sector.trend > 0 ? <TrendingUp className="h-3 w-3 ml-1" /> : <></>}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setShowTutorial(true)}>
              Tutorial
            </Button>
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={returnToHub}
              >
                Cancel
              </Button>
              <Button
                disabled={!selectedRegion}
                onClick={() => selectedRegion && initializeGame(selectedRegion.id)}
              >
                Start Game
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  };
  
  // World map component
  const WorldMap = () => {
    return (
      <div className="relative w-full aspect-[2/1] bg-slate-100 rounded-lg overflow-hidden">
        <svg
          viewBox="0 0 1000 500"
          className="w-full h-full"
          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
        >
          {/* North America */}
          <path
            d="M 150 50 L 280 50 L 300 130 L 250 180 L 150 160 Z"
            className={`${playerRegion?.id === 'na' ? 'fill-primary/20 stroke-primary' : 'fill-slate-200 stroke-slate-300'} 
              hover:fill-primary/10 transition-colors cursor-pointer`}
            onClick={() => handleRegionClick('na')}
            onMouseEnter={() => setHoveredRegion(regions.find(r => r.id === 'na') || null)}
            onMouseLeave={() => setHoveredRegion(null)}
          />
          
          {/* Europe */}
          <path
            d="M 420 60 L 520 60 L 540 100 L 500 140 L 440 120 Z"
            className={`${playerRegion?.id === 'eu' ? 'fill-primary/20 stroke-primary' : 'fill-slate-200 stroke-slate-300'} 
              hover:fill-primary/10 transition-colors cursor-pointer`}
            onClick={() => handleRegionClick('eu')}
            onMouseEnter={() => setHoveredRegion(regions.find(r => r.id === 'eu') || null)}
            onMouseLeave={() => setHoveredRegion(null)}
          />
          
          {/* Asia */}
          <path
            d="M 550 80 L 750 80 L 780 160 L 700 200 L 540 160 Z"
            className={`${playerRegion?.id === 'asia' ? 'fill-primary/20 stroke-primary' : 'fill-slate-200 stroke-slate-300'} 
              hover:fill-primary/10 transition-colors cursor-pointer`}
            onClick={() => handleRegionClick('asia')}
            onMouseEnter={() => setHoveredRegion(regions.find(r => r.id === 'asia') || null)}
            onMouseLeave={() => setHoveredRegion(null)}
          />
          
          {/* South America */}
          <path
            d="M 220 220 L 300 220 L 320 350 L 250 400 L 200 350 Z"
            className={`${playerRegion?.id === 'sa' ? 'fill-primary/20 stroke-primary' : 'fill-slate-200 stroke-slate-300'} 
              hover:fill-primary/10 transition-colors cursor-pointer`}
            onClick={() => handleRegionClick('sa')}
            onMouseEnter={() => setHoveredRegion(regions.find(r => r.id === 'sa') || null)}
            onMouseLeave={() => setHoveredRegion(null)}
          />
          
          {/* Africa */}
          <path
            d="M 450 180 L 550 180 L 580 320 L 500 380 L 420 320 Z"
            className={`${playerRegion?.id === 'af' ? 'fill-primary/20 stroke-primary' : 'fill-slate-200 stroke-slate-300'} 
              hover:fill-primary/10 transition-colors cursor-pointer`}
            onClick={() => handleRegionClick('af')}
            onMouseEnter={() => setHoveredRegion(regions.find(r => r.id === 'af') || null)}
            onMouseLeave={() => setHoveredRegion(null)}
          />
          
          {/* Oceania */}
          <path
            d="M 750 300 L 850 300 L 870 380 L 800 420 L 730 380 Z"
            className={`${playerRegion?.id === 'oc' ? 'fill-primary/20 stroke-primary' : 'fill-slate-200 stroke-slate-300'} 
              hover:fill-primary/10 transition-colors cursor-pointer`}
            onClick={() => handleRegionClick('oc')}
            onMouseEnter={() => setHoveredRegion(regions.find(r => r.id === 'oc') || null)}
            onMouseLeave={() => setHoveredRegion(null)}
          />
          
          {/* Region Labels */}
          <g className="text-sm font-medium">
            <text x="200" y="100" className="fill-slate-700">North America</text>
            <text x="470" y="90" className="fill-slate-700">Europe</text>
            <text x="650" y="130" className="fill-slate-700">Asia</text>
            <text x="250" y="300" className="fill-slate-700">South America</text>
            <text x="500" y="250" className="fill-slate-700">Africa</text>
            <text x="800" y="350" className="fill-slate-700">Oceania</text>
          </g>
          
          {/* Event Indicators */}
          {activeEvents.map((event, index) => (
            <g key={event.id} className="cursor-pointer" onClick={() => handleEventClick(event)}>
              <circle
                cx={getEventPosition(event).x}
                cy={getEventPosition(event).y}
                r="8"
                className={`fill-${getEventColor(event.type)} animate-pulse`}
              />
              <circle
                cx={getEventPosition(event).x}
                cy={getEventPosition(event).y}
                r="12"
                className={`fill-${getEventColor(event.type)} opacity-30`}
              />
            </g>
          ))}
        </svg>
        
        {/* Region Stats Overlay */}
        {hoveredRegion && (
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg">
            <h3 className="font-bold mb-2">{hoveredRegion.name}</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm">GDP:</span>
                <Progress value={hoveredRegion.economicStats.gdp} className="h-2 w-24" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Market:</span>
                <Progress value={hoveredRegion.economicStats.marketHealth} className="h-2 w-24" />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Helper functions for the map
  const getEventPosition = (event: InternationalEvent) => {
    const regionCenters: { [key: string]: { x: number; y: number } } = {
      na: { x: 200, y: 100 },
      eu: { x: 470, y: 90 },
      asia: { x: 650, y: 130 },
      sa: { x: 250, y: 300 },
      af: { x: 500, y: 250 },
      oc: { x: 800, y: 350 }
    };
    return regionCenters[event.sourceRegion] || { x: 0, y: 0 };
  };

  const getEventColor = (type: string) => {
    const colors: { [key: string]: string } = {
      economic: 'yellow-500',
      political: 'red-500',
      trade: 'blue-500',
      diplomatic: 'purple-500',
      environmental: 'green-500'
    };
    return colors[type] || 'gray-500';
  };

  const handleRegionClick = (regionId: string) => {
    const region = regions.find(r => r.id === regionId);
    if (region) {
      setSelectedRegion(region);
    }
  };

  const handleEventClick = (event: InternationalEvent) => {
    setCurrentEvent(event);
    setShowEventDetails(true);
  };

  // Add Trade Policy UI component
  const TradePolicyPanel = ({ region }: { region: Region }) => {
    console.log('Rendering TradePolicyPanel with region:', region);
    console.log('Active trade events:', activeTradeEvents);
    console.log('Regions acted on:', Array.from(regionsActedOn));

    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Trade Relations</CardTitle>
            <CardDescription>Manage your trade policies with other regions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(region.relationships).map(([regionId, relationshipValue]) => {
              const targetRegion = regions.find(r => r.id === regionId);
              if (!targetRegion) return null;
              
              // Get active events for this region
              const regionEvents = activeTradeEvents.filter(e => e.regionId === regionId);
              const hasActedOnRegion = regionsActedOn.has(regionId);
              
              console.log(`Region ${targetRegion.name}:`, {
                relationshipValue,
                hasEvents: regionEvents.length > 0,
                hasActedOnRegion
              });
              
              return (
                <div key={regionId} className="space-y-2 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{targetRegion.name}</span>
                    <span className={`text-sm ${
                      relationshipValue > 75 ? 'text-green-500' :
                      relationshipValue < 40 ? 'text-red-500' :
                      'text-yellow-500'
                    }`}>
                      {relationshipValue}%
                    </span>
                  </div>
                  <Progress value={relationshipValue} className="h-2" />
                  
                  {/* Show active events */}
                  {regionEvents.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {regionEvents.map(event => (
                        <div key={event.id} className={`p-2 rounded text-sm ${
                          event.type === 'trade_crisis' ? 'bg-red-100 text-red-700' :
                          event.type === 'market_opportunity' ? 'bg-green-100 text-green-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          <div className="font-medium">{event.title}</div>
                          <div className="text-xs">{event.description}</div>
                          <div className="text-xs mt-1">
                            Time remaining: {event.timeLimit} turns
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTradePolicy(regionId, 'restrict')}
                      disabled={hasActedOnRegion}
                      className={`flex-1 flex items-center justify-center gap-2 ${
                        hasActedOnRegion ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <Ban className="w-4 h-4 text-red-500" />
                      {hasActedOnRegion ? 'Action Taken' : 'Restrict Trade'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTradePolicy(regionId, 'neutral')}
                      disabled={hasActedOnRegion}
                      className={`flex-1 flex items-center justify-center gap-2 ${
                        hasActedOnRegion ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <Scale className="w-4 h-4 text-yellow-500" />
                      {hasActedOnRegion ? 'Action Taken' : 'Maintain Relations'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTradePolicy(regionId, 'improve')}
                      disabled={hasActedOnRegion}
                      className={`flex-1 flex items-center justify-center gap-2 ${
                        hasActedOnRegion ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <Handshake className="w-4 h-4 text-green-500" />
                      {hasActedOnRegion ? 'Action Taken' : 'Improve Relations'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    );
  };

  // Modify handleTradePolicy to include neutral option
  const handleTradePolicy = (targetRegionId: string, action: 'restrict' | 'improve' | 'neutral') => {
    if (!playerRegion) return;
    
    console.log('Handling trade policy:', { targetRegionId, action });
    
    // Add region to acted on set
    setRegionsActedOn(prev => {
      const newSet = new Set([...prev, targetRegionId]);
      console.log('Regions acted on:', Array.from(newSet));
      return newSet;
    });
    
    // Mark trade relations review as complete
    completeAction('Review trade relations');
    
    setRegions(prevRegions => {
      const targetRegion = prevRegions.find(r => r.id === targetRegionId);
      if (!targetRegion) return prevRegions;

      return prevRegions.map(region => {
        if (region.id === playerRegion.id) {
          const updatedRelationships = { ...region.relationships };
          const currentRelationship = updatedRelationships[targetRegionId] || 50;
          
          console.log('Current relationship:', currentRelationship);
          
          // Calculate base changes based on action
          const relationshipChange = 
            action === 'restrict' ? -15 : 
            action === 'improve' ? 10 : 
            0; // neutral
          
          const tradeBalanceChange = 
            action === 'restrict' ? -5 : 
            action === 'improve' ? 3 : 
            0; // neutral
          
          // Apply relationship change
          updatedRelationships[targetRegionId] = Math.max(0, Math.min(100, 
            currentRelationship + relationshipChange
          ));

          console.log('New relationship:', updatedRelationships[targetRegionId]);

          // Calculate sector impacts based on trade relationship
          const sectorImpacts: { [key: string]: number } = {};
          Object.keys(region.sectors).forEach(sectorKey => {
            const sector = region.sectors[sectorKey as keyof typeof region.sectors];
            // More severe impacts for key trading sectors
            const tradeDependency = {
              technology: 0.8,
              manufacturing: 0.7,
              services: 0.5,
              energy: 0.6,
              finance: 0.4
            }[sectorKey] || 0.3;

            sectorImpacts[sectorKey] = 
              action === 'restrict' ? -5 * tradeDependency :
              action === 'improve' ? 3 * tradeDependency :
              0; // neutral
          });

          console.log('Sector impacts:', sectorImpacts);

          // Generate trade events based on action and relationship
          if (action === 'restrict' && currentRelationship > 60) {
            console.log('Generating retaliation event');
            setActiveTradeEvents(prev => {
              const newEvents = [...prev, {
                id: `retaliation_${Date.now()}`,
                type: 'trade_crisis',
                title: `${targetRegion.name} Retaliates`,
                description: `In response to trade restrictions, ${targetRegion.name} has imposed counter-measures`,
                regionId: targetRegionId,
                sectorImpacts: {
                  technology: -8,
                  manufacturing: -6,
                  services: -4
                },
                timeLimit: 2
              }];
              console.log('Active trade events:', newEvents);
              return newEvents;
            });
          } else if (action === 'improve' && currentRelationship < 40) {
            console.log('Generating opportunity event');
            setActiveTradeEvents(prev => {
              const newEvents = [...prev, {
                id: `opportunity_${Date.now()}`,
                type: 'market_opportunity',
                title: `New Market Access in ${targetRegion.name}`,
                description: `Improved relations have opened new market opportunities`,
                regionId: targetRegionId,
                sectorImpacts: {
                  technology: 6,
                  manufacturing: 5,
                  services: 4
                },
                timeLimit: 2
              }];
              console.log('Active trade events:', newEvents);
              return newEvents;
            });
          } else if (action === 'neutral') {
            console.log('Generating stability event');
            setActiveTradeEvents(prev => {
              const newEvents = [...prev, {
                id: `stability_${Date.now()}`,
                type: 'trade_deal',
                title: `Stable Relations with ${targetRegion.name}`,
                description: `Maintaining current trade relations provides market stability`,
                regionId: targetRegionId,
                sectorImpacts: {
                  technology: 2,
                  manufacturing: 2,
                  services: 1
                },
                timeLimit: 2
              }];
              console.log('Active trade events:', newEvents);
              return newEvents;
            });
          }

          // Update region with all changes
          const updatedRegion = {
            ...region,
            relationships: updatedRelationships,
            economicStats: {
              ...region.economicStats,
              tradeBalance: region.economicStats.tradeBalance + tradeBalanceChange,
              marketHealth: Math.max(0, Math.min(100, 
                region.economicStats.marketHealth + 
                (action === 'restrict' ? -3 : 
                 action === 'improve' ? 2 : 
                 0) // neutral
              ))
            },
            sectors: Object.entries(region.sectors).reduce((acc, [key, sector]) => ({
              ...acc,
              [key]: {
                ...sector,
                performance: Math.max(40, Math.min(160, 
                  sector.performance * (1 + (sectorImpacts[key] || 0) / 100)
                ))
              }
            }), {} as typeof region.sectors)
          };

          console.log('Updated region:', updatedRegion);
          return updatedRegion;
        }
        return region;
      });
    });
  };
  
  // Modify the renderGamePlay function to include interactive action panels
  const renderGamePlay = () => {
    if (!playerRegion) return null;

    // Determine which panel to show based on completed actions
    const showSectorPanel = !selectedSectorFocus;
    const showPolicyPanel = selectedSectorFocus && !selectedPolicy;
    const showTradePanel = selectedSectorFocus && selectedPolicy;
    
    return (
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        <GameHeader
          title="Macro Mastermind"
          description={`Turn ${gameTurn}/20 - ${playerRegion.name}`}
          icon={<Globe className="h-6 w-6" />}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* World Map */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Global Overview</span>
                  <span className="text-sm font-normal text-muted-foreground">Turn {gameTurn}/20</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <WorldMap />
              </CardContent>
            </Card>
            
            {/* Step 1: Sector Focus */}
            {showSectorPanel && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Step 1: Choose Sector Focus</CardTitle>
                  <CardDescription>Select one sector to prioritize this turn</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(playerRegion.sectors).map(([sectorId, sector]) => {
                      const Icon = INITIAL_SECTORS[sectorId].icon;
                      return (
                        <div 
                          key={sectorId} 
                          className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200 hover:shadow-md"
                          onClick={() => handleSectorFocus(sectorId as keyof Region['sectors'], 'medium')}
                        >
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="flex-shrink-0">
                              <Icon className="w-6 h-6" style={{ 
                                color: sectorId === 'technology' ? '#3B82F6' : // blue
                                       sectorId === 'manufacturing' ? '#EAB308' : // yellow
                                       sectorId === 'services' ? '#22C55E' : // green
                                       sectorId === 'energy' ? '#F97316' : // orange
                                       '#A855F7' // purple for finance
                              }} />
                            </div>
                            <div className="flex-grow">
                              <div className="flex justify-between items-center">
                                <span className="font-medium">{sector.name}</span>
                                <span className={`text-sm font-semibold ${
                                  sector.performance > 100 ? 'text-green-500' :
                                  sector.performance < 90 ? 'text-red-500' :
                                  'text-yellow-500'
                                }`}>
                                  {Math.round(sector.performance)}%
                                  {sector.trend > 0 && <TbTrendingUp className="inline-block ml-1 h-3 w-3" />}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Progress value={sector.performance} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Step 2: Economic Policy */}
            {showPolicyPanel && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Step 2: Set Economic Policy</CardTitle>
                  <CardDescription>Choose your economic approach</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div 
                      className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200 hover:shadow-md"
                      onClick={() => {
                        handlePolicyTypeSelect('expansionary');
                        handlePolicyFocusSelect('balanced');
                      }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Rocket className="w-5 h-5 text-blue-500" />
                        <h3 className="font-medium">Growth Focus</h3>
                      </div>
                      <p className="text-sm text-gray-600">Boost market growth but risk trade balance</p>
                    </div>
                    <div 
                      className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200 hover:shadow-md"
                      onClick={() => {
                        handlePolicyTypeSelect('neutral');
                        handlePolicyFocusSelect('balanced');
                      }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Scale className="w-5 h-5 text-amber-500" />
                        <h3 className="font-medium">Balanced Approach</h3>
                      </div>
                      <p className="text-sm text-gray-600">Maintain steady growth with minimal risks</p>
                    </div>
                    <div 
                      className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200 hover:shadow-md"
                      onClick={() => {
                        handlePolicyTypeSelect('contractionary');
                        handlePolicyFocusSelect('balanced');
                      }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Shield className="w-5 h-5 text-green-500" />
                        <h3 className="font-medium">Stability Focus</h3>
                      </div>
                      <p className="text-sm text-gray-600">Improve trade balance but slow growth</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Stats and Trade Panel */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Region Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-500" />
                    Market Health
                  </div>
                  <div className="flex items-center">
                    <Progress value={playerRegion.economicStats.marketHealth} className="h-2 flex-grow" />
                    <span className="ml-2 text-sm font-medium">{Math.round(playerRegion.economicStats.marketHealth)}</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    Trade Balance
                  </div>
                  <div className="flex items-center">
                    <span className={`text-sm font-medium ${
                      playerRegion.economicStats.tradeBalance > 0 ? 'text-green-500' :
                      playerRegion.economicStats.tradeBalance < 0 ? 'text-red-500' :
                      'text-yellow-500'
                    }`}>
                      {playerRegion.economicStats.tradeBalance > 0 ? '+' : ''}
                      {Math.round(playerRegion.economicStats.tradeBalance)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 3: Trade Relations */}
            {showTradePanel && <TradePolicyPanel region={playerRegion} />}

            {/* End Turn Button */}
            {showTradePanel && (
              <div className="mt-4">
                <Button
                  className="w-full"
                  onClick={advanceTurn}
                  disabled={pendingActions.length > 0}
                >
                  {pendingActions.length > 0 
                    ? `Complete ${pendingActions.length} Actions to End Turn` 
                    : `End Turn ${gameTurn}/20`}
                </Button>
                {pendingActions.length > 0 && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    Remaining actions: {pendingActions.join(', ')}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  // Game over screen
  const renderGameOver = () => {
    // Calculate final score
    const finalScore = playerRegion ? Math.floor(
      (playerRegion.economicStats.marketHealth + 
       playerRegion.economicStats.gdp + 
       playerRegion.economicStats.politicalStability +
       Object.values(playerRegion.sectors).reduce((sum, sector) => sum + sector.performance, 0) / 5 +
       Object.values(playerRegion.relationships).reduce((sum, val) => sum + val, 0) / 4) / 3
    ) : 0;
    
    // Calculate tickets earned (1 per 50 points)
    const ticketsEarned = Math.floor(finalScore / 50);
    
    return (
      <GameOver
        score={finalScore}
        message={`You completed ${gameTurn} turns as leader of ${playerRegion?.name}!`}
        tickets={ticketsEarned}
        onPlayAgain={restartGame}
        onReturnToHub={returnToHub}
      />
    );
  };
  
  // Add new function to handle AI region decisions
  const simulateAIRegionDecisions = () => {
    if (!playerRegion) return;
    
    setRegions(prevRegions => {
      return prevRegions.map(region => {
        if (region.id === playerRegion.id) return region;
        
        // AI regions make decisions based on their current state
        const relationship = region.relationships[playerRegion.id] || 50;
        const marketHealth = region.economicStats.marketHealth;
        const tradeBalance = region.economicStats.tradeBalance;
        
        // Chance for AI action increases if relations are poor or economy is struggling
        const actionChance = Math.random() * 100;
        
        if (relationship < 40 && actionChance < 40) { // 40% chance if relations are poor
          // Create trade restriction event
          const newEvent: InternationalEvent = {
            id: `trade_restriction_${Date.now()}_${region.id}`,
            sourceRegion: region.id,
            title: `${region.name} Trade Restrictions`,
            description: `Due to deteriorating relations, ${region.name} has imposed new trade barriers.`,
            severity: Math.floor((50 - relationship) / 10),
            type: 'trade',
            affectedSectors: ['manufacturing', 'technology'],
            timeToRespond: 2,
            impactDelay: 1,
            potentialImpact: {
              market: -5,
              diplomatic: { [region.id]: -10 },
              sectors: {
                manufacturing: -3,
                technology: -2,
                services: -1
              }
            },
            policyResponses: [
              {
                id: 'counter_tariffs',
                title: 'Impose Counter-Tariffs',
                description: 'Respond with similar trade restrictions',
                cost: 100,
                effects: {
                  domesticMarket: -3,
                  internationalRelations: { [region.id]: -15 },
                  politicalStability: -5,
                  economicImpact: {
                    gdp: -2,
                    marketHealth: -3,
                    tradeBalance: -5
                  },
                  sectorImpacts: {
                    manufacturing: -4,
                    technology: -3
                  }
                }
              },
              {
                id: 'negotiate',
                title: 'Diplomatic Negotiations',
                description: 'Attempt to negotiate removal of restrictions',
                cost: 50,
                effects: {
                  domesticMarket: 1,
                  internationalRelations: { [region.id]: 10 },
                  politicalStability: 2,
                  economicImpact: {
                    gdp: 1,
                    marketHealth: 2,
                    tradeBalance: 3
                  },
                  sectorImpacts: {
                    manufacturing: 2,
                    technology: 1
                  }
                }
              }
            ]
          };
          
          setActiveEvents(prev => [...prev, newEvent]);
        } else if (marketHealth < 60 && actionChance < 30) { // 30% chance if economy is struggling
          // Create economic cooperation event
          const newEvent: InternationalEvent = {
            id: `economic_cooperation_${Date.now()}_${region.id}`,
            sourceRegion: region.id,
            title: `${region.name} Proposes Economic Partnership`,
            description: `${region.name} seeks closer economic ties to boost both economies.`,
            severity: 5,
            type: 'economic',
            affectedSectors: ['finance', 'services'],
            timeToRespond: 2,
            impactDelay: 1,
            potentialImpact: {
              market: 5,
              diplomatic: { [region.id]: 10 },
              sectors: {
                finance: 4,
                services: 3,
                technology: 2
              }
            },
            policyResponses: [
              {
                id: 'accept_partnership',
                title: 'Accept Partnership',
                description: 'Form closer economic ties',
                cost: 75,
                effects: {
                  domesticMarket: 4,
                  internationalRelations: { [region.id]: 15 },
                  politicalStability: 2,
                  economicImpact: {
                    gdp: 3,
                    marketHealth: 4,
                    tradeBalance: 2
                  },
                  sectorImpacts: {
                    finance: 5,
                    services: 4
                  }
                }
              },
              {
                id: 'decline_partnership',
                title: 'Maintain Independence',
                description: 'Decline the partnership to maintain economic autonomy',
                cost: 0,
                effects: {
                  domesticMarket: -1,
                  internationalRelations: { [region.id]: -5 },
                  politicalStability: 0,
                  economicImpact: {
                    gdp: -1,
                    marketHealth: -2,
                    tradeBalance: 0
                  },
                  sectorImpacts: {
                    finance: -2,
                    services: -1
                  }
                }
              }
            ]
          };
          
          setActiveEvents(prev => [...prev, newEvent]);
        }
        
        return region;
      });
    });
    
    // Chance for global events
    if (Math.random() < 0.15) { // 15% chance each turn
      const globalEvent = GLOBAL_EVENTS[Math.floor(Math.random() * GLOBAL_EVENTS.length)];
      setActiveEvents(prev => [...prev, {...globalEvent, id: `${globalEvent.id}_${Date.now()}`}]);
    }
  };
  
  // Add new action handlers
  const handleSectorFocus = (sector: keyof Region['sectors'], intensity: 'low' | 'medium' | 'high') => {
    setSelectedSectorFocus({
      sector,
      intensity,
      description: `Focusing on ${sector} sector with ${intensity} intensity`
    });
    
    // Mark sector focus action as complete
    completeAction('Choose a sector to focus on');
    
    // Apply immediate effects based on focus intensity
    if (!playerRegion) return;
    
    const intensityMultiplier = { low: 1, medium: 2, high: 3 };
    
    setRegions(prevRegions => {
      return prevRegions.map(region => {
        if (region.id === playerRegion.id) {
          const updatedSectors = { ...region.sectors };
          
          // Boost focused sector
          updatedSectors[sector] = {
            ...updatedSectors[sector],
            performance: Math.min(160, updatedSectors[sector].performance * (1 + 0.05 * intensityMultiplier[intensity])),
            trend: updatedSectors[sector].trend + 0.02 * intensityMultiplier[intensity]
          };
          
          // Other sectors might suffer slightly
          Object.keys(updatedSectors).forEach(otherId => {
            if (otherId !== sector) {
              updatedSectors[otherId as keyof Region['sectors']] = {
                ...updatedSectors[otherId as keyof Region['sectors']],
                performance: Math.max(40, updatedSectors[otherId as keyof Region['sectors']].performance * (1 - 0.02 * intensityMultiplier[intensity]))
              };
            }
          });
          
          return {
            ...region,
            sectors: updatedSectors
          };
        }
        return region;
      });
    });
  };

  const handlePolicyTypeSelect = (type: EconomicPolicy['type']) => {
    if (!selectedPolicy) {
      setSelectedPolicy({ type, focus: 'balanced', description: '' });
      // Apply policy immediately with balanced focus
      applyEconomicPolicy({ type, focus: 'balanced', description: '' });
    } else {
      setSelectedPolicy({ ...selectedPolicy, type });
      // Apply policy if we now have both type and focus
      if (selectedPolicy.focus) {
        applyEconomicPolicy({ ...selectedPolicy, type });
      }
    }
  };

  const handlePolicyFocusSelect = (focus: EconomicPolicy['focus']) => {
    if (!selectedPolicy) {
      setSelectedPolicy({ type: 'neutral', focus, description: '' });
      // Apply policy immediately with neutral type
      applyEconomicPolicy({ type: 'neutral', focus, description: '' });
    } else {
      setSelectedPolicy({ ...selectedPolicy, focus });
      // Apply policy if we now have both type and focus
      if (selectedPolicy.type) {
        applyEconomicPolicy({ ...selectedPolicy, focus });
      }
    }
  };

  const applyEconomicPolicy = (policy: EconomicPolicy) => {
    if (!playerRegion) return;
    
    setRegions(prevRegions => {
      return prevRegions.map(region => {
        if (region.id === playerRegion.id) {
          const effects = calculatePolicyEffects(policy);
          
          return {
            ...region,
            economicStats: {
              ...region.economicStats,
              marketHealth: Math.min(100, Math.max(0, region.economicStats.marketHealth + effects.marketHealth)),
              tradeBalance: region.economicStats.tradeBalance + effects.tradeBalance
            },
            sectors: Object.entries(region.sectors).reduce((acc, [key, sector]) => ({
              ...acc,
              [key]: {
                ...sector,
                performance: Math.min(160, Math.max(40, sector.performance * (1 + effects.sectorMultiplier)))
              }
            }), {} as Region['sectors'])
          };
        }
        return region;
      });
    });
    
    // Mark economic policy action as complete
    completeAction('Set economic policy');
    
    // Log for debugging
    console.log('Economic policy applied:', policy);
    console.log('Remaining actions:', pendingActions);
  };

  const calculatePolicyEffects = (policy: EconomicPolicy) => {
    const baseEffects = {
      expansionary: { marketHealth: 5, tradeBalance: -2, sectorMultiplier: 0.05 },
      contractionary: { marketHealth: -3, tradeBalance: 3, sectorMultiplier: -0.03 },
      neutral: { marketHealth: 1, tradeBalance: 0, sectorMultiplier: 0.01 }
    };
    
    const focusMultipliers = {
      domestic: { marketHealth: 1.2, tradeBalance: 0.5, sectorMultiplier: 1.2 },
      international: { marketHealth: 0.8, tradeBalance: 1.5, sectorMultiplier: 0.8 },
      balanced: { marketHealth: 1, tradeBalance: 1, sectorMultiplier: 1 }
    };
    
    const base = baseEffects[policy.type];
    const multipliers = focusMultipliers[policy.focus];
    
    return {
      marketHealth: base.marketHealth * multipliers.marketHealth,
      tradeBalance: base.tradeBalance * multipliers.tradeBalance,
      sectorMultiplier: base.sectorMultiplier * multipliers.sectorMultiplier
    };
  };

  const canCompleteAction = (action: string) => {
    switch (action) {
      case 'Choose a sector to focus on':
        return selectedSectorFocus !== null;
      case 'Set economic policy':
        return selectedPolicy !== null && selectedPolicy.type && selectedPolicy.focus;
      case 'Review trade relations':
        return true; // This is handled by the trade policy panel
      default:
        return false;
    }
  };
  
  // Main render
  console.log('Rendering with phase:', gamePhase, 'mode:', gameMode, 'tutorial:', showTutorial);
  
  // Add a function to check if we can end the turn
  const canEndTurn = () => {
    return pendingActions.length === 0;
  };
  
  return (
    <div className="w-full min-h-screen bg-background">
      {gamePhase === 'selection' && (
        <>
          {showTutorial && renderTutorial()}
          {renderGameModeSelection()}
        </>
      )}
      
      {gamePhase === 'region-selection' && (
        <>
          {showTutorial && renderTutorial()}
          {renderRegionSelection()}
        </>
      )}
      
      {gamePhase === 'playing' && (
        <>
          {showTutorial && renderTutorial()}
          {gameMode === 'cards' ? <FinancialCardGame /> : renderGamePlay()}
        </>
      )}
      
      {gamePhase === 'ended' && renderGameOver()}
      
      {!['selection', 'region-selection', 'playing', 'ended'].includes(gamePhase) && (
        <div className="flex items-center justify-center h-screen">
          <Card className="w-[400px]">
            <CardHeader>
              <CardTitle>Welcome to Macro Mastermind</CardTitle>
              <CardDescription>Choose your game mode to begin</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                onClick={() => setGamePhase('selection')}
              >
                Start Game
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}