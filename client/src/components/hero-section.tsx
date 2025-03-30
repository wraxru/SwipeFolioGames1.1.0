import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Clock } from 'lucide-react';

export default function HeroSection() {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Set competition end date (2 weeks from today)
  useEffect(() => {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 14); // 2 weeks from now
    
    const updateTimer = () => {
      const now = new Date();
      const difference = endDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        // Competition ended
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeRemaining({ days, hours, minutes, seconds });
    };
    
    updateTimer();
    const timerId = setInterval(updateTimer, 1000);
    
    return () => clearInterval(timerId);
  }, []);

  const timerVariants = {
    pulse: {
      scale: [1, 1.03, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "loop" as const
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="hero-section mb-6 rounded-xl overflow-hidden shadow-lg"
    >
      <div className="bg-gradient-to-r from-blue-600 to-violet-600 p-4 relative">
        {/* Background pattern */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <div 
              key={i}
              className="absolute bg-white/30 rounded-full"
              style={{
                width: `${Math.random() * 30 + 10}px`,
                height: `${Math.random() * 30 + 10}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.3,
                transform: `scale(${Math.random() * 0.8 + 0.5})`,
                animation: `float ${Math.random() * 10 + 10}s infinite ease-in-out ${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between text-white mb-1">
            <div className="flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-yellow-300" />
              <span className="text-sm font-medium text-yellow-300">Competition</span>
            </div>
            <motion.div 
              variants={timerVariants}
              animate="pulse"
              className="flex items-center bg-white/20 rounded-full px-2 py-1 backdrop-blur-sm"
            >
              <Clock className="h-3 w-3 mr-1" />
              <span className="text-xs font-medium">
                {timeRemaining.days}d {timeRemaining.hours}h {timeRemaining.minutes}m
              </span>
            </motion.div>
          </div>
          
          <h2 className="text-xl md:text-2xl font-bold text-white text-shadow mb-2">
            Invest $100 - Climb the Leaderboard
          </h2>
          
          <div className="flex items-center space-x-2">
            <div className="bg-white/20 text-white text-xs font-medium rounded-full px-2 py-1 backdrop-blur-sm">
              10 competitors
            </div>
            <div className="bg-white/20 text-white text-xs font-medium rounded-full px-2 py-1 backdrop-blur-sm">
              Real market data
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}