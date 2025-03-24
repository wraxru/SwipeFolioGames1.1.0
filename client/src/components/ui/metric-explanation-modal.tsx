import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";

interface MetricExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  metricName: string;
  metricData: {
    calculation: string;
    comparison: string;
    meaning: string;
  };
  color: string;
  specificValues?: {
    [key: string]: string;
  };
}

export default function MetricExplanationModal({
  isOpen,
  onClose,
  metricName,
  metricData,
  color,
  specificValues
}: MetricExplanationModalProps) {
  if (!metricData) return null;
  
  // Color definitions
  const bgColor = color === 'green' ? 'bg-green-900/20' : 
                 color === 'yellow' ? 'bg-yellow-900/20' : 
                 'bg-red-900/20';
  
  const textColor = color === 'green' ? 'text-green-500' : 
                   color === 'yellow' ? 'text-yellow-500' : 
                   'text-red-500';
  
  const borderColor = color === 'green' ? 'border-green-800' : 
                     color === 'yellow' ? 'border-yellow-800' : 
                     'border-red-800';
  
  const iconBg = color === 'green' ? 'bg-green-900/50' : 
               color === 'yellow' ? 'bg-yellow-900/50' : 
               'bg-red-900/50';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-950 text-white border-gray-800 max-w-md mx-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl flex items-center gap-2">
              <span className={`${textColor} capitalize`}>{metricName}</span>
              <span className="text-sm font-normal text-gray-400">Explanation</span>
            </DialogTitle>
            <DialogClose className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-800">
              <X size={18} />
            </DialogClose>
          </div>
        </DialogHeader>
        
        <div className={`${bgColor} ${borderColor} border rounded-lg p-4 mt-2`}>
          <div className="space-y-4">
            {/* How it's calculated */}
            <div>
              <h3 className={`${textColor} font-semibold mb-1 flex items-center`}>
                <div className={`${iconBg} w-6 h-6 rounded-full flex items-center justify-center mr-2`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
                    <path d="M12 2v2" />
                    <path d="M12 14v8" />
                    <path d="m17 5-1.5 1.5" />
                    <path d="m6.5 6.5 1.5 1.5" />
                    <path d="M16 12h6" />
                    <path d="M2 12h6" />
                    <path d="m17 19-1.5-1.5" />
                    <path d="m6.5 17.5 1.5-1.5" />
                  </svg>
                </div>
                How It's Calculated
              </h3>
              <p className="text-gray-300 text-sm">{metricData.calculation}</p>
            </div>
            
            {/* Industry comparison */}
            <div>
              <h3 className={`${textColor} font-semibold mb-1 flex items-center`}>
                <div className={`${iconBg} w-6 h-6 rounded-full flex items-center justify-center mr-2`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                Industry Comparison
              </h3>
              <p className="text-gray-300 text-sm">{metricData.comparison}</p>
            </div>
            
            {/* What it means */}
            <div>
              <h3 className={`${textColor} font-semibold mb-1 flex items-center`}>
                <div className={`${iconBg} w-6 h-6 rounded-full flex items-center justify-center mr-2`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4" />
                    <path d="M12 8h.01" />
                  </svg>
                </div>
                What It Means
              </h3>
              <p className="text-gray-300 text-sm">{metricData.meaning}</p>
            </div>
          </div>
        </div>
        
        {/* Specific metric values section */}
        {specificValues && Object.keys(specificValues).length > 0 && (
          <div className="bg-gray-900/80 rounded-lg mt-2 border border-gray-800 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-800">
              <h3 className="font-semibold text-sm">Specific Metrics</h3>
            </div>
            <div className="divide-y divide-gray-800">
              {Object.entries(specificValues).map(([key, value]) => (
                <div key={key} className="px-4 py-2 flex justify-between items-center">
                  <span className="text-sm capitalize text-gray-400">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="text-sm font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="bg-gray-900/50 p-3 rounded-lg mt-2 border border-gray-800">
          <p className="text-xs text-gray-400">
            These metrics are based on both historical data and forward-looking indicators. They should be used as one of many tools in your investment research process.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}