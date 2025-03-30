import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Clock, Award, TrendingUp, ArrowUp } from 'lucide-react';

export default function HeroSection() {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Set competition end date (1 week from today for demo)
  useEffect(() => {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7); // 1 week from now
    
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

  // Animation variants
  const timerItemVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "loop" as const
      }
    }
  };
  
  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0 8px 25px -5px rgba(0,0,0,0.2)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.98,
      boxShadow: "0 3px 15px -5px rgba(0,0,0,0.2)",
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="hero-section mb-6 rounded-xl overflow-hidden shadow-xl"
    >
      {/* Fresh, light gradient background with subtle pastel neon feel */}
      <div 
        className="p-4 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #D0EFFF 0%, #E1BEE7 100%)"
        }}
      >
        {/* Subtle animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute top-0 right-0 w-64 h-64 rounded-full bg-blue-200/20 blur-3xl"
            animate={{ 
              x: [0, 10, 0],
              y: [0, -10, 0],
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <motion.div 
            className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-purple-200/20 blur-3xl"
            animate={{ 
              x: [0, -10, 0],
              y: [0, 10, 0],
            }}
            transition={{ 
              duration: 7,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1
            }}
          />
        </div>
        
        <div className="relative z-10">
          {/* Header and countdown banner */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
            <div className="flex items-center mb-2 md:mb-0">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full p-1.5 shadow-lg mr-2">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg flex items-center">
                  1 Week Demo 
                  <div className="ml-2 px-2 py-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs rounded-full shadow-sm">
                    Beta Access
                  </div>
                </h3>
              </div>
            </div>
            
            {/* Countdown timer */}
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-medium text-slate-600">Demo Ends In:</span>
              {/* Days */}
              <motion.div 
                variants={timerItemVariants}
                animate="pulse"
                className="bg-white/70 backdrop-blur-sm rounded-md px-2 py-1 shadow-sm border border-indigo-100/50"
              >
                <span className="text-sm font-bold text-indigo-700">{timeRemaining.days}d</span>
              </motion.div>
              {/* Hours */}
              <motion.div 
                variants={timerItemVariants}
                animate="pulse"
                className="bg-white/70 backdrop-blur-sm rounded-md px-2 py-1 shadow-sm border border-indigo-100/50"
                style={{ animationDelay: "0.2s" }}
              >
                <span className="text-sm font-bold text-indigo-700">{timeRemaining.hours}h</span>
              </motion.div>
              {/* Minutes */}
              <motion.div 
                variants={timerItemVariants}
                animate="pulse"
                className="bg-white/70 backdrop-blur-sm rounded-md px-2 py-1 shadow-sm border border-indigo-100/50"
                style={{ animationDelay: "0.4s" }}
              >
                <span className="text-sm font-bold text-indigo-700">{timeRemaining.minutes}m</span>
              </motion.div>
              {/* Seconds */}
              <motion.div 
                variants={timerItemVariants}
                animate="pulse"
                className="bg-white/70 backdrop-blur-sm rounded-md px-2 py-1 shadow-sm border border-indigo-100/50"
                style={{ animationDelay: "0.6s" }}
              >
                <span className="text-sm font-bold text-indigo-700">{timeRemaining.seconds}s</span>
              </motion.div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-3 md:mb-0 md:mr-4">
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-1.5 flex items-center">
                Climb the Leaderboard
                <span className="ml-2 inline-block text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-teal-400 animate-pulse">& Win Big!</span>
              </h2>
              
              <div className="flex flex-wrap gap-2 mt-2">
                <div className="inline-flex items-center bg-white/40 rounded-full px-2.5 py-1 backdrop-blur-sm shadow-sm border border-indigo-100/50">
                  <Award className="h-3.5 w-3.5 mr-1 text-indigo-600" />
                  <span className="text-xs font-medium text-slate-700">10 competitors</span>
                </div>
                <div className="inline-flex items-center bg-white/40 rounded-full px-2.5 py-1 backdrop-blur-sm shadow-sm border border-indigo-100/50">
                  <TrendingUp className="h-3.5 w-3.5 mr-1 text-indigo-600" />
                  <span className="text-xs font-medium text-slate-700">Real market data</span>
                </div>
                <div className="inline-flex items-center bg-white/40 rounded-full px-2.5 py-1 backdrop-blur-sm shadow-sm border border-indigo-100/50">
                  <ArrowUp className="h-3.5 w-3.5 mr-1 text-indigo-600" />
                  <span className="text-xs font-medium text-slate-700">$100 starting cash</span>
                </div>
              </div>
            </div>
            
            {/* CTA Button */}
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg flex items-center"
              style={{
                boxShadow: "0 8px 20px -4px rgba(79, 70, 229, 0.4)"
              }}
            >
              <Trophy className="w-4 h-4 mr-2" />
              Compete Now
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}