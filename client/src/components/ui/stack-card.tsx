import { motion } from "framer-motion";
import { Stack } from "@shared/schema";
import { Star } from "lucide-react";

interface StackCardProps {
  stack: Stack;
  onClick: (stackId: number) => void;
}

export default function StackCard({ stack, onClick }: StackCardProps) {
  return (
    <motion.div
      className="stack-card bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      onClick={() => onClick(stack.id)}
    >
      <div className={`h-24 bg-gradient-to-r ${stack.color} flex items-center justify-center`}>
        <i className={`ri-${stack.iconName} text-white text-3xl`}></i>
      </div>
      <div className="p-3">
        <h3 className="font-medium text-gray-800">{stack.title}</h3>
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-gray-500">{stack.cardCount} cards • {stack.estimatedMinutes} min</span>
          <div className="flex items-center">
            <Star className="text-accent-500 text-xs" size={12} fill="currentColor" />
            <span className="text-xs text-gray-500 ml-1">{(stack.rating / 10).toFixed(1)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
