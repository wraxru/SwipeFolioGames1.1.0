import { motion } from "framer-motion";
import { Trophy, ArrowRight, HomeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StackCompleteCardProps {
  stackName: string;
  xpEarned: number;
  onReturn: () => void;
  onViewMoreStacks?: () => void;
  industry: string;
}

export default function StackCompleteCard({
  stackName,
  xpEarned,
  onReturn,
  onViewMoreStacks,
  industry
}: StackCompleteCardProps) {
  // Set badge name based on the industry
  const getBadgeName = () => {
    switch (industry) {
      case "Technology":
        return "Tech Rookie";
      case "Investing":
        return "Investor Rookie";
      case "Cryptocurrency":
        return "Crypto Rookie";
      case "Real Estate":
        return "Property Rookie";
      case "Healthcare":
        return "Healthcare Rookie";
      default:
        return "Finance Rookie";
    }
  };
  
  // Get icon name based on the industry
  const getBadgeIcon = () => {
    switch (industry) {
      case "Technology":
        return "computer-line";
      case "Investing":
        return "line-chart-line";
      case "Cryptocurrency":
        return "coins-line";
      case "Real Estate":
        return "building-line";
      case "Healthcare":
        return "heart-pulse-line";
      default:
        return "bar-chart-box-line";
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md w-[85%] max-w-lg overflow-hidden">
      <div className="p-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-20 h-20 mx-auto bg-primary-100 rounded-full flex items-center justify-center mb-4"
        >
          <Trophy className="text-primary-500 text-4xl" />
        </motion.div>
        
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Stack Complete!</h3>
        <p className="text-gray-600 mb-4">You've earned {xpEarned} XP and unlocked a new badge.</p>
        
        <motion.div
          className="py-4 flex justify-center"
          initial={{ rotateY: -30, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ perspective: "1000px" }}
        >
          <div className="badge bg-gradient-to-br from-primary-500 to-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg transform transition-transform hover:rotate-y-12">
            <i className={`ri-${getBadgeIcon()} text-2xl`}></i>
          </div>
        </motion.div>
        
        <div className="my-4">
          <h4 className="font-medium text-gray-800">{getBadgeName()}</h4>
          <p className="text-sm text-gray-500">Completed your first {industry.toLowerCase()} stack</p>
        </div>
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="xp-animation bg-primary-50 text-primary-800 font-medium py-2 px-4 rounded-full inline-block mb-6"
        >
          +{xpEarned} XP
        </motion.div>
        
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={onViewMoreStacks}
            className="border gap-2"
          >
            <ArrowRight className="h-4 w-4" />
            <span>More Stacks</span>
          </Button>
          
          <Button
            onClick={onReturn}
            className="gap-2"
          >
            <HomeIcon className="h-4 w-4" />
            <span>Home</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
