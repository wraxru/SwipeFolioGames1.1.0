export interface Decision {
  scenario: string;
  context: string;
  optionA: {
    text: string;
    impacts: {
      metric: string;
      value: number;
      explanation: string;
    }[];
  };
  optionB: {
    text: string;
    impacts: {
      metric: string;
      value: number;
      explanation: string;
    }[];
  };
}

export const BOARD_ROOM_DECISIONS: Decision[] = [
  {
    scenario: "Market Expansion Strategy",
    context: "Your company has the opportunity to expand. You must choose between two strategic paths.",
    optionA: {
      text: "Expand into emerging markets with lower-cost products",
      impacts: [
        {
          metric: "Market Share",
          value: 15,
          explanation: "Potential for rapid market share growth in developing regions"
        },
        {
          metric: "Profit Margin",
          value: -5,
          explanation: "Lower margins due to reduced pricing"
        }
      ]
    },
    optionB: {
      text: "Focus on premium products in established markets",
      impacts: [
        {
          metric: "Brand Value",
          value: 20,
          explanation: "Enhanced brand perception in mature markets"
        },
        {
          metric: "Revenue Growth",
          value: 8,
          explanation: "Steady but slower growth with higher-margin products"
        }
      ]
    }
  },
  {
    scenario: "Innovation Investment",
    context: "R&D has proposed two major innovation projects. You need to decide which path to pursue.",
    optionA: {
      text: "Invest heavily in breakthrough technology research",
      impacts: [
        {
          metric: "Brand Value",
          value: 25,
          explanation: "Position as industry innovator"
        },
        {
          metric: "Profit Margin",
          value: -10,
          explanation: "High research costs impact short-term profits"
        }
      ]
    },
    optionB: {
      text: "Focus on incremental improvements to existing products",
      impacts: [
        {
          metric: "Revenue Growth",
          value: 12,
          explanation: "Quick returns from enhanced product lines"
        },
        {
          metric: "Market Share",
          value: 5,
          explanation: "Moderate market share growth from improved offerings"
        }
      ]
    }
  },
  {
    scenario: "Talent Management Crisis",
    context: "Employee satisfaction is dropping. You need to address the situation.",
    optionA: {
      text: "Implement comprehensive benefits package and flexible work policies",
      impacts: [
        {
          metric: "Profit Margin",
          value: -8,
          explanation: "Increased operational costs"
        },
        {
          metric: "Brand Value",
          value: 15,
          explanation: "Enhanced employer brand and company culture"
        }
      ]
    },
    optionB: {
      text: "Focus on performance-based bonuses and career development",
      impacts: [
        {
          metric: "Revenue Growth",
          value: 15,
          explanation: "Increased productivity and innovation"
        },
        {
          metric: "Market Share",
          value: -5,
          explanation: "Some talent loss to competitors"
        }
      ]
    }
  },
  {
    scenario: "Digital Transformation",
    context: "The industry is rapidly digitalizing. You must choose your company's approach.",
    optionA: {
      text: "Complete digital overhaul of all systems and processes",
      impacts: [
        {
          metric: "Revenue Growth",
          value: 20,
          explanation: "Long-term efficiency gains and new digital revenue streams"
        },
        {
          metric: "Profit Margin",
          value: -15,
          explanation: "Significant implementation costs"
        }
      ]
    },
    optionB: {
      text: "Gradual digital adoption focusing on customer-facing systems",
      impacts: [
        {
          metric: "Market Share",
          value: 10,
          explanation: "Improved customer experience and retention"
        },
        {
          metric: "Brand Value",
          value: 5,
          explanation: "Perceived as moderately progressive"
        }
      ]
    }
  },
  {
    scenario: "Sustainability Initiative",
    context: "Stakeholders are demanding stronger environmental commitments.",
    optionA: {
      text: "Implement comprehensive sustainability program",
      impacts: [
        {
          metric: "Brand Value",
          value: 30,
          explanation: "Strong positive impact on brand reputation"
        },
        {
          metric: "Profit Margin",
          value: -12,
          explanation: "High implementation costs"
        }
      ]
    },
    optionB: {
      text: "Focus on cost-effective green initiatives",
      impacts: [
        {
          metric: "Market Share",
          value: 8,
          explanation: "Moderate appeal to environmentally conscious consumers"
        },
        {
          metric: "Revenue Growth",
          value: 5,
          explanation: "Slight growth from eco-friendly products"
        }
      ]
    }
  }
]; 