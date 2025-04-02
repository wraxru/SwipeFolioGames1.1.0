import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useGameState } from '@/hooks/use-game-state';
import { GameHeader, GameOver } from './ui/game-elements';
import { useLocation } from 'wouter';
import { 
  TrendingUp, TrendingDown, AlertTriangle, DollarSign, ArrowLeft, 
  Briefcase, LineChart, Scale, X, CreditCard, Users, Timer, ArrowRight, Trophy
} from 'lucide-react';

// Interfaces for the financial card game
interface FinancialCard {
  id: string;
  name: string;
  type: 'metric' | 'market-condition';
  power: number;
  ability: {
    name: string;
    description: string;
    effect: (gameState: GameState) => void;
  };
  marketConditions: string[];
  educationalText: string;
  visual: {
    character: string;
    description: string;
  };
}

interface TimeAttackState {
  timeRemaining: number;
  cardsInQueue: FinancialCard[];
  comboMultiplier: number;
  strategicCombos: {
    name: string;
    cards: string[];
    completed: boolean;
    points: number;
  }[];
}

interface PlayerStats {
  rank: 'Novice Investor' | 'Analyst' | 'Fund Manager' | 'Market Guru';
  experience: number;
  masteredCards: {
    cardId: string;
    level: number;
    timesUsed: number;
  }[];
  completedChallenges: string[];
}

// Enhance GameState interface
interface GameState {
  turn: number;
  playerHealth: number;
  opponentHealth: number;
  playerDeck: FinancialCard[];
  playerHand: FinancialCard[];
  opponentDeck: FinancialCard[];
  opponentHand: FinancialCard[];
  currentMarketCondition: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tutorialCompleted: boolean;
  achievements: string[];
  timeRemaining?: number; // For Time Attack mode
  gameMode: 'standard' | 'timeAttack' | 'companyAnalysis' | 'marketCycle';
  timeAttackState?: TimeAttackState;
  playerStats: PlayerStats;
  marketPhase: 'early-bull' | 'late-bull' | 'early-bear' | 'late-bear' | 'recovery';
  activeEffects: {
    id: string;
    duration: number;
    effect: (state: GameState) => void;
  }[];
  lastPlayedCard?: FinancialCard;
  lastPlayedOpponentCard?: FinancialCard;
}

interface BattleAnimationState {
  attackerCard: FinancialCard;
  defenderCard: FinancialCard;
  outcome: 'win' | 'lose' | 'draw';
  explanation: string;
}

// Add new interfaces for special game modes
interface CompanyProfile {
  name: string;
  industry: string;
  metrics: {
    [key: string]: number;
  };
  challenges: string[];
}

// Example financial cards
const FINANCIAL_CARDS: FinancialCard[] = [
  {
    id: 'eps',
    name: 'Earnings Per Share',
    type: 'metric',
    power: 7,
    ability: {
      name: 'Earnings Shield',
      description: 'Reduces damage from high P/E ratio cards',
      effect: (gameState) => {
        // Implementation of ability effect
      }
    },
    marketConditions: ['value', 'growth'],
    educationalText: 'EPS is profit divided by shares, showing how much profit a company makes per share of stock.',
    visual: {
      character: 'knight',
      description: 'A knight with an earnings shield'
    }
  },
  {
    id: 'revenue-growth',
    name: 'Revenue Growth',
    type: 'metric',
    power: 6,
    ability: {
      name: 'Momentum Boost',
      description: 'Increases power for consecutive turns',
      effect: (gameState) => {
        // Implementation of ability effect
      }
    },
    marketConditions: ['growth', 'momentum'],
    educationalText: 'Revenue growth measures how quickly a company\'s sales are increasing over time.',
    visual: {
      character: 'sprinter',
      description: 'A sprinter with energy trails'
    }
  },
  {
    id: 'pe-ratio',
    name: 'P/E Ratio',
    type: 'metric',
    power: 5,
    ability: {
      name: 'Valuation Check',
      description: 'Can overcome higher-power cards if their growth is weak',
      effect: (gameState) => {
        // Implementation of ability effect
      }
    },
    marketConditions: ['value', 'contrarian'],
    educationalText: 'The P/E ratio shows a stock\'s price relative to its earnings, helping determine if a stock is overvalued or undervalued.',
    visual: {
      character: 'seesaw',
      description: 'A seesaw showing price vs. earnings'
    }
  }
];

// Market condition cards
const MARKET_CONDITIONS: FinancialCard[] = [
  {
    id: 'bull-market',
    name: 'Bull Market',
    type: 'market-condition',
    power: 0,
    ability: {
      name: 'Growth Surge',
      description: 'Boosts growth metrics and allows revenue cards to attack twice',
      effect: (gameState) => {
        // Implementation of ability effect
      }
    },
    marketConditions: ['growth'],
    educationalText: 'A bull market is characterized by rising prices and optimistic investor sentiment.',
    visual: {
      character: 'bull',
      description: 'A charging bull with upward trend lines'
    }
  },
  {
    id: 'bear-market',
    name: 'Bear Market',
    type: 'market-condition',
    power: 0,
    ability: {
      name: 'Defensive Stance',
      description: 'Boosts stability metrics and activates defensive abilities',
      effect: (gameState) => {
        // Implementation of ability effect
      }
    },
    marketConditions: ['value', 'defensive'],
    educationalText: 'A bear market features falling prices and pessimistic investor sentiment.',
    visual: {
      character: 'bear',
      description: 'A protective bear with shield'
    }
  },
  {
    id: 'volatile-market',
    name: 'Volatile Market',
    type: 'market-condition',
    power: 0,
    ability: {
      name: 'Random Fluctuations',
      description: 'Causes random power fluctuations and doubles Beta card power',
      effect: (gameState) => {
        // Implementation of ability effect
      }
    },
    marketConditions: ['momentum', 'speculative'],
    educationalText: 'A volatile market experiences large price swings in both directions.',
    visual: {
      character: 'lightning',
      description: 'Lightning bolts with jagged price movements'
    }
  }
];

const COMPANY_PROFILES: CompanyProfile[] = [
  {
    name: 'TechStart Inc.',
    industry: 'Technology',
    metrics: {
      'eps': 2.5,
      'revenue-growth': 35,
      'pe-ratio': 45
    },
    challenges: [
      'High P/E ratio indicates high growth expectations',
      'Strong revenue growth but increasing competition',
      'Need to balance growth with profitability'
    ]
  },
  {
    name: 'ValueCorp',
    industry: 'Manufacturing',
    metrics: {
      'eps': 4.2,
      'revenue-growth': 8,
      'pe-ratio': 15
    },
    challenges: [
      'Low P/E ratio suggests undervaluation',
      'Stable but slow revenue growth',
      'Focus on operational efficiency'
    ]
  }
];

// Add new animation components at the top
const BattleEffect = ({ type }: { type: 'attack' | 'defend' | 'special' }) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: [0, 1.5, 0],
        opacity: [0, 1, 0],
      }}
      transition={{ duration: 0.5 }}
      className={`absolute z-10 w-16 h-16 rounded-full ${
        type === 'attack' ? 'bg-red-500' :
        type === 'defend' ? 'bg-blue-500' :
        'bg-purple-500'
      }`}
    />
  );
};

const CardPlayAnimation = ({ card, isPlayer }: { card: FinancialCard; isPlayer: boolean }) => {
  return (
    <motion.div
      initial={{ 
        x: isPlayer ? '100%' : '-100%',
        y: isPlayer ? '100%' : '-100%',
        opacity: 0,
      }}
      animate={{ 
        x: '0%',
        y: '0%',
        opacity: [0, 1, 0],
      }}
      transition={{ duration: 0.7 }}
      className="absolute z-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
    >
      <div className="bg-white rounded-lg shadow-lg p-3 border-2 border-primary-500">
        <div className="flex items-center gap-2">
          {card.visual.character === 'knight' && <Briefcase className="h-6 w-6 text-blue-500" />}
          {card.visual.character === 'sprinter' && <TrendingUp className="h-6 w-6 text-green-500" />}
          {card.visual.character === 'seesaw' && <Scale className="h-6 w-6 text-purple-500" />}
          <span className="font-semibold">{card.name}</span>
        </div>
      </div>
    </motion.div>
  );
};

// Add strategic combinations
const STRATEGIC_COMBOS = [
  {
    name: 'Growth Strategy',
    cards: ['revenue-growth', 'eps', 'pe-ratio'],
    points: 500,
    description: 'Combine revenue growth with strong earnings for maximum impact'
  },
  {
    name: 'Value Defense',
    cards: ['eps', 'debt-ratio', 'profit-margin'],
    points: 400,
    description: 'Build a defensive position with strong fundamentals'
  },
  {
    name: 'Market Momentum',
    cards: ['revenue-growth', 'beta', 'volume'],
    points: 600,
    description: 'Capitalize on market trends and trading activity'
  }
];

// Add market cycle phases
const MARKET_PHASES = {
  'early-bull': {
    description: 'Growth metrics gain momentum',
    powerModifiers: { growth: 2, value: 0, momentum: 1 }
  },
  'late-bull': {
    description: 'Speculative activity increases',
    powerModifiers: { growth: 1, value: -1, momentum: 2 }
  },
  'early-bear': {
    description: 'Defensive metrics become crucial',
    powerModifiers: { growth: -1, value: 2, momentum: -1 }
  },
  'late-bear': {
    description: 'Focus on survival and stability',
    powerModifiers: { growth: -2, value: 1, momentum: -2 }
  },
  'recovery': {
    description: 'Balance between growth and value',
    powerModifiers: { growth: 1, value: 1, momentum: 0 }
  }
};

// Add Time Attack mode components
const TimeAttackQueue = ({ cards }: { cards: FinancialCard[] }) => {
  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 bg-white/90 rounded-lg shadow-lg p-4 w-48">
      <h3 className="text-lg font-bold mb-2">Coming Up</h3>
      <div className="space-y-2">
        {cards.slice(0, 3).map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-100 p-2 rounded"
          >
            <p className="text-sm font-medium">{card.name}</p>
            <p className="text-xs text-gray-500">Power: {card.power}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const BattleAnimation = ({ 
  attackerCard, 
  defenderCard, 
  outcome,
  explanation 
}: { 
  attackerCard: FinancialCard;
  defenderCard: FinancialCard;
  outcome: 'win' | 'lose' | 'draw';
  explanation: string;
}) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="w-full max-w-lg mx-4">
        <div className="relative w-full aspect-[16/9] bg-gradient-to-b from-blue-600 to-blue-400 rounded-lg overflow-hidden">
          {/* Battle Arena */}
          <div className="absolute inset-0 flex flex-col justify-between p-4">
            {/* Opponent's Side */}
            <div className="flex justify-between items-start w-full">
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="bg-white/90 rounded-lg p-3 shadow-lg"
              >
                <h3 className="text-sm font-bold mb-1">Opponent's Card</h3>
                <div className="flex items-center gap-2">
                  {defenderCard.visual.character === 'knight' && <Briefcase className="h-5 w-5 text-blue-500" />}
                  {defenderCard.visual.character === 'sprinter' && <TrendingUp className="h-5 w-5 text-green-500" />}
                  {defenderCard.visual.character === 'seesaw' && <Scale className="h-5 w-5 text-purple-500" />}
                  <span className="font-medium">{defenderCard.name}</span>
                </div>
                <div className="mt-1 text-sm">Power: {defenderCard.power}</div>
              </motion.div>
            </div>

            {/* Battle Effects */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-white text-center">
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-4xl font-bold mb-2"
                >
                  {outcome === 'win' ? '💥 Victory!' : outcome === 'lose' ? '❌ Defeated!' : '🤝 Draw!'}
                </motion.div>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-lg bg-black/50 px-4 py-2 rounded-full"
                >
                  {explanation}
                </motion.div>
              </div>
            </motion.div>

            {/* Player's Side */}
            <div className="flex justify-between items-end w-full">
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="bg-white/90 rounded-lg p-3 shadow-lg"
              >
                <h3 className="text-sm font-bold mb-1">Your Card</h3>
                <div className="flex items-center gap-2">
                  {attackerCard.visual.character === 'knight' && <Briefcase className="h-5 w-5 text-blue-500" />}
                  {attackerCard.visual.character === 'sprinter' && <TrendingUp className="h-5 w-5 text-green-500" />}
                  {attackerCard.visual.character === 'seesaw' && <Scale className="h-5 w-5 text-purple-500" />}
                  <span className="font-medium">{attackerCard.name}</span>
                </div>
                <div className="mt-1 text-sm">Power: {attackerCard.power}</div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Educational Insight */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-4 bg-white rounded-lg p-4 shadow-lg"
        >
          <h4 className="font-medium mb-2">💡 Learning Point</h4>
          <p className="text-sm text-gray-700">{attackerCard.educationalText}</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Add Company Analysis components
const CompanyProfile = ({ company }: { company: CompanyProfile }) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{company.name}</CardTitle>
        <CardDescription>Industry: {company.industry}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Key Metrics</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(company.metrics).map(([metric, value]) => (
                <div key={metric} className="bg-gray-100 p-2 rounded">
                  <p className="text-sm font-medium">{metric}</p>
                  <p className="text-lg">{value}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Challenges</h4>
            <ul className="list-disc list-inside space-y-1">
              {company.challenges.map((challenge, index) => (
                <li key={index} className="text-sm text-gray-700">{challenge}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Add Market Cycle components
const MarketCycleIndicator = ({ phase, duration }: { phase: GameState['marketPhase']; duration: number }) => {
  const phaseInfo = MARKET_PHASES[phase];
  
  return (
    <div className="fixed right-4 top-20 bg-white rounded-lg shadow-lg p-4 w-64">
      <h3 className="text-lg font-bold mb-2">Market Phase</h3>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-medium">{phase}</span>
          <span className="text-sm text-gray-500">{duration}s</span>
        </div>
        <Progress value={(duration / 30) * 100} />
        <p className="text-sm text-gray-700">{phaseInfo.description}</p>
        <div className="mt-2 space-y-1">
          <p className="text-xs font-medium">Power Modifiers:</p>
          <div className="grid grid-cols-3 gap-1 text-xs">
            <div className="text-green-600">Growth: {phaseInfo.powerModifiers.growth > 0 ? '+' : ''}{phaseInfo.powerModifiers.growth}</div>
            <div className="text-blue-600">Value: {phaseInfo.powerModifiers.value > 0 ? '+' : ''}{phaseInfo.powerModifiers.value}</div>
            <div className="text-purple-600">Momentum: {phaseInfo.powerModifiers.momentum > 0 ? '+' : ''}{phaseInfo.powerModifiers.momentum}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add Market Cycle phase transition animation
const PhaseTransition = ({ from, to }: { from: GameState['marketPhase']; to: GameState['marketPhase'] }) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-4">Market Phase Change</h2>
          <div className="flex items-center justify-center space-x-4">
            <div className="text-lg">{from}</div>
            <ArrowRight className="h-6 w-6" />
            <div className="text-lg font-bold">{to}</div>
          </div>
          <p className="mt-4 text-gray-700">{MARKET_PHASES[to].description}</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Add core game mechanics
const calculateDamage = (
  attacker: FinancialCard,
  defender: FinancialCard,
  state: GameState
): number => {
  let damage = attacker.power;
  
  // Apply market phase modifiers
  const marketModifiers = MARKET_PHASES[state.marketPhase].powerModifiers;
  if (attacker.marketConditions.includes('growth')) {
    damage += marketModifiers.growth;
  }
  if (attacker.marketConditions.includes('value')) {
    damage += marketModifiers.value;
  }
  if (attacker.marketConditions.includes('momentum')) {
    damage += marketModifiers.momentum;
  }
  
  // Apply mode-specific modifiers
  if (state.gameMode === 'timeAttack' && state.timeAttackState) {
    damage *= state.timeAttackState.comboMultiplier;
  }
  
  return Math.max(1, Math.round(damage));
};

const generateBattleExplanation = (
  attacker: FinancialCard,
  defender: FinancialCard,
  marketPhase: GameState['marketPhase']
): string => {
  const phaseInfo = MARKET_PHASES[marketPhase];
  
  if (attacker.marketConditions.some(c => 
    (c === 'growth' && phaseInfo.powerModifiers.growth > 0) ||
    (c === 'value' && phaseInfo.powerModifiers.value > 0) ||
    (c === 'momentum' && phaseInfo.powerModifiers.momentum > 0)
  )) {
    return `${attacker.name} is particularly effective during ${marketPhase} phase!`;
  }
  
  return `${attacker.name} clashes with ${defender.name}!`;
};

// Move handleCardPlay inside the FinancialCardGame component
export function FinancialCardGame() {
  const [, navigate] = useLocation();
  const [gameState, setGameState] = useState<GameState>({
    turn: 1,
    playerHealth: 100,
    opponentHealth: 100,
    playerDeck: [],
    playerHand: [],
    opponentDeck: [],
    opponentHand: [],
    currentMarketCondition: 'bull-market',
    difficulty: 'medium',
    tutorialCompleted: false,
    achievements: [],
    gameMode: 'standard',
    playerStats: {
      rank: 'Novice Investor',
      experience: 0,
      masteredCards: [],
      completedChallenges: []
    },
    marketPhase: 'early-bull',
    activeEffects: [],
    timeAttackState: null
  });

  const [showTutorial, setShowTutorial] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CompanyProfile | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [showEducationalOverlay, setShowEducationalOverlay] = useState<FinancialCard | null>(null);
  const [phaseDuration, setPhaseDuration] = useState(30);
  const [showPhaseTransition, setShowPhaseTransition] = useState<{
    from: GameState['marketPhase'];
    to: GameState['marketPhase'];
  } | null>(null);
  const [showBattleAnimation, setShowBattleAnimation] = useState<BattleAnimationState | null>(null);

  // Move handleCardPlay function definition here
  const handleCardPlay = async (card: FinancialCard) => {
    if (gameState.gameMode === 'timeAttack' && !gameState.timeAttackState) {
      return;
    }

    // Check if opponent has cards
    if (gameState.opponentHand.length === 0) {
      setGameState(prev => ({
        ...prev,
        opponentHealth: prev.opponentHealth - card.power, // Direct damage if no cards to defend
        lastPlayedCard: card
      }));
      handleTurnEnd();
      return;
    }

    // Store the played card
    setGameState(prev => ({
      ...prev,
      lastPlayedCard: card
    }));

    // Calculate battle outcome
    const opponentCard = gameState.opponentHand[0];
    const marketModifiers = MARKET_PHASES[gameState.marketPhase].powerModifiers;
    
    let attackerPower = card.power;
    let defenderPower = opponentCard.power;
    
    // Apply market phase modifiers
    if (card.marketConditions.includes('growth')) {
      attackerPower += marketModifiers.growth;
    }
    if (card.marketConditions.includes('value')) {
      attackerPower += marketModifiers.value;
    }
    if (card.marketConditions.includes('momentum')) {
      attackerPower += marketModifiers.momentum;
    }

    // Apply opponent card modifiers
    if (opponentCard.marketConditions.includes('growth')) {
      defenderPower += marketModifiers.growth;
    }
    if (opponentCard.marketConditions.includes('value')) {
      defenderPower += marketModifiers.value;
    }
    if (opponentCard.marketConditions.includes('momentum')) {
      defenderPower += marketModifiers.momentum;
    }
    
    // Apply active effects
    gameState.activeEffects.forEach(effect => {
      effect.effect(gameState);
    });
    
    // Generate battle explanation
    const explanation = generateBattleExplanation(card, opponentCard, gameState.marketPhase);
    
    // Determine outcome
    const outcome = attackerPower > defenderPower ? 'win' : attackerPower < defenderPower ? 'lose' : 'draw';
    
    // Show battle animation
    setShowBattleAnimation({
      attackerCard: card,
      defenderCard: opponentCard,
      outcome,
      explanation
    });
    
    // Update game state based on outcome
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for animation
    
    if (outcome === 'win') {
      const damage = calculateDamage(card, opponentCard, gameState);
      setGameState(prev => ({
        ...prev,
        opponentHealth: prev.opponentHealth - damage,
        playerStats: {
          ...prev.playerStats,
          experience: prev.playerStats.experience + 10
        }
      }));
      
      // Update mastery
      handleCardMastery(card);
      
      // Check for rank up
      setGameState(prev => ({
        ...prev,
        playerStats: checkForRankUp(prev.playerStats)
      }));
    }
    
    // Check for strategic combos in Time Attack mode
    if (gameState.gameMode === 'timeAttack' && gameState.timeAttackState) {
      const playedCards = gameState.timeAttackState.cardsInQueue.map(c => c.id);
      STRATEGIC_COMBOS.forEach(combo => {
        if (!combo.completed && isSubsequence(combo.cards, playedCards)) {
          setGameState(prev => ({
            ...prev,
            timeAttackState: {
              ...prev.timeAttackState!,
              comboMultiplier: prev.timeAttackState!.comboMultiplier + 0.5,
              strategicCombos: prev.timeAttackState!.strategicCombos.map(sc =>
                sc.name === combo.name ? { ...sc, completed: true } : sc
              )
            },
            playerStats: {
              ...prev.playerStats,
              experience: prev.playerStats.experience + combo.points
            }
          }));
        }
      });
    }
    
    // Handle turn end
    handleTurnEnd();
  };

  const handleTurnEnd = () => {
    // Update active effects
    setGameState(prev => ({
      ...prev,
      turn: prev.turn + 1,
      activeEffects: prev.activeEffects
        .map(effect => ({ ...effect, duration: effect.duration - 1 }))
        .filter(effect => effect.duration > 0)
    }));
    
    // Remove played cards from hands
    setGameState(prev => ({
      ...prev,
      playerHand: prev.playerHand.filter(c => c.id !== prev.lastPlayedCard?.id),
      opponentHand: prev.opponentHand.filter(c => c.id !== prev.lastPlayedOpponentCard?.id),
    }));
    
    // Draw new cards
    if (gameState.playerDeck.length > 0) {
      const newPlayerCard = gameState.playerDeck[0];
      setGameState(prev => ({
        ...prev,
        playerDeck: prev.playerDeck.slice(1),
        playerHand: [...prev.playerHand, newPlayerCard]
      }));
    }

    if (gameState.opponentDeck.length > 0) {
      const newOpponentCard = gameState.opponentDeck[0];
      setGameState(prev => ({
        ...prev,
        opponentDeck: prev.opponentDeck.slice(1),
        opponentHand: [...prev.opponentHand, newOpponentCard]
      }));
    }
    
    // Handle opponent's turn after a delay
    setTimeout(() => {
      handleOpponentTurn();
    }, 1000);
  };

  const handleOpponentTurn = async () => {
    if (gameState.opponentHand.length === 0) return;
    
    // Simple AI: Choose the highest power card that matches current market phase
    const bestCard = gameState.opponentHand
      .sort((a, b) => {
        const aBonus = a.marketConditions.includes(gameState.marketPhase) ? 2 : 0;
        const bBonus = b.marketConditions.includes(gameState.marketPhase) ? 2 : 0;
        return (b.power + bBonus) - (a.power + aBonus);
      })[0];
    
    // Store the opponent's played card
    setGameState(prev => ({
      ...prev,
      lastPlayedOpponentCard: bestCard
    }));
    
    await handleCardPlay(bestCard);
  };

  const checkForRankUp = (stats: PlayerStats): PlayerStats => {
    const newStats = { ...stats };
    
    if (stats.experience >= 5000 && stats.rank !== 'Market Guru') {
      newStats.rank = 'Market Guru';
    } else if (stats.experience >= 2500 && stats.rank === 'Novice Investor') {
      newStats.rank = 'Fund Manager';
    } else if (stats.experience >= 1000 && stats.rank === 'Novice Investor') {
      newStats.rank = 'Analyst';
    }
    
    return newStats;
  };

  // Initialize game
  const initializeGame = () => {
    // Shuffle and deal cards
    const shuffledDeck = [...FINANCIAL_CARDS].sort(() => Math.random() - 0.5);
    const playerDeck = shuffledDeck.slice(0, 20);
    const opponentDeck = shuffledDeck.slice(20, 40);
    
    // Draw initial hands
    const playerHand = playerDeck.slice(0, 5);
    const opponentHand = opponentDeck.slice(0, 5);
    
    // Initialize based on game mode
    let timeAttackState = null;
    if (gameState.gameMode === 'timeAttack') {
      timeAttackState = {
        timeRemaining: 60,
        cardsInQueue: [],
        comboMultiplier: 1,
        strategicCombos: STRATEGIC_COMBOS.map(combo => ({
          ...combo,
          completed: false
        }))
      };
    }
    
    setGameState(prev => ({
      ...prev,
      playerDeck: playerDeck.slice(5),
      playerHand,
      opponentDeck: opponentDeck.slice(5),
      opponentHand,
      timeAttackState
    }));
    
    // Initialize mode-specific state
    switch (gameState.gameMode) {
      case 'timeAttack':
        setTimeRemaining(60);
        break;
      case 'companyAnalysis':
        setSelectedCompany(COMPANY_PROFILES[Math.floor(Math.random() * COMPANY_PROFILES.length)]);
        break;
      case 'marketCycle':
        setPhaseDuration(30);
        break;
    }
  };

  // Handle time attack mode
  useEffect(() => {
    if (gameState.gameMode === 'timeAttack' && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [gameState.gameMode, timeRemaining]);

  // Handle market cycle phase changes
  useEffect(() => {
    if (gameState.gameMode === 'marketCycle') {
      const phaseOrder: GameState['marketPhase'][] = [
        'early-bull',
        'late-bull',
        'early-bear',
        'late-bear',
        'recovery'
      ];
      
      const timer = setInterval(() => {
        setPhaseDuration(prev => {
          if (prev <= 1) {
            const currentIndex = phaseOrder.indexOf(gameState.marketPhase);
            const nextPhase = phaseOrder[(currentIndex + 1) % phaseOrder.length];
            
            setShowPhaseTransition({
              from: gameState.marketPhase,
              to: nextPhase
            });
            
            setTimeout(() => {
              setShowPhaseTransition(null);
              setGameState(prev => ({
                ...prev,
                marketPhase: nextPhase,
                playerStats: {
                  ...prev.playerStats,
                  experience: prev.playerStats.experience + 25 // Bonus for surviving phase change
                }
              }));
            }, 2000);
            
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [gameState.gameMode, gameState.marketPhase]);

  // Handle educational overlay triggers
  const handleCardInfo = (card: FinancialCard) => {
    setShowEducationalOverlay(card);
  };

  // Add mastery system handlers
  const handleCardMastery = (card: FinancialCard) => {
    setGameState(prev => {
      const masteredCard = prev.playerStats.masteredCards.find(mc => mc.cardId === card.id);
      
      if (masteredCard) {
        // Update existing mastery
        const newTimesUsed = masteredCard.timesUsed + 1;
        const newLevel = Math.floor(newTimesUsed / 100) + 1;
        
        return {
          ...prev,
          playerStats: {
            ...prev.playerStats,
            masteredCards: prev.playerStats.masteredCards.map(mc =>
              mc.cardId === card.id
                ? { ...mc, timesUsed: newTimesUsed, level: Math.min(newLevel, 5) }
                : mc
            )
          }
        };
      } else {
        // Add new mastery entry
        return {
          ...prev,
          playerStats: {
            ...prev.playerStats,
            masteredCards: [
              ...prev.playerStats.masteredCards,
              { cardId: card.id, level: 1, timesUsed: 1 }
            ]
          }
        };
      }
    });
  };

  // Helper function to check if one array is a subsequence of another
  const isSubsequence = (sub: string[], main: string[]): boolean => {
    let j = 0;
    for (let i = 0; i < main.length && j < sub.length; i++) {
      if (sub[j] === main[i]) j++;
    }
    return j === sub.length;
  };

  // Add game mode selection UI
  const renderModeSelection = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Financial Metrics Battle
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Master financial metrics through strategic card battles
              </p>
            </motion.div>
          </div>

          {/* Features Grid */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white/80 backdrop-blur rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold">Strategic Cards</h3>
              </div>
              <p className="text-sm text-gray-600">Each card represents a unique financial metric with special abilities</p>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-green-100 p-2 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold">Market Dynamics</h3>
              </div>
              <p className="text-sm text-gray-600">Battle against changing market conditions and adapt your strategy</p>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Trophy className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold">Earn & Learn</h3>
              </div>
              <p className="text-sm text-gray-600">Unlock achievements and new cards as you improve your knowledge</p>
            </div>
          </motion.div>

          {/* Game Modes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Choose Your Mode</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  className="w-full h-auto p-6 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg group"
                  onClick={() => {
                    setGameState(prev => ({ ...prev, gameMode: 'standard' }));
                    setShowTutorial(false);
                    initializeGame();
                  }}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-blue-400/20 p-3 rounded-lg group-hover:bg-blue-400/30 transition-colors">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg font-semibold mb-1">Standard Mode</h3>
                      <p className="text-sm text-blue-100">Classic card battles with strategic depth</p>
                    </div>
                  </div>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  className="w-full h-auto p-6 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg group"
                  onClick={() => {
                    setGameState(prev => ({ ...prev, gameMode: 'timeAttack' }));
                    setShowTutorial(false);
                    initializeGame();
                  }}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-green-400/20 p-3 rounded-lg group-hover:bg-green-400/30 transition-colors">
                      <Timer className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg font-semibold mb-1">Time Attack</h3>
                      <p className="text-sm text-green-100">Fast-paced battles against the clock</p>
                    </div>
                  </div>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  className="w-full h-auto p-6 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg group"
                  onClick={() => {
                    setGameState(prev => ({ ...prev, gameMode: 'companyAnalysis' }));
                    setShowTutorial(false);
                    initializeGame();
                  }}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-purple-400/20 p-3 rounded-lg group-hover:bg-purple-400/30 transition-colors">
                      <LineChart className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg font-semibold mb-1">Company Analysis</h3>
                      <p className="text-sm text-purple-100">Deep dive into real company metrics</p>
                    </div>
                  </div>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  className="w-full h-auto p-6 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg group"
                  onClick={() => {
                    setGameState(prev => ({ ...prev, gameMode: 'marketCycle' }));
                    setShowTutorial(false);
                    initializeGame();
                  }}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-orange-400/20 p-3 rounded-lg group-hover:bg-orange-400/30 transition-colors">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg font-semibold mb-1">Market Cycle</h3>
                      <p className="text-sm text-orange-100">Adapt to changing market conditions</p>
                    </div>
                  </div>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

  // Render mode-specific UI elements
  const renderModeUI = () => {
    switch (gameState.gameMode) {
      case 'timeAttack':
        return (
          <div className="fixed top-4 right-4 bg-white rounded-lg shadow-lg p-4">
            <div className="flex items-center gap-2">
              <Timer className="h-5 w-5 text-red-500" />
              <span className="font-semibold">{timeRemaining}s</span>
            </div>
          </div>
        );
      
      case 'companyAnalysis':
        return selectedCompany ? (
          <CompanyProfile company={selectedCompany} />
        ) : null;
      
      case 'marketCycle':
        return (
          <MarketCycleIndicator
            phase={gameState.marketPhase}
            duration={phaseDuration}
          />
        );
      
      default:
        return null;
    }
  };

  // Render game board
  const renderGameBoard = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Mobile-optimized Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="max-w-5xl mx-auto px-3">
            {/* Top Navigation Row */}
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <motion.div whileHover={{ x: -2 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/games-hub')}
                  className="text-gray-600 hover:text-gray-900 -ml-2 group"
                >
                  <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                  <span className="text-sm">Back</span>
                </Button>
              </motion.div>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg px-3 py-1.5 shadow-sm"
              >
                <Trophy className="w-4 h-4 mr-1.5" />
                <span className="text-sm font-medium">
                  {gameState.playerStats.experience} XP
                </span>
              </motion.div>
            </div>
            
            {/* Title Row */}
            <div className="py-3">
              <motion.div 
                className="flex items-center gap-3"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg shadow-sm">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Financial Metrics Battle</h1>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-medium">{gameState.gameMode} Mode</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                    <span>Turn {gameState.turn}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Game Content */}
        <div className="max-w-5xl mx-auto px-3 py-4">
          {/* Market Phase - Enhanced */}
          <motion.div 
            className="bg-white/90 backdrop-blur rounded-xl shadow-sm border border-gray-200/50 p-4 mb-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <div className="flex flex-col space-y-3">
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 p-1.5 rounded-lg">
                  <LineChart className="w-5 h-5 text-blue-600" />
                </div>
                <span className="font-semibold capitalize">{gameState.marketPhase.replace('-', ' ')}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <motion.span 
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-sm shadow-sm"
                  whileHover={{ scale: 1.05 }}
                >
                  Growth +2
                </motion.span>
                <motion.span 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full text-sm shadow-sm"
                  whileHover={{ scale: 1.05 }}
                >
                  Value +0
                </motion.span>
                <motion.span 
                  className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm shadow-sm"
                  whileHover={{ scale: 1.05 }}
                >
                  Momentum +1
                </motion.span>
              </div>
            </div>
          </motion.div>

          {/* Battle Area - Enhanced */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Player Stats */}
            <motion.div 
              className="bg-white/90 backdrop-blur rounded-xl shadow-sm border border-gray-200/50 p-4"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="bg-green-100 p-1.5 rounded-lg">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold">Your Stats</h2>
                    <p className="text-sm text-gray-600">{gameState.playerStats.rank}</p>
                  </div>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">{gameState.playerHealth}</div>
                        <div className="text-xs text-gray-500">HP</div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Your current health points</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Progress 
                value={gameState.playerHealth} 
                max={100} 
                className="h-2.5 bg-gray-100"
                indicatorClassName="bg-gradient-to-r from-green-500 to-green-600"
              />
            </motion.div>

            {/* Opponent Stats */}
            <motion.div 
              className="bg-white/90 backdrop-blur rounded-xl shadow-sm border border-gray-200/50 p-4"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="bg-red-100 p-1.5 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold">Opponent</h2>
                    <p className="text-sm text-gray-600">Market Forces</p>
                  </div>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="text-right">
                        <div className="text-lg font-bold text-red-600">{gameState.opponentHealth}</div>
                        <div className="text-xs text-gray-500">HP</div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Opponent's health points</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Progress 
                value={gameState.opponentHealth} 
                max={100} 
                className="h-2.5 bg-gray-100"
                indicatorClassName="bg-gradient-to-r from-red-500 to-red-600"
              />
            </motion.div>
          </div>

          {/* Player Hand - Enhanced */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                Your Hand
              </h2>
              <span className="text-sm text-gray-600">{gameState.playerHand.length} cards</span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {gameState.playerHand.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className="group bg-white/90 backdrop-blur hover:bg-white/95 shadow-sm hover:shadow-md transition-all border border-gray-200/50 cursor-pointer overflow-hidden"
                    onClick={() => handleCardPlay(card)}
                  >
                    <CardHeader className="p-4 pb-2 relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <CardTitle className="flex items-center justify-between text-base">
                        <span>{card.name}</span>
                        <span className="flex items-center gap-1.5">
                          <TrendingUp className="w-4 h-4 text-blue-500" />
                          <span className="text-blue-600 font-bold">{card.power}</span>
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">{card.ability.description}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {card.marketConditions.map((condition) => (
                            <span 
                              key={condition}
                              className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100"
                            >
                              {condition}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Battle Animation */}
          <AnimatePresence>
            {showBattleAnimation && (
              <motion.div 
                className="fixed inset-0 bg-black/80 flex items-center justify-center p-3 z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <BattleAnimation
                  attackerCard={showBattleAnimation.attackerCard}
                  defenderCard={showBattleAnimation.defenderCard}
                  outcome={showBattleAnimation.outcome}
                  explanation={showBattleAnimation.explanation}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  // Render game over screen
  const renderGameOver = () => {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      >
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-xl">Game Over</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-4">
              {gameState.playerHealth <= 0 ? 'You lost!' : 'You won!'}
            </p>
            <div className="space-y-2">
              <p>Final Score: {gameState.turn}</p>
              <p>Achievements Earned: {gameState.achievements.length}</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => {
              setGameOver(false);
              initializeGame();
            }}>
              Play Again
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    );
  };

  // Main render
  if (showTutorial) {
    return renderModeSelection();
  }

  if (gameOver) {
    return renderGameOver();
  }

  return (
    <div className="relative min-h-screen bg-gray-50 p-4">
      {/* Game Board */}
      {renderGameBoard()}

      {/* Educational Overlay */}
      <AnimatePresence>
        {showEducationalOverlay && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{showEducationalOverlay.name}</h2>
                <button 
                  onClick={() => setShowEducationalOverlay(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">What is it?</h3>
                  <p className="text-gray-700">{showEducationalOverlay.educationalText}</p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Market Conditions</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {showEducationalOverlay.marketConditions.map(condition => (
                      <div key={condition} className="bg-gray-50 p-3 rounded">
                        <h4 className="font-medium capitalize mb-1">{condition}</h4>
                        <p className="text-sm text-gray-600">
                          {condition === 'growth' && 'Performs well in expanding markets'}
                          {condition === 'value' && 'Strong in stable or declining markets'}
                          {condition === 'momentum' && 'Excels in trending markets'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const calculateMasteryProgress = (card: FinancialCard, stats: PlayerStats): number => {
  const masteredCard = stats.masteredCards.find(mc => mc.cardId === card.id);
  if (!masteredCard) return 0;
  
  const timesUsedInCurrentLevel = masteredCard.timesUsed % 100;
  return (timesUsedInCurrentLevel / 100) * 100;
}; 