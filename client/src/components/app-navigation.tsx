import { useLocation } from "wouter";
import { Home, Search, BarChart2, Settings } from "lucide-react";

export default function AppNavigation() {
  const [location] = useLocation();
  
  return (
    <div className="fixed bottom-0 left-0 right-0 app-navigation z-30">
      <div className="flex justify-around items-center h-16">
        <NavItem 
          icon={<Home className="w-5 h-5" />} 
          label="Home" 
          isActive={location === "/"} 
          href="/"
        />
        <NavItem 
          icon={<Search className="w-5 h-5" />} 
          label="Search" 
          isActive={location === "/search"} 
          href="/search"
        />
        <NavItem 
          icon={
            <div className="bg-primary-400 rounded-full w-12 h-12 flex items-center justify-center -mt-5">
              <BarChart2 className="w-6 h-6 text-background" />
            </div>
          } 
          label="" 
          isActive={false} 
          href="/stats"
        />
        <NavItem 
          icon={<Settings className="w-5 h-5" />} 
          label="Settings" 
          isActive={location === "/settings"} 
          href="/settings"
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
  
  return (
    <a 
      href={href}
      onClick={(e) => {
        e.preventDefault();
        setLocation(href);
      }}
      className={`flex flex-col items-center justify-center w-1/4 h-full transition-colors ${
        isActive ? "text-cyan-400" : "text-gray-400 hover:text-cyan-400"
      }`}
    >
      {icon}
      {label && <span className="text-xs mt-1">{label}</span>}
    </a>
  );
}
