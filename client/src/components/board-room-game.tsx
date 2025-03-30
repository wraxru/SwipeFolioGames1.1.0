import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './ui/card';
import { useGameState } from '@/hooks/use-game-state';
import { GameHeader, GameButton, GameProgress, GameOver } from './ui/game-elements';
import { Building2 } from 'lucide-react';
import { BOARD_ROOM_DECISIONS, type Decision } from '@/constants/board-room-data';

export function BoardRoomGame() {
  const { gameState, updateScore, addTickets, resetGame } = useGameState();
  const [currentDecision, setCurrentDecision] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [companyMetrics, setCompanyMetrics] = useState({
    marketShare: 100,
    profitMargin: 100,
    brandValue: 100,
    revenueGrowth: 100
  });

  useEffect(() => {
    if (gameStarted && !gameOver) {
      // Shuffle decisions and select a subset
      const shuffledDecisions = [...BOARD_ROOM_DECISIONS]
        .sort(() => Math.random() - 0.5)
        .slice(0, 3); // Show 3 decisions per game
      setDecisions(shuffledDecisions);
      setCurrentDecision(0);
    }
  }, [gameStarted, gameOver]);

  const handleDecision = (isOptionA: boolean) => {
    const decision = decisions[currentDecision];
    const impacts = isOptionA ? decision.optionA.impacts : decision.optionB.impacts;
    
    // Update company metrics based on decision
    const newMetrics = { ...companyMetrics };
    impacts.forEach(impact => {
      const metricKey = impact.metric.toLowerCase().replace(' ', '') as keyof typeof companyMetrics;
      if (newMetrics[metricKey]) {
        newMetrics[metricKey] += impact.value;
      }
    });
    setCompanyMetrics(newMetrics);

    // Award tickets based on overall performance
    const avgMetric = Object.values(newMetrics).reduce((a, b) => a + b, 0) / Object.values(newMetrics).length;
    if (avgMetric > 110) {
      addTickets(1);
    }

    if (currentDecision < decisions.length - 1) {
      setCurrentDecision(currentDecision + 1);
    } else {
      setGameOver(true);
    }
  };

  const handleReset = () => {
    setCurrentDecision(0);
    setGameStarted(false);
    setGameOver(false);
    setDecisions([]);
    setCompanyMetrics({
      marketShare: 100,
      profitMargin: 100,
      brandValue: 100,
      revenueGrowth: 100
    });
    resetGame();
  };

  return (
    <motion.div 
      className="container mx-auto px-4 py-4 sm:py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <GameHeader 
        title="Board Room Decisions" 
        level={gameState.level}
        xp={gameState.xp}
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
              <motion.div 
                className="p-4 sm:p-6 text-center"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Building2 className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-blue-600" />
                </motion.div>
                <motion.h2 
                  className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  Welcome to the Board Room
                </motion.h2>
                <motion.p 
                  className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  Make strategic decisions that will impact your company's future.
                </motion.p>
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <GameButton onClick={() => setGameStarted(true)}>
                    Start Making Decisions
                  </GameButton>
                </motion.div>
              </motion.div>
            </Card>
          </motion.div>
        )}

        {gameStarted && !gameOver && decisions[currentDecision] && (
          <motion.div
            key="game"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-4 sm:mb-6">
              <motion.div 
                className="p-4 sm:p-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.h3 
                  className="text-lg sm:text-xl font-bold mb-3 sm:mb-4"
                  layoutId="decision-title"
                >
                  {decisions[currentDecision].title}
                </motion.h3>
                <motion.p 
                  className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6"
                  layoutId="decision-description"
                >
                  {decisions[currentDecision].description}
                </motion.p>
                <motion.div className="space-y-3 sm:space-y-4">
                  {decisions[currentDecision].options.map((option, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <GameButton
                        onClick={() => handleDecision(option.effects)}
                        variant={option.type === 'positive' ? 'good' : option.type === 'negative' ? 'bad' : 'default'}
                      >
                        {option.text}
                      </GameButton>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </Card>
            <GameProgress current={currentDecision + 1} total={decisions.length} />
          </motion.div>
        )}

        {gameOver && (
          <motion.div
            key="end"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.4 }}
          >
            <GameOver
              score={gameState.score}
              tickets={gameState.tickets}
              onPlayAgain={resetGame}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 