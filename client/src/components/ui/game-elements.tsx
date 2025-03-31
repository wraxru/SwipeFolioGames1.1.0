import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Timer, Ticket, Trophy, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as ConfettiModule from 'react-canvas-confetti';

// Game Header Component
export function GameHeader({ 
  title, 
  tickets, 
  timeLeft 
}: { 
  title: string; 
  tickets?: number;
  timeLeft?: number;
}) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="flex flex-col mb-4 sm:mb-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        
        {tickets !== undefined && (
          <div className="flex items-center bg-gradient-to-r from-amber-100 to-amber-50 rounded-full px-3 py-1 border border-amber-200 shadow-sm">
            <Ticket className="w-4 h-4 text-amber-500 mr-1.5" />
            <span className="font-medium text-amber-700">{tickets}</span>
          </div>
        )}
      </div>
      
      {timeLeft !== undefined && (
        <div className="mt-4 flex items-center">
          <Timer className="w-4 h-4 text-red-500 mr-2" />
          <div className="font-mono text-lg font-medium text-red-600">
            {formatTime(timeLeft)}
          </div>
        </div>
      )}
    </div>
  );
}

// Game Progress Component
export function GameProgress({ 
  current, 
  total 
}: { 
  current: number; 
  total: number; 
}) {
  const progress = (current / total) * 100;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-gray-500">
        <span>Question {current} of {total}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}

// Metric Card Component
export function MetricCard({ 
  title, 
  value, 
  industryAverage, 
  explanation 
}: { 
  title: string; 
  value: string | number; 
  industryAverage: string | number;
  explanation?: string;
}) {
  return (
    <Card className="p-5 sm:p-6 border-2 border-indigo-100">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-indigo-900">{title}</h3>
          <div className="bg-indigo-50 px-2 py-1 rounded text-sm font-medium text-indigo-700">
            Industry: {industryAverage}
          </div>
        </div>
        
        <div className="flex justify-center">
          <div className="text-3xl sm:text-4xl font-bold text-indigo-600">{value}</div>
        </div>
        
        {explanation && (
          <div className="mt-4 p-3 bg-indigo-50 rounded-md text-sm text-indigo-900 border border-indigo-100">
            {explanation}
          </div>
        )}
      </div>
    </Card>
  );
}

// Game Button Component
export function GameButton({ 
  children, 
  onClick, 
  variant = 'default',
  disabled = false
}: { 
  children: React.ReactNode; 
  onClick: () => void; 
  variant?: 'default' | 'good' | 'bad'; 
  disabled?: boolean;
}) {
  const getButtonStyles = () => {
    switch (variant) {
      case 'good':
        return 'bg-green-500 hover:bg-green-600 text-white shadow-md shadow-green-200';
      case 'bad':
        return 'bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-200';
      default:
        return 'bg-blue-500 hover:bg-blue-600 text-white shadow-md shadow-blue-200';
    }
  };

  return (
    <Button
      onClick={onClick}
      className={cn(
        'w-full py-6 text-lg font-medium rounded-xl transition-all',
        getButtonStyles(),
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      disabled={disabled}
    >
      {children}
    </Button>
  );
}

// Game Over Component
export function GameOver({ 
  score, 
  correctAnswers,
  totalQuestions,
  onRestart 
}: { 
  score: number; 
  correctAnswers: number;
  totalQuestions: number;
  onRestart: () => void; 
}) {
  // Trigger confetti effect when component mounts
  React.useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.inset = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    const createConfetti = (ConfettiModule as any).default;
    const myConfetti = createConfetti(canvas, {
      resize: true,
      useWorker: true,
    });

    myConfetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Clean up
    return () => {
      document.body.removeChild(canvas);
    };
  }, []);

  return (
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
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-amber-500 blur-xl opacity-30 rounded-full"></div>
          <div className="relative bg-gradient-to-br from-yellow-300 to-amber-500 p-5 rounded-full">
            <Trophy className="w-16 h-16 text-white" />
          </div>
          <motion.div
            className="absolute -top-2 -right-2"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 5, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </motion.div>
        </div>
      </motion.div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Game Over!</h2>
        <p className="text-gray-600">You got {correctAnswers} out of {totalQuestions} correct!</p>
        <p className="text-lg font-semibold text-indigo-600">Final Score: {score}</p>
      </div>
      
      <Button 
        onClick={onRestart}
        className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white px-8 py-2"
      >
        Play Again
      </Button>
    </div>
  );
}

// Decision Card Component for Board Room Game
export function DecisionCard({ 
  title, 
  description, 
  options,
  onSelect
}: { 
  title: string; 
  description: string; 
  options: { id: string; text: string; impact: string }[];
  onSelect: (id: string) => void;
}) {
  return (
    <Card className="p-5 sm:p-6 border-2 border-indigo-100">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-indigo-900">{title}</h3>
        <p className="text-gray-600">{description}</p>
        
        <div className="mt-6 space-y-3">
          {options.map((option) => (
            <Button
              key={option.id}
              onClick={() => onSelect(option.id)}
              className="w-full justify-start text-left py-4 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-medium border border-indigo-100 shadow-sm"
            >
              {option.text}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
}

// Impact Card Component for Board Room Game
export function ImpactCard({ 
  metrics, 
  onContinue 
}: { 
  metrics: { name: string; change: number }[];
  onContinue: () => void;
}) {
  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeSymbol = (change: number) => {
    if (change > 0) return '+';
    if (change < 0) return '';
    return '';
  };

  return (
    <Card className="p-5 sm:p-6 border-2 border-amber-100">
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-amber-900">Impact on Metrics</h3>
        
        <div className="space-y-4">
          {metrics.map((metric) => (
            <div key={metric.name} className="flex justify-between items-center p-3 bg-amber-50 rounded-md">
              <span className="font-medium">{metric.name}</span>
              <span className={`font-bold ${getChangeColor(metric.change)}`}>
                {getChangeSymbol(metric.change)}{metric.change}%
              </span>
            </div>
          ))}
        </div>
        
        <Button 
          onClick={onContinue}
          className="w-full py-4 mt-4 bg-amber-500 hover:bg-amber-600 text-white"
        >
          Continue
        </Button>
      </div>
    </Card>
  );
}