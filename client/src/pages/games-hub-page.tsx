import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Building2, Timer, Ticket, ArrowRight } from 'lucide-react';

export default function GamesHubPage() {
  const gameCards = [
    {
      title: "Board Room Decisions",
      description: "Make strategic business decisions and see how they impact your company metrics.",
      icon: <Building2 className="w-10 h-10 text-blue-500" />,
      color: "from-blue-500 to-blue-600",
      link: "/games/board-room"
    },
    {
      title: "Metric Time Attack",
      description: "Test your financial metric knowledge against the clock. How many can you get right?",
      icon: <Timer className="w-10 h-10 text-green-500" />,
      color: "from-green-500 to-green-600",
      link: "/games/time-attack"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6 sm:py-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Games Hub</h1>
        <p className="text-gray-600 mb-6 sm:mb-8">Play financial games, earn tickets, and test your knowledge</p>
      </motion.div>

      <motion.div 
        className="flex items-center mb-6 sm:mb-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 sm:p-6 text-white"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <div className="mr-4">
          <Ticket className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-semibold mb-1">Earn Raffle Tickets</h2>
          <p className="text-sm sm:text-base text-purple-100">
            Win games to earn raffle tickets that can be redeemed for in-app rewards!
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {gameCards.map((game, index) => (
          <motion.div
            key={game.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
          >
            <Link href={game.link}>
              <a>
                <Card className="overflow-hidden h-full hover:shadow-md transition-shadow duration-200">
                  <div className={`bg-gradient-to-r ${game.color} p-4 sm:p-6 text-white`}>
                    {game.icon}
                    <h2 className="text-lg sm:text-xl font-semibold mt-3 mb-1">{game.title}</h2>
                  </div>
                  <div className="p-4 sm:p-6">
                    <p className="text-sm sm:text-base text-gray-600 mb-4">
                      {game.description}
                    </p>
                    <div className="flex items-center text-blue-600 font-medium">
                      <span>Play Now</span>
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </div>
                  </div>
                </Card>
              </a>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}