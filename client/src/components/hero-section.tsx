import { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroSection() {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 3,
    hours: 12,
    minutes: 0,
    seconds: 0
  });

  // Effect to count down timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (value: number) => {
    return value.toString().padStart(2, '0');
  };

  return (
    <motion.div 
      className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 mb-6 shadow-lg overflow-hidden relative"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute right-0 top-0 w-40 h-40 bg-white rounded-full -mr-10 -mt-10 opacity-20"></div>
        <div className="absolute left-0 bottom-0 w-32 h-32 bg-white rounded-full -ml-10 -mb-10 opacity-20"></div>
      </div>

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <h2 className="text-white font-bold text-xl md:text-2xl mb-1">Invest $100 - Climb the Leaderboard</h2>
          <p className="text-blue-100 text-sm">Learn, invest, and compete with other investors</p>
        </div>
        
        <motion.div 
          className="flex items-center px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg shadow-inner"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <Trophy size={16} className="text-yellow-300 mr-2" />
          <span className="text-white font-medium text-sm">Top 10% Rank</span>
        </motion.div>
      </div>
      
      <div className="flex items-center justify-center">
        <div className="grid grid-cols-4 gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-3 shadow-inner">
          <TimeBox value={timeRemaining.days} label="Days" />
          <TimeBox value={timeRemaining.hours} label="Hours" />
          <TimeBox value={timeRemaining.minutes} label="Min" />
          <TimeBox value={timeRemaining.seconds} label="Sec" />
        </div>
      </div>
    </motion.div>
  );
}

function TimeBox({ value, label }: { value: number, label: string }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="bg-white/20 backdrop-blur-sm rounded w-12 h-12 flex items-center justify-center text-white font-bold text-lg shadow-inner">
        {value < 10 ? `0${value}` : value}
      </div>
      <span className="text-blue-100 text-xs mt-1">{label}</span>
    </div>
  );
}