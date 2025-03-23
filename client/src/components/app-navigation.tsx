import { useLocation } from "wouter";
import { Home, Compass, Award, User } from "lucide-react";

export default function AppNavigation() {
  const [location] = useLocation();
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t z-30">
      <div className="flex justify-around items-center h-16">
        <NavItem 
          icon={<Home className="w-5 h-5" />} 
          label="Home" 
          isActive={location === "/"} 
          href="/"
        />
        <NavItem 
          icon={<Compass className="w-5 h-5" />} 
          label="Discover" 
          isActive={location === "/discover"} 
          href="/discover"
        />
        <NavItem 
          icon={<Award className="w-5 h-5" />} 
          label="Badges" 
          isActive={location === "/badges"} 
          href="/badges"
        />
        <NavItem 
          icon={<User className="w-5 h-5" />} 
          label="Profile" 
          isActive={location === "/profile"} 
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
  
  return (
    <a 
      href={href}
      onClick={(e) => {
        e.preventDefault();
        setLocation(href);
      }}
      className={`flex flex-col items-center justify-center w-1/4 h-full transition-colors ${
        isActive ? "text-primary-500" : "text-gray-500 hover:text-primary-500"
      }`}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </a>
  );
}
