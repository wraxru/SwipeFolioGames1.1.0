import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Globe, TrendingUp, AlertTriangle, DollarSign, ArrowLeft, Briefcase, LineChart, Scale, X, CreditCard, Users } from 'lucide-react';
import { Tooltip } from "@/components/ui/tooltip";

interface MarketSector {
  id: string;
  name: string;
  performance: number;
  volatility: number;
  trend: number;
  history: { timestamp: number; value: number }[];
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
    [sectorId: string]: number;
    interestRate?: number;
    tradeBalance?: number;
    marketHealth?: number;
  };
  longTermEffects: {
    description: string;
    duration: number;
    sectorEffects: { [sectorId: string]: number };
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

// Initial market sectors configuration
const INITIAL_SECTORS: { [key: string]: MarketSector } = {
  technology: {
    id: 'tech',
    name: 'Technology',
    performance: 100,
    volatility: 0.8,
    trend: 0.1,
    history: []
  },
  manufacturing: {
    id: 'mfg',
    name: 'Manufacturing',
    performance: 100,
    volatility: 0.5,
    trend: 0.05,
    history: []
  },
  services: {
    id: 'srv',
    name: 'Services',
    performance: 100,
    volatility: 0.3,
    trend: 0.03,
    history: []
  },
  energy: {
    id: 'nrg',
    name: 'Energy',
    performance: 100,
    volatility: 0.6,
    trend: 0.02,
    history: []
  },
  finance: {
    id: 'fin',
    name: 'Finance',
    performance: 100,
    volatility: 0.7,
    trend: 0.04,
    history: []
  }
};

// Updated world regions with sector-based configuration
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

export default function StockMarketStrategist() {
  const [gamePhase, setGamePhase] = useState<'selection' | 'tutorial' | 'playing'>('selection');
  const [playerRegion, setPlayerRegion] = useState<Region | null>(null);
  const [regions, setRegions] = useState<Region[]>(WORLD_REGIONS);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [activeEvents, setActiveEvents] = useState<InternationalEvent[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    turn: 1,
    availableFunds: 1000,
    overallMarketHealth: 100,
    eventHistory: [],
    activeEvents: [],
    difficulty: 'medium',
    tutorialCompleted: false,
    achievements: []
  });
  const [showTutorial, setShowTutorial] = useState(false);
  const [gameSpeed, setGameSpeed] = useState<'Slow' | 'Normal' | 'Fast'>('Normal');

  // Generate international events
  const generateInternationalEvents = () => {
    const otherRegions = regions.filter(r => r.id !== playerRegion?.id);
    const sourceRegion = otherRegions[Math.floor(Math.random() * otherRegions.length)];
    
    const eventTypes: InternationalEvent[] = [
      {
        id: `evt_${Date.now()}`,
        sourceRegion: sourceRegion.id,
        title: 'Trade Tariffs Imposed',
        description: `${sourceRegion.name} has imposed new trade tariffs on key exports`,
        severity: 0.7,
        type: 'trade',
        affectedSectors: ['manufacturing', 'technology'],
        timeToRespond: 30,
        impactDelay: 2,
        policyResponses: [
          {
            id: 'negotiate',
            title: 'Diplomatic Negotiation',
            description: 'Engage in diplomatic talks to reduce tariffs',
            cost: 200,
            effects: {
              domesticMarket: -2,
              internationalRelations: { [sourceRegion.id]: 10 },
              politicalStability: 5,
              economicImpact: {
                gdp: -1,
                marketHealth: 2,
                tradeBalance: 5
              },
              sectorImpacts: {
                manufacturing: 3,
                technology: 2
              }
            }
          },
          {
            id: 'retaliate',
            title: 'Retaliatory Tariffs',
            description: 'Impose counter-tariffs on their goods',
            cost: 150,
            effects: {
              domesticMarket: 5,
              internationalRelations: { [sourceRegion.id]: -15 },
              politicalStability: -5,
              economicImpact: {
                gdp: -2,
                marketHealth: -3,
                tradeBalance: -3
              },
              sectorImpacts: {
                manufacturing: -2,
                technology: -2
              }
            }
          },
          {
            id: 'subsidize',
            title: 'Industry Subsidies',
            description: 'Provide subsidies to affected industries',
            cost: 300,
            effects: {
              domesticMarket: 8,
              internationalRelations: { [sourceRegion.id]: 0 },
              politicalStability: 3,
              economicImpact: {
                gdp: 2,
                marketHealth: 4,
                tradeBalance: -2
              },
              sectorImpacts: {
                manufacturing: 5,
                technology: 4
              }
            }
          }
        ],
        potentialImpact: {
          market: -10,
          diplomatic: { [sourceRegion.id]: -5 },
          sectors: {
            manufacturing: -8,
            technology: -6
          }
        }
      }
      // Add more event types here
    ];

    return eventTypes[Math.floor(Math.random() * eventTypes.length)];
  };

  // Handle policy response selection
  const handlePolicyResponse = (event: InternationalEvent, policy: PolicyResponse) => {
    if (!playerRegion || gameState.availableFunds < policy.cost) return;

    // Apply policy effects
    setRegions(prevRegions => {
      const updatedRegions = [...prevRegions];
      const playerIndex = updatedRegions.findIndex(r => r.id === playerRegion.id);
      
      if (playerIndex === -1) return prevRegions;

      // Update player region
      const updatedPlayerRegion = { ...playerRegion };
      
      // Apply sector impacts
      Object.entries(policy.effects.sectorImpacts).forEach(([sectorId, impact]) => {
        if (sectorId in updatedPlayerRegion.sectors) {
          const sector = updatedPlayerRegion.sectors[sectorId as keyof Region['sectors']];
          sector.performance *= (1 + impact / 100);
          sector.trend += impact / 1000;
        }
      });

      // Apply economic impacts
      updatedPlayerRegion.economicStats = {
        ...updatedPlayerRegion.economicStats,
        gdp: updatedPlayerRegion.economicStats.gdp + policy.effects.economicImpact.gdp,
        marketHealth: updatedPlayerRegion.economicStats.marketHealth + policy.effects.economicImpact.marketHealth,
        tradeBalance: updatedPlayerRegion.economicStats.tradeBalance + policy.effects.economicImpact.tradeBalance,
        politicalStability: updatedPlayerRegion.economicStats.politicalStability + policy.effects.politicalStability
      };

      // Update relationships with other regions
      Object.entries(policy.effects.internationalRelations).forEach(([regionId, change]) => {
        updatedPlayerRegion.relationships[regionId] += change;
      });

      updatedRegions[playerIndex] = updatedPlayerRegion;

      return updatedRegions;
    });

    // Update game state
    setGameState(prev => ({
      ...prev,
      availableFunds: prev.availableFunds - policy.cost,
      turn: prev.turn + 1
    }));

    // Remove the event
    setActiveEvents(prev => prev.filter(e => e.id !== event.id));
  };

  // Market simulation function
  const simulateMarketMovements = () => {
    if (!playerRegion) return;

    setRegions(prevRegions => {
      return prevRegions.map(region => {
        // Only simulate detailed movements for player's region
        if (region.id === playerRegion.id) {
          const updatedSectors = Object.entries(region.sectors).reduce((acc, [key, sector]) => {
            // Calculate random market movement
            const volatilityFactor = sector.volatility * (Math.random() - 0.5) * 2;
            const trendFactor = sector.trend;
            const eventImpact = activeEvents
              .filter(event => event.sourceRegion !== region.id)
              .reduce((sum, event) => sum + (event.potentialImpact.sectors[key] || 0) / 100, 0);

            // Update performance with bounds
            let newPerformance = sector.performance * (1 + (volatilityFactor + trendFactor + eventImpact) / 100);
            newPerformance = Math.max(40, Math.min(160, newPerformance)); // Keep between 40% and 160%

            // Update trend
            let newTrend = sector.trend + (volatilityFactor / 50);
            newTrend = Math.max(-0.2, Math.min(0.2, newTrend)); // Keep trend between -20% and +20%

            // Update history
            const newHistory = [...sector.history, { timestamp: Date.now(), value: newPerformance }];
            if (newHistory.length > 50) newHistory.shift(); // Keep last 50 data points

            return {
              ...acc,
              [key]: {
                ...sector,
                performance: newPerformance,
                trend: newTrend,
                history: newHistory
              }
            };
          }, {});

          // Update economic stats
          const avgPerformance = Object.values(updatedSectors).reduce((sum, sector) => sum + sector.performance, 0) / 5;
          const updatedStats = {
            ...region.economicStats,
            marketHealth: Math.min(100, Math.max(0, avgPerformance * 0.8 + region.economicStats.marketHealth * 0.2)),
            gdp: Math.min(100, Math.max(0, avgPerformance * 0.6 + region.economicStats.gdp * 0.4)),
            politicalStability: Math.min(100, Math.max(0, region.economicStats.politicalStability * 0.95 + Math.random() * 5))
          };

          return {
            ...region,
            sectors: updatedSectors as typeof region.sectors,
            economicStats: updatedStats
          };
        }

        // Simple simulation for non-player regions
        return {
          ...region,
          economicStats: {
            ...region.economicStats,
            marketHealth: Math.min(100, Math.max(0, region.economicStats.marketHealth + (Math.random() - 0.5) * 2)),
            gdp: Math.min(100, Math.max(0, region.economicStats.gdp + (Math.random() - 0.5))),
            politicalStability: Math.min(100, Math.max(0, region.economicStats.politicalStability * 0.98 + Math.random() * 2))
          }
        };
      });
    });

    // Update overall game state
    setGameState(prev => ({
      ...prev,
      overallMarketHealth: Math.min(100, Math.max(0, prev.overallMarketHealth + (Math.random() - 0.5) * 2)),
      availableFunds: prev.availableFunds + (playerRegion.economicStats.marketHealth / 100) * 5 // Generate income based on market health
    }));
  };

  // Render region selection screen
  const renderRegionSelection = () => (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900/90 to-black/90 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-[900px] max-h-[85vh] overflow-y-auto bg-white/95 backdrop-blur">
        <CardHeader className="text-center border-b p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-3xl font-bold">Choose Your Region</CardTitle>
          <CardDescription className="text-sm sm:text-lg">
            Select a region to lead and shape its economic future through global events
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {regions.map(region => (
              <Button
                key={region.id}
                variant="outline"
                className={`relative p-4 sm:p-6 h-auto border-2 transition-all hover:scale-[1.02] hover:shadow-lg ${
                  playerRegion?.id === region.id 
                    ? 'border-blue-500 bg-blue-50/50' 
                    : 'border-gray-200 hover:border-blue-200'
                }`}
                onClick={() => setPlayerRegion(region)}
              >
                <div className="text-left w-full">
                  <div className="flex justify-between items-start mb-3 sm:mb-4">
                    <h3 className="text-lg sm:text-2xl font-bold">{region.name}</h3>
                    {playerRegion?.id === region.id && (
                      <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        Selected
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-3 sm:mb-4">
                    <div className="bg-white/80 p-2 sm:p-3 rounded-lg shadow-sm">
                      <div className="text-xs sm:text-sm text-gray-500">GDP</div>
                      <div className="text-base sm:text-xl font-semibold">{region.economicStats.gdp}%</div>
                    </div>
                    <div className="bg-white/80 p-2 sm:p-3 rounded-lg shadow-sm">
                      <div className="text-xs sm:text-sm text-gray-500">Market Health</div>
                      <div className="text-base sm:text-xl font-semibold">{region.economicStats.marketHealth}%</div>
                    </div>
                    <div className="bg-white/80 p-2 sm:p-3 rounded-lg shadow-sm">
                      <div className="text-xs sm:text-sm text-gray-500">Political Stability</div>
                      <div className="text-base sm:text-xl font-semibold">{region.economicStats.politicalStability}%</div>
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <div className="text-xs sm:text-sm font-medium text-gray-600 mb-1 sm:mb-2">Market Sectors</div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {Object.entries(region.sectors).map(([key, sector]) => {
                        const performance = sector.performance;
                        const getStatusColor = (perf: number) => {
                          if (perf >= 105) return 'bg-green-100 text-green-700 border-green-200';
                          if (perf >= 95) return 'bg-blue-50 text-blue-700 border-blue-200';
                          if (perf >= 85) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
                          return 'bg-red-100 text-red-700 border-red-200';
                        };
                        
                        return (
                          <div
                            key={key}
                            className={`px-2 sm:px-3 py-1 sm:py-2 rounded-lg border ${getStatusColor(performance)} flex flex-col`}
                          >
                            <span className="text-[10px] sm:text-xs font-medium">{sector.name}</span>
                            <span className="text-xs sm:text-sm font-bold">{performance.toFixed(0)}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </Button>
            ))}
          </div>

          <div className="mt-6 sm:mt-8 text-center">
            <Button
              size="lg"
              className={`w-full sm:w-1/2 h-10 sm:h-12 text-base sm:text-lg font-semibold transition-all ${
                playerRegion 
                  ? 'bg-blue-500 hover:bg-blue-600' 
                  : 'bg-gray-200 cursor-not-allowed'
              }`}
              disabled={!playerRegion}
              onClick={() => {
                setGamePhase('tutorial');
                setShowTutorial(true);
              }}
            >
              {playerRegion 
                ? `Lead ${playerRegion.name} to Prosperity` 
                : 'Select a Region to Begin'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Render active international events
  const renderInternationalEvents = () => (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">International Events</h3>
      <div className="space-y-4">
        {activeEvents.map(event => (
          <Card key={event.id} className="border-orange-200">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-orange-700">{event.title}</CardTitle>
                  <CardDescription>{event.description}</CardDescription>
                </div>
                <div className="text-sm">
                  <div className="text-orange-600">Severity: {event.severity * 100}%</div>
                  <div className="text-gray-500">Time to Respond: {event.timeToRespond}s</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Potential Impact</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="p-2 bg-red-50 rounded">
                      <span className="text-red-600">Market Impact: </span>
                      <span>{event.potentialImpact.market}%</span>
                    </div>
                    {Object.entries(event.potentialImpact.sectors).map(([sector, impact]) => (
                      <div key={sector} className="p-2 bg-orange-50 rounded">
                        <span className="text-orange-600">{sector}: </span>
                        <span>{impact}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Available Responses</h4>
                  <div className="space-y-2">
                    {event.policyResponses.map(policy => (
                      <Button
                        key={policy.id}
                        variant="outline"
                        className="w-full text-left h-auto p-3"
                        disabled={gameState.availableFunds < policy.cost}
                        onClick={() => handlePolicyResponse(event, policy)}
                      >
                        <div>
                          <div className="flex justify-between items-start">
                            <span className="font-medium">{policy.title}</span>
                            <span className="text-sm text-green-600">Cost: ${policy.cost}M</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{policy.description}</p>
                          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                            {Object.entries(policy.effects.sectorImpacts).map(([sector, impact]) => (
                              <div
                                key={sector}
                                className={`px-2 py-1 rounded ${
                                  impact > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}
                              >
                                {sector}: {impact > 0 ? '+' : ''}{impact}%
                              </div>
                            ))}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // Market simulation interval
  useEffect(() => {
    if (gamePhase !== 'playing' || !playerRegion) return;

    const simulationInterval = setInterval(() => {
      simulateMarketMovements();
      
      // Random chance to generate new international event
      if (Math.random() < 0.2) { // 20% chance each interval
        const newEvent = generateInternationalEvents();
        setActiveEvents(prev => [...prev, newEvent]);
      }
    }, 10000);

    return () => clearInterval(simulationInterval);
  }, [gamePhase, playerRegion]);

  return (
    <div className="h-[calc(100vh-8rem)] overflow-y-auto">
      {/* Region Selection Screen */}
      {gamePhase === 'selection' && renderRegionSelection()}

      {/* Tutorial Overlay */}
      <AnimatePresence>
        {showTutorial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          >
            <Card className="w-[600px] max-h-[80vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Welcome to Regional Stock Market Strategist</CardTitle>
                <CardDescription>
                  Lead {playerRegion?.name}'s market through global political events
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Game Overview:</h3>
                  <p>As the leader of {playerRegion?.name}, you'll need to:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Monitor your market sectors and economic health</li>
                    <li>Respond to international political events</li>
                    <li>Manage relationships with other regions</li>
                    <li>Balance domestic stability with international trade</li>
                  </ul>
                </div>
                <Button 
                  className="w-full"
                  onClick={() => {
                    setShowTutorial(false);
                    setGamePhase('playing');
                  }}
                >
                  Start Leading {playerRegion?.name}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Game Content */}
      {gamePhase === 'playing' && (
        <div className="container mx-auto p-4">
          {/* Game controls */}
          <div className="bg-white mb-4 py-2 sm:py-3 border rounded-lg shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 px-3 sm:px-4">
              <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                <Button variant="outline" onClick={() => setShowTutorial(true)} className="text-sm sm:text-base w-full sm:w-auto">
                  Tutorial
                </Button>
                <Button variant="outline" onClick={() => {
                  const speeds = { 'Slow': 'Normal', 'Normal': 'Fast', 'Fast': 'Slow' };
                  setGameSpeed(speeds[gameSpeed]);
                }} className="text-sm sm:text-base w-full sm:w-auto">
                  Speed: {gameSpeed}
                </Button>
              </div>
              <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-between sm:justify-start">
                <div className="flex items-center gap-1 sm:gap-2">
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                  <span className="text-sm sm:text-base font-semibold">${gameState.availableFunds}M</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <Scale className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                  <span className="text-sm sm:text-base font-semibold">{gameState.overallMarketHealth}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left Column - World Map and Key Metrics */}
            <div className="lg:col-span-8">
              <Card className="h-[400px] sm:h-[600px]">
                <CardHeader className="border-b pb-2 sm:pb-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <Globe className="w-5 h-5 sm:w-6 sm:h-6" />
                      Global Market Overview
                    </CardTitle>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button variant="outline" size="sm" className="flex-1 sm:flex-none text-xs sm:text-sm">
                        <LineChart className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        Market Data
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 sm:flex-none text-xs sm:text-sm">
                        <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        Relations
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative h-[calc(100%-4rem)]">
                  {/* Interactive World Map */}
                  <div className="absolute inset-0 p-2 sm:p-4">
                    <svg 
                      viewBox="0 0 800 400" 
                      className="w-full h-full"
                      style={{ background: 'rgb(241 245 249)' }}
                    >
                      {/* Region Connections */}
                      {regions.map(region => 
                        Object.entries(region.relationships).map(([targetId, strength]) => {
                          const targetRegion = regions.find(r => r.id === targetId);
                          if (!targetRegion || region.id !== playerRegion?.id) return null;
                          
                          return (
                            <motion.line
                              key={`${region.id}-${targetId}`}
                              x1={region.center.x}
                              y1={region.center.y}
                              x2={targetRegion.center.x}
                              y2={targetRegion.center.y}
                              stroke={`rgba(59, 130, 246, ${strength / 100})`}
                              strokeWidth="2"
                              strokeDasharray="4"
                            />
                          );
                        })
                      )}

                      {/* Regions */}
                      {regions.map(region => {
                        const isPlayer = region.id === playerRegion?.id;
                        const hasActiveEvent = activeEvents.some(e => e.sourceRegion === region.id);
                        
                        return (
                          <g key={region.id}>
                            <motion.path
                              d={region.path}
                              fill={hasActiveEvent ? '#fecaca' : isPlayer ? '#bfdbfe' : '#e2e8f0'}
                              stroke={isPlayer ? '#2563eb' : '#64748b'}
                              strokeWidth={isPlayer ? "3" : "1.5"}
                              whileHover={{ scale: 1.02 }}
                              className="cursor-pointer transition-colors"
                              onClick={() => setSelectedRegion(region)}
                            />
                            <text
                              x={region.center.x}
                              y={region.center.y}
                              textAnchor="middle"
                              className={`text-[10px] sm:text-sm font-medium ${
                                isPlayer ? 'fill-blue-900' : 'fill-gray-700'
                              }`}
                            >
                              {region.name}
                            </text>
                            {hasActiveEvent && (
                              <motion.circle
                                cx={region.center.x + 30}
                                cy={region.center.y - 20}
                                r="6"
                                fill="#ef4444"
                                initial={{ scale: 0 }}
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                              />
                            )}
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </CardContent>
              </Card>

              {/* Region Details Panel */}
              {selectedRegion && (
                <Card className="mt-4">
                  <CardHeader className="pb-2 sm:pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base sm:text-lg">{selectedRegion.name}</CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                          {selectedRegion.id === playerRegion?.id 
                            ? 'Your Region' 
                            : `Relationship: ${playerRegion?.relationships[selectedRegion.id] || 0}%`
                          }
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setSelectedRegion(null)}>
                        <X className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4">
                      {Object.entries(selectedRegion.sectors).map(([key, sector]) => (
                        <div key={key} className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                          <div className="text-xs sm:text-sm font-medium text-gray-600">{sector.name}</div>
                          <div className="text-base sm:text-xl font-bold mt-1">
                            {sector.performance.toFixed(1)}
                            <span className={`text-xs sm:text-sm ml-1 ${
                              sector.trend > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {sector.trend > 0 ? '↑' : '↓'}
                              {Math.abs(sector.trend * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Events and Actions */}
            <div className="lg:col-span-4 space-y-4">
              {/* Active Events */}
              <Card>
                <CardHeader className="pb-2 sm:pb-3">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                    Active Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4">
                    {activeEvents.length === 0 ? (
                      <div className="text-center py-6 sm:py-8 text-sm sm:text-base text-gray-500">
                        No active events at the moment
                      </div>
                    ) : (
                      activeEvents.map(event => (
                        <Card key={event.id} className="border-orange-200">
                          <CardHeader className="p-3 sm:p-4 pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-sm sm:text-base text-orange-700">
                                  {event.title}
                                </CardTitle>
                                <CardDescription className="text-xs sm:text-sm">
                                  {event.description}
                                </CardDescription>
                              </div>
                              <div className="text-xs sm:text-sm text-orange-600">
                                {event.timeToRespond}s
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="p-3 sm:p-4">
                            <div className="space-y-2 sm:space-y-3">
                              {event.policyResponses.map(policy => (
                                <Button
                                  key={policy.id}
                                  variant="outline"
                                  className="w-full text-left h-auto p-2 sm:p-3"
                                  disabled={gameState.availableFunds < policy.cost}
                                  onClick={() => handlePolicyResponse(event, policy)}
                                >
                                  <div>
                                    <div className="flex justify-between items-start">
                                      <span className="text-xs sm:text-sm font-medium">{policy.title}</span>
                                      <span className="text-xs text-green-600">
                                        ${policy.cost}M
                                      </span>
                                    </div>
                                    <p className="text-[10px] sm:text-xs text-gray-600 mt-1">
                                      {policy.description}
                                    </p>
                                  </div>
                                </Button>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Market Indicators */}
              <Card>
                <CardHeader className="pb-2 sm:pb-3">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <LineChart className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                    Market Indicators
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4">
                    {playerRegion && Object.entries(playerRegion.economicStats).map(([key, value]) => (
                      <div key={key} className="space-y-1">
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-600 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <span className="font-medium">{value}%</span>
                        </div>
                        <Progress value={value} className="h-1 sm:h-1.5" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 