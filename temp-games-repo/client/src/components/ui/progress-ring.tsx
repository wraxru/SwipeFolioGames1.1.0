import { useState, useEffect } from "react";

interface ProgressRingProps {
  progress: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
  className?: string;
  color?: string;
  bgColor?: string;
}

export default function ProgressRing({
  progress,
  size = 32,
  strokeWidth = 5,
  children,
  className = "",
  color = "currentColor text-primary-500",
  bgColor = "text-gray-200",
}: ProgressRingProps) {
  const [offset, setOffset] = useState(0);
  
  // Calculate the radius of the circle
  const radius = (size - strokeWidth) / 2;
  
  // Calculate the circumference of the circle
  const circumference = radius * 2 * Math.PI;
  
  useEffect(() => {
    // Calculate the offset based on the progress
    const progressOffset = circumference - (progress / 100) * circumference;
    setOffset(progressOffset);
  }, [circumference, progress]);
  
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg className={`w-${size} h-${size}`} width={size} height={size}>
        <circle
          className={bgColor}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={`progress-ring-circle ${color}`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            transform: "rotate(-90deg)",
            transformOrigin: "50% 50%",
            transition: "stroke-dashoffset 0.35s",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
