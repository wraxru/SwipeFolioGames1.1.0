import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './card';
import { Progress } from './progress';
import { Button } from './button';
import { Trophy, Timer, Ticket, Star } from 'lucide-react';

interface GameHeaderProps {
  title: string;
  timeLeft?: number;
  tickets?: number;
  level?: number;
  xp?: number;
}

export function GameHeader({ title, timeLeft, tickets, level, xp }: GameHeaderProps) {
  return (
    <motion.div 
      className="flex justify-between items-center p-4 bg-white shadow-sm rounded-lg mb-6"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-xl font-bold">{title}</h1>
      <div className="flex items-center space-x-4">
        {timeLeft !== undefined && (
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Timer className="w-5 h-5 mr-2 text-blue-500" />
            <span>{timeLeft}s</span>
          </motion.div>
        )}
        {tickets !== undefined && (
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Ticket className="w-5 h-5 mr-2 text-green-500" />
            <span>{tickets}</span>
          </motion.div>
        )}
        {level !== undefined && (
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Star className="w-5 h-5 mr-2 text-yellow-500" />
            <span>Level {level}</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

interface MetricCardProps {
  title: string;
  value: number;
  industryAverage: number;
  explanation: string;
}

export function MetricCard({ title, value, industryAverage, explanation }: MetricCardProps) {
  return (
    <Card className="p-4">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{explanation}</p>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Company Value</p>
          <p className="text-xl font-bold">{value}%</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Industry Average</p>
          <p className="text-xl font-bold">{industryAverage}%</p>
        </div>
      </div>
    </Card>
  );
}

interface GameButtonProps {
  onClick: () => void;
  variant?: 'good' | 'bad' | 'default';
  children: React.ReactNode;
}

export function GameButton({ onClick, variant = 'default', children }: GameButtonProps) {
  const variantClasses = {
    good: 'bg-green-50 hover:bg-green-100',
    bad: 'bg-red-50 hover:bg-red-100',
    default: ''
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Button
        variant="outline"
        onClick={onClick}
        className={`${variantClasses[variant]} transition-all duration-200`}
      >
        {children}
      </Button>
    </motion.div>
  );
}

interface GameProgressProps {
  current: number;
  total: number;
}

export function GameProgress({ current, total }: GameProgressProps) {
  return (
    <motion.div 
      className="space-y-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Progress value={(current / total) * 100} className="w-full" />
      </motion.div>
      <motion.p 
        className="text-sm text-gray-500 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Question {current} of {total}
      </motion.p>
    </motion.div>
  );
}

interface GameOverProps {
  score: number;
  tickets: number;
  onPlayAgain: () => void;
}

export function GameOver({ score, tickets, onPlayAgain }: GameOverProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.5,
        type: "spring",
        stiffness: 200,
        damping: 20
      }}
      className="text-center space-y-4"
    >
      <motion.div
        animate={{ 
          rotate: [0, 10, -10, 10, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 1,
          times: [0, 0.2, 0.4, 0.6, 0.8],
          repeat: 0
        }}
      >
        <Trophy className="w-16 h-16 mx-auto text-yellow-500" />
      </motion.div>
      <motion.h3 
        className="text-2xl font-bold"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Game Over!
      </motion.h3>
      <motion.p 
        className="text-xl"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Final Score: {score}
      </motion.p>
      <motion.p 
        className="text-lg"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Tickets Earned: {tickets}
      </motion.p>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button onClick={onPlayAgain}>Play Again</Button>
      </motion.div>
    </motion.div>
  );
} 