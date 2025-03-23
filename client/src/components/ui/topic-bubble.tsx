import { motion } from "framer-motion";

interface TopicBubbleProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export default function TopicBubble({ label, selected, onClick }: TopicBubbleProps) {
  return (
    <motion.div
      className={`topic-bubble cursor-pointer ${
        selected 
          ? "bg-primary-100 text-primary-800" 
          : "bg-gray-100 text-gray-800"
      }`}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {label}
    </motion.div>
  );
}
