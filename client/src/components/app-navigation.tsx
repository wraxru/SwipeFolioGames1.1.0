import { BookOpen, Home, TrendingUp, Trophy, User } from "lucide-react";
import { useLocation } from "wouter";

export default function AppNavigation() {
  const [location, setLocation] = useLocation();
  
  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <div className="app-navigation fixed bottom-0 left-0 right-0 z-20">
      <div className="flex items-center justify-around px-4 py-3">
        <NavItem 
          icon={<Home className="w-5 h-5" />} 
          label="Home" 
          isActive={isActive("/")}
          href="/"
        />
        
        <NavItem 
          icon={<BookOpen className="w-5 h-5" />} 
          label="Learn" 
          isActive={isActive("/learn")}
          href="/learn"
        />
        
        <NavItem 
          icon={<TrendingUp className="w-5 h-5" />} 
          label="Market" 
          isActive={isActive("/market")}
          href="/market"
        />
        
        <NavItem 
          icon={<Trophy className="w-5 h-5" />} 
          label="Achievements" 
          isActive={isActive("/achievements")}
          href="/achievements"
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
  
  return (
    <button 
      className="flex flex-col items-center justify-center"
      onClick={handleClick}
    >
      <div className={`${isActive ? 'text-cyan-400' : 'text-gray-500'}`}>
        {icon}
      </div>
      <span className={`text-xs mt-1 ${isActive ? 'text-cyan-400' : 'text-gray-500'}`}>
        {label}
      </span>
    </button>
  );
}