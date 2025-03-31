import { useState, useEffect } from 'react';
import type { GameState } from '@/types/game';

export function useGameState(initialState: Partial<GameState> = {}) {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    level: 1,
    xp: 0,
    tickets: 0,
    lastSaved: Date.now(),
    ...initialState
  });

  // Auto-save functionality
  useEffect(() => {
    const saveInterval = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        lastSaved: Date.now()
      }));
      localStorage.setItem('gameState', JSON.stringify(gameState));
    }, 60000);

    return () => clearInterval(saveInterval);
  }, [gameState]);

  // Load saved state on mount
  useEffect(() => {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
      setGameState(JSON.parse(savedState));
    }
  }, []);

  const addXP = (amount: number) => {
    setGameState(prev => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 100) + 1;
      return {
        ...prev,
        xp: newXP,
        level: newLevel
      };
    });
  };

  const addTickets = (amount: number) => {
    setGameState(prev => ({
      ...prev,
      tickets: prev.tickets + amount
    }));
  };

  const updateScore = (amount: number) => {
    setGameState(prev => ({
      ...prev,
      score: prev.score + amount
    }));
  };

  const resetGame = () => {
    setGameState({
      score: 0,
      level: 1,
      xp: 0,
      tickets: 0,
      lastSaved: Date.now()
    });
  };

  return {
    gameState,
    setGameState,
    addXP,
    addTickets,
    updateScore,
    resetGame
  };
} 