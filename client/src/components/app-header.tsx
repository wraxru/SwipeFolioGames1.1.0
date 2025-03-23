import { Bell, Menu } from "lucide-react";

export default function AppHeader() {
  return (
    <div className="app-header fixed top-0 left-0 right-0 z-20">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <Menu className="w-5 h-5 text-gray-400" />
        </div>
        
        <div className="text-cyan-400 text-xl font-bold tracking-wider">
          Swipefolio
        </div>
        
        <div>
          <button className="bg-[#1d1d31] rounded-full p-2">
            <Bell className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
}