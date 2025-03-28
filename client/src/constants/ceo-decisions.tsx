import { Building2, Users, DollarSign, Heart, Star, TrendingUp, LineChart, Briefcase, LucideIcon } from 'lucide-react';

interface Decision {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  options: {
    text: string;
    effects: {
      value?: number;
      employees?: number;
      revenue?: number;
      happiness?: number;
      innovation?: number;
      reputation?: number;
    };
  }[];
}

// Normal mode decisions - smaller impacts on company metrics
export const NORMAL_DECISIONS: Decision[] = [
  {
    title: "Team Building Event",
    description: "The HR department suggests organizing a team building event. How would you like to proceed?",
    icon: Users,
    iconColor: "text-blue-500",
    options: [
      {
        text: "Organize a company-wide event",
        effects: {
          happiness: 8,
          value: -3000,
          reputation: 4,
          innovation: 2
        }
      },
      {
        text: "Organize small department lunches",
        effects: {
          happiness: 5,
          value: -1000,
          reputation: 2
        }
      },
      {
        text: "Skip the event to save costs",
        effects: {
          happiness: -3,
          value: 1000,
          reputation: -1
        }
      }
    ]
  },
  {
    title: "Office Equipment Upgrade",
    description: "Some employees have requested new office equipment. What's your decision?",
    icon: Building2,
    iconColor: "text-purple-500",
    options: [
      {
        text: "Complete office modernization",
        effects: {
          happiness: 10,
          value: -5000,
          innovation: 5,
          reputation: 3
        }
      },
      {
        text: "Approve basic upgrades",
        effects: {
          happiness: 3,
          value: -2000,
          innovation: 2
        }
      },
      {
        text: "Maintain current equipment",
        effects: {
          happiness: -2,
          value: 1000,
          innovation: -1
        }
      }
    ]
  },
  {
    title: "Social Media Presence",
    description: "Marketing team suggests increasing our social media activity.",
    icon: TrendingUp,
    iconColor: "text-green-500",
    options: [
      {
        text: "Build dedicated social media team",
        effects: {
          value: -8000,
          revenue: 12000,
          reputation: 8,
          employees: 3,
          innovation: 4
        }
      },
      {
        text: "Hire a part-time social media manager",
        effects: {
          value: -3000,
          revenue: 5000,
          reputation: 3,
          employees: 1
        }
      },
      {
        text: "Use existing team members",
        effects: {
          revenue: 2000,
          happiness: -2,
          reputation: 1
        }
      }
    ]
  },
  {
    title: "Office Snacks",
    description: "Employees are requesting a stocked snack bar in the break room.",
    icon: Heart,
    iconColor: "text-red-500",
    options: [
      {
        text: "Create premium snack and coffee bar",
        effects: {
          happiness: 12,
          value: -3000,
          reputation: 4,
          innovation: 2
        }
      },
      {
        text: "Provide healthy snacks and drinks",
        effects: {
          happiness: 8,
          value: -1500,
          reputation: 2
        }
      },
      {
        text: "Keep basic coffee and water only",
        effects: {
          happiness: -4,
          value: 500
        }
      }
    ]
  },
  {
    title: "Weekly Schedule",
    description: "Team leads propose changing the weekly meeting schedule.",
    icon: Users,
    iconColor: "text-indigo-500",
    options: [
      {
        text: "Implement flexible work hours",
        effects: {
          innovation: 8,
          happiness: 10,
          revenue: -2000,
          reputation: 5
        }
      },
      {
        text: "Switch to async updates",
        effects: {
          innovation: 5,
          happiness: 6,
          revenue: -1000
        }
      },
      {
        text: "Keep current meeting schedule",
        effects: {
          happiness: -2,
          innovation: -3,
          revenue: 1000
        }
      }
    ]
  },
  {
    title: "Office Plants",
    description: "The office space feels a bit sterile. Consider adding some greenery?",
    icon: Building2,
    iconColor: "text-purple-500",
    options: [
      {
        text: "Add plants throughout the office",
        effects: {
          happiness: 4,
          value: -800,
          reputation: 2
        }
      },
      {
        text: "Keep current office layout",
        effects: {
          value: 500,
          happiness: -1
        }
      }
    ]
  },
  {
    title: "Casual Friday",
    description: "Employees request a casual dress code on Fridays.",
    icon: Users,
    iconColor: "text-blue-500",
    options: [
      {
        text: "Implement casual Fridays",
        effects: {
          happiness: 7,
          reputation: -2,
          innovation: 3
        }
      },
      {
        text: "Maintain professional dress code",
        effects: {
          happiness: -3,
          reputation: 2
        }
      }
    ]
  }
];

// Board Room mode decisions - major impacts on company metrics
export const BOARDROOM_DECISIONS: Decision[] = [
  {
    title: "Strategic Acquisition",
    description: "A competitor is available for acquisition. This could reshape the industry landscape.",
    icon: Building2,
    iconColor: "text-purple-600",
    options: [
      {
        text: "Pursue aggressive acquisition ($5M)",
        effects: {
          value: -5000000,
          employees: 50,
          revenue: 7500000,
          innovation: 25,
          reputation: 20
        }
      },
      {
        text: "Negotiate partial acquisition",
        effects: {
          value: -2500000,
          employees: 25,
          revenue: 4000000,
          innovation: 15,
          reputation: 10
        }
      },
      {
        text: "Develop internal capabilities",
        effects: {
          value: -1000000,
          employees: 10,
          innovation: 15,
          reputation: 5
        }
      }
    ]
  },
  {
    title: "Global Expansion",
    description: "Board proposes expanding into international markets. This is a pivotal moment for the company.",
    icon: LineChart,
    iconColor: "text-blue-600",
    options: [
      {
        text: "Launch full-scale global expansion",
        effects: {
          value: -3000000,
          employees: 30,
          revenue: 5000000,
          reputation: 30,
          innovation: 20
        }
      },
      {
        text: "Focus on key regional markets",
        effects: {
          value: -1500000,
          employees: 15,
          revenue: 2500000,
          reputation: 20,
          innovation: 10
        }
      },
      {
        text: "Start with limited market testing",
        effects: {
          value: -500000,
          employees: 5,
          revenue: 800000,
          reputation: 10
        }
      }
    ]
  },
  {
    title: "Revolutionary R&D Project",
    description: "Research team proposes a groundbreaking but risky innovation project.",
    icon: Star,
    iconColor: "text-yellow-500",
    options: [
      {
        text: "Invest heavily in breakthrough technology",
        effects: {
          value: -2500000,
          innovation: 40,
          reputation: 25,
          revenue: -1000000
        }
      },
      {
        text: "Balance innovation with stability",
        effects: {
          value: -1500000,
          innovation: 25,
          reputation: 15,
          revenue: -500000
        }
      },
      {
        text: "Focus on incremental improvements",
        effects: {
          value: -500000,
          innovation: 10,
          revenue: 500000
        }
      }
    ]
  },
  {
    title: "Major Restructuring",
    description: "Economic pressures require decisive action. This decision will define your legacy.",
    icon: Briefcase,
    iconColor: "text-orange-500",
    options: [
      {
        text: "Complete company reorganization",
        effects: {
          employees: -20,
          value: 2000000,
          happiness: -30,
          revenue: 3000000,
          innovation: 15
        }
      },
      {
        text: "Strategic department mergers",
        effects: {
          employees: -10,
          value: 1000000,
          happiness: -15,
          revenue: 1500000,
          innovation: 8
        }
      },
      {
        text: "Implement gradual changes",
        effects: {
          employees: -5,
          value: 500000,
          happiness: -10,
          revenue: 800000,
          innovation: 3
        }
      }
    ]
  },
  {
    title: "Industry-Changing Partnership",
    description: "A major tech giant proposes a strategic partnership that could transform both companies.",
    icon: DollarSign,
    iconColor: "text-green-600",
    options: [
      {
        text: "Form exclusive partnership",
        effects: {
          value: 4000000,
          innovation: 35,
          reputation: 40,
          revenue: 6000000
        }
      },
      {
        text: "Create limited joint venture",
        effects: {
          value: 2000000,
          innovation: 20,
          reputation: 25,
          revenue: 3000000
        }
      },
      {
        text: "Maintain independence",
        effects: {
          value: 500000,
          innovation: 5,
          reputation: -5
        }
      }
    ]
  }
]; 