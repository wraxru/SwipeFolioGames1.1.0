import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select';
import { ArrowLeft, Building2, Briefcase, TrendingUp, Users } from 'lucide-react';
import { useLocation } from 'wouter';

const industries = [
  { id: 'tech', name: 'Technology', icon: '💻', color: 'from-blue-500 to-blue-600' },
  { id: 'finance', name: 'Financial Services', icon: '💰', color: 'from-green-500 to-green-600' },
  { id: 'healthcare', name: 'Healthcare', icon: '🏥', color: 'from-red-500 to-red-600' },
  { id: 'retail', name: 'Retail', icon: '🛍️', color: 'from-purple-500 to-purple-600' },
  { id: 'manufacturing', name: 'Manufacturing', icon: '🏭', color: 'from-orange-500 to-orange-600' },
  { id: 'energy', name: 'Energy', icon: '⚡', color: 'from-yellow-500 to-yellow-600' },
];

export function BoardRoom() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    playerName: '',
    companyName: '',
    industry: ''
  });
  const [selectedIndustry, setSelectedIndustry] = useState<typeof industries[0] | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'industry') {
      setSelectedIndustry(industries.find(i => i.id === value) || null);
    }
  };

  const handleSubmit = () => {
    if (formData.playerName && formData.companyName && formData.industry) {
      console.log('Starting game with:', formData);
    }
  };

  const isFormValid = formData.playerName && formData.companyName && formData.industry;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <Button
              variant="ghost"
              onClick={() => navigate('/games-hub')}
              className="text-gray-600 hover:text-gray-900 -ml-2 group"
            >
              <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
              Back to Games Hub
            </Button>
          </motion.div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Title Section */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <motion.div 
            className="inline-block bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg mb-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Building2 className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Board Room</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Take the helm as CEO and navigate your company through strategic decisions
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <motion.div 
            className="bg-white/80 backdrop-blur rounded-xl p-4 shadow-sm border border-gray-200/50"
            whileHover={{ y: -4, scale: 1.02 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Briefcase className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold">Strategic Planning</h3>
            </div>
            <p className="text-sm text-gray-600">Make critical decisions that shape your company's future</p>
          </motion.div>

          <motion.div 
            className="bg-white/80 backdrop-blur rounded-xl p-4 shadow-sm border border-gray-200/50"
            whileHover={{ y: -4, scale: 1.02 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-green-100 p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold">Market Analysis</h3>
            </div>
            <p className="text-sm text-gray-600">Navigate market trends and adapt your strategy</p>
          </motion.div>

          <motion.div 
            className="bg-white/80 backdrop-blur rounded-xl p-4 shadow-sm border border-gray-200/50"
            whileHover={{ y: -4, scale: 1.02 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold">Team Building</h3>
            </div>
            <p className="text-sm text-gray-600">Build and lead your executive team to success</p>
          </motion.div>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/90 backdrop-blur rounded-xl shadow-lg border border-gray-200/50 overflow-hidden"
        >
          {/* Form Header */}
          <div className={`bg-gradient-to-r ${selectedIndustry?.color || 'from-blue-500 to-blue-600'} px-6 py-5 transition-colors duration-500`}>
            <h2 className="text-xl font-bold text-white mb-1">Create Your Company</h2>
            <p className="text-sm text-white/80">Fill in the details to begin your journey</p>
          </div>

          {/* Form Content */}
          <div className="p-6">
            <div className="space-y-5">
              <motion.div whileHover={{ scale: 1.01 }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <Input
                  placeholder="Enter your name"
                  value={formData.playerName}
                  onChange={(e) => handleInputChange('playerName', e.target.value)}
                  className="w-full bg-white/50 border-gray-200 focus:ring-2 focus:ring-blue-500"
                />
              </motion.div>

              <motion.div whileHover={{ scale: 1.01 }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <Input
                  placeholder="Enter company name"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  className="w-full bg-white/50 border-gray-200 focus:ring-2 focus:ring-blue-500"
                />
              </motion.div>

              <motion.div whileHover={{ scale: 1.01 }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry
                </label>
                <Select
                  value={formData.industry}
                  onValueChange={(value) => handleInputChange('industry', value)}
                >
                  <SelectTrigger className="w-full bg-white/50 border-gray-200 focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder="Select an industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="p-2">
                      {industries.map((industry) => (
                        <SelectItem
                          key={industry.id}
                          value={industry.id}
                          className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors mb-1 last:mb-0"
                        >
                          <span className="text-2xl">{industry.icon}</span>
                          <span className="font-medium">{industry.name}</span>
                        </SelectItem>
                      ))}
                    </div>
                  </SelectContent>
                </Select>
              </motion.div>

              <motion.div
                whileHover={isFormValid ? { scale: 1.02 } : undefined}
                whileTap={isFormValid ? { scale: 0.98 } : undefined}
                className="pt-3"
              >
                <Button
                  className={`w-full h-12 text-base font-medium bg-gradient-to-r ${selectedIndustry?.color || 'from-blue-500 to-blue-600'} hover:from-blue-600 hover:to-blue-700 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300`}
                  onClick={handleSubmit}
                  disabled={!isFormValid}
                >
                  {isFormValid ? (
                    <motion.div 
                      className="flex items-center justify-center gap-2"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      Start Your Company
                      <span>→</span>
                    </motion.div>
                  ) : (
                    "Fill in all fields to continue"
                  )}
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
} 