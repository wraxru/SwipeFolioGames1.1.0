import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './ui/card';
import { useGameState } from '@/hooks/use-game-state';
import { 
  GameHeader, 
  DecisionCard, 
  ImpactCard, 
  GameOver 
} from './ui/game-elements';
import { BOARD_ROOM_DECISIONS, GAME_CONSTANTS } from '@/constants/game-data';
import { Building2, TrendingUp, Award } from 'lucide-react';
import type { BoardRoomDecision } from '@/types/game';

export function BoardRoomGame() {
  const {
    gameState,
    updateScore,
    addTickets,
    resetGame
  } = useGameState();

  const [currentDecision, setCurrentDecision] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showImpact, setShowImpact] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [decisions, setDecisions] = useState<BoardRoomDecision[]>([]);
  const [impactMetrics, setImpactMetrics] = useState<{ name: string; change: number }[]>([]);
  const [totalScore, setTotalScore] = useState(0);

  // Initialize randomized decisions when game starts
  useEffect(() => {
    if (gameStarted && !gameOver) {
      // Create a copy of decisions and shuffle them
      const shuffledDecisions = [...BOARD_ROOM_DECISIONS]
        .sort(() => Math.random() - 0.5)
        .slice(0, GAME_CONSTANTS.DECISIONS_PER_GAME);
      setDecisions(shuffledDecisions);
      setCurrentDecision(0);
      setSelectedOption(null);
      setShowImpact(false);
      setTotalScore(0);
    }
  }, [gameStarted, gameOver]);

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    
    const currentDecisionObj = decisions[currentDecision];
    const selectedOptionObj = currentDecisionObj.options.find(o => o.id === optionId);
    
    if (selectedOptionObj) {
      // Calculate score based on impacts
      let decisionScore = 0;
      selectedOptionObj.impact.forEach(impact => {
        // Positive impacts add to score
        if (impact.change > 0) {
          decisionScore += impact.change;
        }
      });
      
      // Add to total score
      const newTotalScore = totalScore + decisionScore;
      setTotalScore(newTotalScore);
      
      // Update impact metrics for display
      setImpactMetrics(selectedOptionObj.impact);
      
      // Show impact screen
      setShowImpact(true);
    }
  };

  const handleContinue = () => {
    setShowImpact(false);
    setSelectedOption(null);
    
    if (currentDecision < decisions.length - 1) {
      setCurrentDecision(currentDecision + 1);
    } else {
      // Game over - update score and award tickets
      updateScore(Math.floor(totalScore));
      addTickets(GAME_CONSTANTS.TICKETS_PER_DECISION_ROUND);
      setGameOver(true);
    }
  };

  const handleReset = () => {
    setCurrentDecision(0);
    setSelectedOption(null);
    setShowImpact(false);
    setGameStarted(false);
    setGameOver(false);
    setDecisions([]);
    setTotalScore(0);
    resetGame();
  };

  const getBoardRoomIntro = () => (
    <div className="flex flex-col items-center justify-center py-12 space-y-8">
      <motion.div
        className="relative"
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="relative bg-gradient-to-br from-blue-400 to-blue-600 p-8 rounded-xl shadow-lg">
          <Building2 className="w-20 h-20 text-white" strokeWidth={1.5} />
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 bg-amber-300 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </motion.div>

      <div className="space-y-6 text-center px-4">
        <h3 className="text-2xl font-semibold">Executive Board Room</h3>
        <p className="text-gray-600">Make strategic business decisions and see how they impact company metrics. Earn tickets by making good choices!</p>
        <motion.button 
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-md"
          onClick={() => setGameStarted(true)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          Start Game
        </motion.button>
      </div>
    </div>
  );

  return (
    <motion.div 
      className="container mx-auto px-4 py-4 sm:py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <GameHeader 
        title="Board Room Decisions" 
        tickets={gameState.tickets}
      />

      <AnimatePresence mode="wait">
        {!gameStarted && !gameOver && (
          <motion.div
            key="start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-4 sm:mb-6">
              <div className="p-4 sm:p-6">
                {getBoardRoomIntro()}
              </div>
            </Card>
          </motion.div>
        )}

        {gameStarted && !gameOver && decisions.length > 0 && !showImpact && (
          <motion.div
            key="decision"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-4">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Decision {currentDecision + 1} of {decisions.length}
                </div>
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 text-blue-500 mr-1.5" />
                  <span className="font-medium">Score: {Math.floor(totalScore)}</span>
                </div>
              </div>
            </div>
            
            <DecisionCard 
              title={decisions[currentDecision].title}
              description={decisions[currentDecision].description}
              options={decisions[currentDecision].options.map(o => ({
                id: o.id,
                text: o.text,
                impact: o.id // Just passing the ID, we'll look up impacts when selected
              }))}
              onSelect={handleOptionSelect}
            />
          </motion.div>
        )}

        {gameStarted && !gameOver && showImpact && (
          <motion.div
            key="impact"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ImpactCard
              metrics={impactMetrics}
              onContinue={handleContinue}
            />
          </motion.div>
        )}

        {gameOver && (
          <motion.div
            key="end"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <div className="p-4 sm:p-6">
                <div className="text-center py-6 space-y-8">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.3
                    }}
                    className="flex justify-center"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-300 to-blue-500 blur-xl opacity-30 rounded-full"></div>
                      <div className="relative bg-gradient-to-br from-blue-400 to-blue-600 p-5 rounded-full">
                        <Award className="w-16 h-16 text-white" />
                      </div>
                    </div>
                  </motion.div>

                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold">Board Meeting Adjourned!</h2>
                    <p className="text-gray-600">Your strategic decisions have shaped the company's future.</p>
                    <p className="text-lg font-semibold text-blue-600">Final Score: {Math.floor(totalScore)}</p>
                    <p className="text-amber-600 font-medium mt-4">
                      +{GAME_CONSTANTS.TICKETS_PER_DECISION_ROUND} tickets earned!
                    </p>
                  </div>
                  
                  <motion.button 
                    className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-md"
                    onClick={handleReset}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Play Again
                  </motion.button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}