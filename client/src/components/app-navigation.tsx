import { Home, BarChart3, Briefcase, User, Trophy } from "lucide-react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";

export default function AppNavigation() {
  const [location, setLocation] = useLocation();
  
  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <div className="app-navigation fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-100 shadow-lg">
      <div className="flex items-center justify-around px-4 py-2">
        <NavItem 
          icon={<Home className="w-5 h-5" />} 
          label="Home" 
          isActive={isActive("/")}
          href="/"
        />
        
        <NavItem 
          icon={<Trophy className="w-5 h-5" />} 
          label="Leaderboard" 
          isActive={isActive("/leaderboard")}
          href="/leaderboard"
        />
        
        <NavItem 
          icon={<BarChart3 className="w-5 h-5" />} 
          label="Markets" 
          isActive={isActive("/markets")}
          href="/markets"
        />
        
        <NavItem 
          icon={<Briefcase className="w-5 h-5" />} 
          label="Portfolio" 
          isActive={isActive("/portfolio")}
          href="/portfolio"
        />
        
        <NavItem 
          icon={<User className="w-5 h-5" />} 
          label="Profile" 
          isActive={isActive("/profile")}
          href="/profile"
        />
      </div>
    </div>
  );
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  href: string;
}

function NavItem({ icon, label, isActive, href }: NavItemProps) {
  const [_, setLocation] = useLocation();
  
  const handleClick = () => {
    setLocation(href);
  };
  
  // Define animation variants for tab indicators and icons
  const tabVariants = {
    active: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 15 }
    },
    inactive: {
      scale: 0.85,
      opacity: 0.7,
      transition: { duration: 0.2 }
    }
  };
  
  // Define glow effect for active tab
  const glowVariants = {
    active: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 }
    },
    inactive: {
      opacity: 0,
      scale: 0.5,
      transition: { duration: 0.3 }
    }
  };
  
  // Define animation for active indicator
  const indicatorVariants = {
    active: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    },
    inactive: {
      opacity: 0,
      y: 10,
      transition: { duration: 0.3 }
    }
  };
  
  return (
    <motion.button 
      className="flex flex-col items-center justify-center py-2 relative"
      onClick={handleClick}
      whileTap={{ scale: 0.95 }}
    >
      {/* Glow effect behind icon for active state */}
      <motion.div
        className="absolute w-9 h-9 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-md"
        initial="inactive"
        animate={isActive ? "active" : "inactive"}
        variants={glowVariants}
      />
      
      {/* Icon container */}
      <motion.div 
        className={`relative z-10 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`}
        initial="inactive"
        animate={isActive ? "active" : "inactive"}
        variants={tabVariants}
      >
        {icon}
      </motion.div>
      
      {/* Bottom pill indicator for active state */}
      <div className="h-[20px] relative">
        <motion.div 
          className="absolute inset-x-0 top-0 flex justify-center"
          initial="inactive"
          animate={isActive ? "active" : "inactive"}
          variants={indicatorVariants}
        >
          <div className="h-1 w-4 rounded-full bg-indigo-600" />
        </motion.div>
        
        {/* Label */}
        <span className={`text-xs font-medium ${isActive ? 'text-indigo-600' : 'text-slate-500'}`}>
          {label}
        </span>
      </div>
    </motion.button>
  );
}