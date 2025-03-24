import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import realtimeStocksRouter from "./api/realtime-stocks";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);
  
  // Register real-time stock data routes
  app.use("/api/stocks", realtimeStocksRouter);

  // Get all stacks
  app.get("/api/stacks", async (req, res) => {
    const stacks = await storage.getStacks();
    res.json(stacks);
  });

  // Get stack by ID
  app.get("/api/stacks/:id", async (req, res) => {
    const stackId = parseInt(req.params.id);
    const stack = await storage.getStackById(stackId);
    
    if (!stack) {
      return res.status(404).json({ message: "Stack not found" });
    }
    
    res.json(stack);
  });

  // Get cards by stack ID
  app.get("/api/stacks/:id/cards", async (req, res) => {
    const stackId = parseInt(req.params.id);
    const cards = await storage.getCardsByStackId(stackId);
    res.json(cards);
  });

  // Protected routes - require authentication
  app.use("/api/user-progress", (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  });

  // Get user progress for all stacks
  app.get("/api/user-progress", async (req, res) => {
    const userId = req.user!.id;
    const progress = await storage.getUserProgressByUserId(userId);
    res.json(progress);
  });

  // Get user progress for a specific stack
  app.get("/api/user-progress/:stackId", async (req, res) => {
    const userId = req.user!.id;
    const stackId = parseInt(req.params.stackId);
    
    const progress = await storage.getUserProgressByStackId(userId, stackId);
    
    if (!progress) {
      // If no progress exists, create a new one
      const newProgress = await storage.createUserProgress({
        userId,
        stackId,
        completed: false,
        currentCardIndex: 0,
        earnedXp: 0,
        lastAccessed: new Date()
      });
      return res.json(newProgress);
    }
    
    res.json(progress);
  });

  // Update user progress for a stack
  app.patch("/api/user-progress/:stackId", async (req, res) => {
    const userId = req.user!.id;
    const stackId = parseInt(req.params.stackId);
    
    const { currentCardIndex, completed, earnedXp } = req.body;
    let progress = await storage.getUserProgressByStackId(userId, stackId);
    
    if (!progress) {
      // If no progress exists, create a new one
      progress = await storage.createUserProgress({
        userId,
        stackId,
        completed: completed || false,
        currentCardIndex: currentCardIndex || 0,
        earnedXp: earnedXp || 0,
        lastAccessed: new Date()
      });
    } else {
      // Update existing progress
      progress = await storage.updateUserProgress(progress.id, {
        currentCardIndex: currentCardIndex !== undefined ? currentCardIndex : progress.currentCardIndex,
        completed: completed !== undefined ? completed : progress.completed,
        earnedXp: earnedXp !== undefined ? earnedXp : progress.earnedXp,
        lastAccessed: new Date()
      });
    }
    
    // If a lesson was completed, update daily progress
    if (completed && !progress?.completed) {
      // Check if user has daily progress for today
      const today = new Date();
      let dailyProgress = await storage.getUserDailyProgress(userId, today);
      
      if (!dailyProgress) {
        // Create new daily progress
        dailyProgress = await storage.createUserDailyProgress({
          userId,
          date: today,
          lessonsCompleted: 1,
          xpEarned: earnedXp || 0,
          goalCompleted: false
        });
      } else {
        // Update existing daily progress
        const newLessonsCompleted = dailyProgress.lessonsCompleted + 1;
        const newXpEarned = dailyProgress.xpEarned + (earnedXp || 0);
        const newGoalCompleted = newLessonsCompleted >= req.user!.dailyGoal;
        
        dailyProgress = await storage.updateUserDailyProgress(dailyProgress.id, {
          lessonsCompleted: newLessonsCompleted,
          xpEarned: newXpEarned,
          goalCompleted: newGoalCompleted
        });
      }
      
      // Update user XP
      const user = await storage.updateUser(userId, {
        xp: req.user!.xp + (earnedXp || 0)
      });
      
      // Check if a badge should be awarded (for the tech rookie badge)
      if (stackId === 1) {
        const existingBadges = await storage.getUserBadges(userId);
        const hasTechRookie = existingBadges.some(b => b.badgeName === "Tech Rookie");
        
        if (!hasTechRookie) {
          await storage.createUserBadge({
            userId,
            badgeName: "Tech Rookie",
            badgeDescription: "Completed your first tech industry stack",
            iconName: "computer-line",
            earnedOn: new Date()
          });
        }
      }
    }
    
    res.json(progress);
  });

  // Get user badges
  app.get("/api/user-badges", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const userId = req.user!.id;
    const badges = await storage.getUserBadges(userId);
    res.json(badges);
  });

  // Get user daily progress
  app.get("/api/user-daily-progress", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const userId = req.user!.id;
    const today = new Date();
    let dailyProgress = await storage.getUserDailyProgress(userId, today);
    
    if (!dailyProgress) {
      dailyProgress = await storage.createUserDailyProgress({
        userId,
        date: today,
        lessonsCompleted: 0,
        xpEarned: 0,
        goalCompleted: false
      });
    }
    
    res.json(dailyProgress);
  });

  const httpServer = createServer(app);
  return httpServer;
}
