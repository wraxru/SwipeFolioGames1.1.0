import React from 'react';
import { Brain, Heart, Building2, LineChart, Users, TrendingUp, Star } from 'lucide-react';
import type { Stock, Decision, MetricQuestion } from '@/types/game';

export const STOCK_TIERS = [
  { name: "Penny Stocks", minPrice: 0.05, maxPrice: 1, requiredLevel: 1 },
  { name: "Small Caps", minPrice: 1, maxPrice: 10, requiredLevel: 2 },
  { name: "Mid Caps", minPrice: 10, maxPrice: 50, requiredLevel: 3 },
  { name: "Large Caps", minPrice: 50, maxPrice: 200, requiredLevel: 5 },
  { name: "Blue Chips", minPrice: 200, maxPrice: 1000, requiredLevel: 8 },
  { name: "Tech Giants", minPrice: 1000, maxPrice: 10000, requiredLevel: 12 },
  { name: "Alien Tech", minPrice: 10000, maxPrice: 1000000, requiredLevel: 15 }
];

export const INITIAL_STOCKS: Stock[] = [
  // Tier 1 - Penny Stocks
  {
    id: 101,
    name: "MicroTech Solutions",
    symbol: "MCRO",
    price: 0.05,
    change: 0,
    marketCap: 100000,
    industry: "Technology",
    description: "Small tech startup with innovative software solutions.",
    tier: 1,
    volatility: 0.05
  },
  // Add more stocks as needed
];

export const DECISIONS: Decision[] = [
  {
    id: 1,
    title: "Basic Financial Planning",
    description: "Your CFO suggests implementing basic financial planning tools. (Level 1 Finance Tip: Budgeting is the foundation of financial success)",
    options: [
      {
        text: "Implement budgeting software",
        effects: { 
          value: -5000,
          revenue: 2000,
          innovation: 8,
          happiness: -5
        }
      },
      // Add more options
    ],
    icon: <Brain className="w-6 h-6 text-purple-500" />
  },
  // Add more decisions
];

export const METRIC_QUESTIONS: MetricQuestion[] = [
  {
    id: 1,
    metric: "Revenue Growth",
    explanation: "Revenue growth measures the percentage increase in a company's revenue over a specific period. A higher growth rate indicates strong business performance and market demand.",
    companyValue: 15.5,
    industryAverage: 8.2,
    isGood: true
  },
  {
    id: 2,
    metric: "Operating Margin",
    explanation: "Operating margin shows the percentage of revenue that remains after covering operating expenses. A higher margin indicates better efficiency and profitability.",
    companyValue: 12.3,
    industryAverage: 18.5,
    isGood: false
  },
  {
    id: 3,
    metric: "Customer Acquisition Cost (CAC)",
    explanation: "CAC measures the cost of acquiring a new customer. A lower CAC relative to industry average indicates more efficient marketing and sales processes.",
    companyValue: 45,
    industryAverage: 65,
    isGood: true
  },
  {
    id: 4,
    metric: "Employee Turnover Rate",
    explanation: "Employee turnover rate shows the percentage of employees who leave the company within a year. A higher rate than industry average suggests potential workplace issues.",
    companyValue: 25,
    industryAverage: 15,
    isGood: false
  },
  {
    id: 5,
    metric: "Research & Development Investment",
    explanation: "R&D investment as a percentage of revenue indicates a company's commitment to innovation. Higher investment than industry average often leads to future growth.",
    companyValue: 8.5,
    industryAverage: 5.2,
    isGood: true
  },
  {
    id: 6,
    metric: "Debt-to-Equity Ratio",
    explanation: "This ratio compares a company's total debt to its shareholder equity. A higher ratio than industry average indicates more financial risk.",
    companyValue: 2.8,
    industryAverage: 1.5,
    isGood: false
  },
  {
    id: 7,
    metric: "Customer Satisfaction Score",
    explanation: "Customer satisfaction measures how happy customers are with the company's products or services. A higher score than industry average indicates better customer service.",
    companyValue: 92,
    industryAverage: 85,
    isGood: true
  },
  {
    id: 8,
    metric: "Inventory Turnover",
    explanation: "Inventory turnover shows how quickly a company sells its inventory. A lower rate than industry average might indicate poor inventory management.",
    companyValue: 3.2,
    industryAverage: 4.5,
    isGood: false
  },
  {
    id: 9,
    metric: "Market Share Growth",
    explanation: "Market share growth indicates how much a company's market presence is expanding. Higher growth than industry average suggests competitive advantage.",
    companyValue: 2.5,
    industryAverage: 1.8,
    isGood: true
  },
  {
    id: 10,
    metric: "Return on Investment (ROI)",
    explanation: "ROI measures the efficiency of an investment. A higher ROI than industry average indicates better use of capital.",
    companyValue: 18.3,
    industryAverage: 22.5,
    isGood: false
  },
  {
    id: 11,
    metric: "Digital Transformation Progress",
    explanation: "This metric measures how well a company is adopting digital technologies. Higher progress than industry average suggests better future readiness.",
    companyValue: 75,
    industryAverage: 60,
    isGood: true
  },
  {
    id: 12,
    metric: "Carbon Footprint",
    explanation: "Carbon footprint measures environmental impact. A higher footprint than industry average indicates poor environmental practices.",
    companyValue: 1200,
    industryAverage: 800,
    isGood: false
  },
  {
    id: 13,
    metric: "Product Quality Score",
    explanation: "Product quality score measures the reliability and performance of products. A higher score than industry average indicates better product quality.",
    companyValue: 94,
    industryAverage: 88,
    isGood: true
  },
  {
    id: 14,
    metric: "Supply Chain Efficiency",
    explanation: "Supply chain efficiency measures how well a company manages its supply chain. A lower efficiency score than industry average suggests operational issues.",
    companyValue: 65,
    industryAverage: 75,
    isGood: false
  },
  {
    id: 15,
    metric: "Brand Recognition",
    explanation: "Brand recognition measures how well-known a company's brand is. Higher recognition than industry average indicates stronger market presence.",
    companyValue: 82,
    industryAverage: 70,
    isGood: true
  },
  {
    id: 16,
    metric: "Employee Training Investment",
    explanation: "Training investment per employee shows commitment to workforce development. Higher investment than industry average indicates better employee growth opportunities.",
    companyValue: 2500,
    industryAverage: 1800,
    isGood: true
  },
  {
    id: 17,
    metric: "Customer Churn Rate",
    explanation: "Customer churn rate shows the percentage of customers who stop using a company's products. A higher rate than industry average indicates customer retention issues.",
    companyValue: 8.5,
    industryAverage: 5.2,
    isGood: false
  },
  {
    id: 18,
    metric: "Patent Portfolio Growth",
    explanation: "Patent portfolio growth indicates innovation and intellectual property development. Higher growth than industry average suggests stronger innovation capabilities.",
    companyValue: 12,
    industryAverage: 8,
    isGood: true
  },
  {
    id: 19,
    metric: "Energy Efficiency",
    explanation: "Energy efficiency measures how well a company uses energy resources. Lower efficiency than industry average indicates poor resource management.",
    companyValue: 65,
    industryAverage: 75,
    isGood: false
  },
  {
    id: 20,
    metric: "Social Media Engagement",
    explanation: "Social media engagement shows how well a company connects with its audience. Higher engagement than industry average indicates better brand interaction.",
    companyValue: 4.8,
    industryAverage: 3.2,
    isGood: true
  },
  {
    id: 21,
    metric: "Product Return Rate",
    explanation: "Product return rate indicates customer satisfaction with products. A higher rate than industry average suggests quality issues.",
    companyValue: 5.5,
    industryAverage: 3.8,
    isGood: false
  },
  {
    id: 22,
    metric: "Employee Diversity Score",
    explanation: "Diversity score measures workforce representation across different demographics. Higher score than industry average indicates better inclusivity.",
    companyValue: 85,
    industryAverage: 70,
    isGood: true
  },
  {
    id: 23,
    metric: "Cybersecurity Rating",
    explanation: "Cybersecurity rating measures protection against digital threats. Lower rating than industry average indicates security vulnerabilities.",
    companyValue: 75,
    industryAverage: 85,
    isGood: false
  },
  {
    id: 24,
    metric: "Market Response Time",
    explanation: "Market response time shows how quickly a company adapts to market changes. Faster response than industry average indicates better agility.",
    companyValue: 2.5,
    industryAverage: 3.8,
    isGood: true
  },
  {
    id: 25,
    metric: "Customer Support Resolution Time",
    explanation: "Support resolution time measures customer service efficiency. Longer resolution time than industry average indicates poor customer service.",
    companyValue: 48,
    industryAverage: 36,
    isGood: false
  },
  {
    id: 26,
    metric: "Innovation Pipeline Strength",
    explanation: "Innovation pipeline strength shows potential future products and services. Stronger pipeline than industry average indicates better future growth potential.",
    companyValue: 85,
    industryAverage: 70,
    isGood: true
  },
  {
    id: 27,
    metric: "Employee Burnout Rate",
    explanation: "Employee burnout rate indicates workplace stress levels. Higher rate than industry average suggests poor work-life balance.",
    companyValue: 25,
    industryAverage: 15,
    isGood: false
  },
  {
    id: 28,
    metric: "Brand Loyalty Score",
    explanation: "Brand loyalty measures customer commitment to the brand. Higher score than industry average indicates stronger customer relationships.",
    companyValue: 88,
    industryAverage: 75,
    isGood: true
  },
  {
    id: 29,
    metric: "Regulatory Compliance Rate",
    explanation: "Regulatory compliance rate shows adherence to industry regulations. Lower rate than industry average indicates potential legal risks.",
    companyValue: 92,
    industryAverage: 95,
    isGood: false
  },
  {
    id: 30,
    metric: "Market Expansion Rate",
    explanation: "Market expansion rate measures growth into new markets. Higher rate than industry average indicates successful geographic expansion.",
    companyValue: 15,
    industryAverage: 10,
    isGood: true
  }
];

export const GAME_CONSTANTS = {
  SAVE_KEY: "market_adventure_save",
  AUTO_SAVE_INTERVAL: 60000,
  XP_PER_LEVEL: 100,
  INITIAL_MONEY: 1,
  TICKETS_PER_10_CORRECT: 1,
  GAME_TIME_LIMIT: 60,
  QUESTIONS_PER_GAME: 10 // Number of questions shown per game
}; 