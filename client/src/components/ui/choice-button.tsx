import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface ChoiceButtonProps {
  title: string;
  description?: string;
  rightText?: string;
  selected: boolean;
  onClick: () => void;
  value?: string;
  correct?: boolean;
  incorrect?: boolean;
  disabled?: boolean;
  showFeedback?: boolean;
}

export default function ChoiceButton({
  title,
  description,
  rightText,
  selected,
  onClick,
  value,
  correct,
  incorrect,
  disabled = false,
  showFeedback = false,
}: ChoiceButtonProps) {
  const getStateClasses = () => {
    if (correct) return "border-green-400 bg-green-50";
    if (incorrect) return "border-red-400 bg-red-50";
    if (selected) return "border-primary-400 bg-primary-50";
    return "border-gray-300 hover:border-primary-400 hover:bg-primary-50";
  };
  
  return (
    <motion.button
      className={`choice-btn border rounded-lg p-4 w-full text-left transition duration-200 ease-in-out ${getStateClasses()}`}
      whileHover={{ y: disabled ? 0 : -2 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={disabled ? undefined : onClick}
      data-value={value}
      disabled={disabled}
    >
      <div className="flex justify-between items-center">
        <div>
          <span className="font-medium text-gray-800">{title}</span>
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
        
        {rightText && (
          <span className="text-sm text-gray-500">{rightText}</span>
        )}
        
        {selected && !showFeedback && (
          <div className="flex-shrink-0 ml-2">
            <Check className="h-5 w-5 text-primary-500" />
          </div>
        )}
        
        {showFeedback && correct && (
          <div className="flex-shrink-0 ml-2">
            <Check className="h-5 w-5 text-green-500" />
          </div>
        )}
      </div>
    </motion.button>
  );
}
