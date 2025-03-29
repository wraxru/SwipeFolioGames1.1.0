import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import axios from "axios";
export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

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

  // Ask AI endpoint
  app.post("/api/ai/ask-stock", async (req, res) => {
    try {
      console.log("Received AI request with body:", JSON.stringify(req.body, null, 2));
      const { userQuestion, stockContext } = req.body;
      
      if (!userQuestion || !stockContext) {
        console.error("Missing required fields in request:", req.body);
        return res.status(400).json({ 
          error: "Missing required fields", 
          message: "Both userQuestion and stockContext are required" 
        });
      }
      
      // Try to ensure we have the latest environment variable value
      const apiKey = process.env.OPENROUTER_API_KEY;
      console.log("Using OpenRouter API key (first 5 chars):", apiKey ? apiKey.substring(0, 5) + "..." : "undefined");
      
      if (!apiKey) {
        console.error("OpenRouter API key is missing");
        return res.status(500).json({ 
          error: "API key missing", 
          message: "OpenRouter API key is not configured" 
        });
      }
      
      // Construct the system prompt and user message
      const systemPrompt = "You are an educational assistant for the Swipefolio app. " +
        "Explain financial concepts related to the provided stock context simply. " +
        "DO NOT give financial advice, recommendations, or price predictions. " +
        "Answer based only on the context and general knowledge. " +
        "If asked for advice, state you cannot provide it.";
      
      // Build context string with stock information
      const contextString = `
        Stock Name: ${stockContext.name}
        Ticker: ${stockContext.ticker}
        ${stockContext.description ? `Description: ${stockContext.description}` : ''}
        ${stockContext.price ? `Current Price: $${stockContext.price}` : ''}
        ${stockContext.metrics && stockContext.metrics.performance ? `Performance Score: ${stockContext.metrics.performance}` : ''}
        ${stockContext.metrics && stockContext.metrics.value ? `Value Score: ${stockContext.metrics.value}` : ''}
        ${stockContext.industry ? `Industry: ${stockContext.industry}` : ''}
      `;
      
      const userMessage = `Context: ${contextString.trim()}\n\nQuestion: ${userQuestion}`;
      
      console.log("Making API call to OpenRouter with prompt:", userMessage);
      console.log("Using API key:", apiKey.substring(0, 5) + "..." + apiKey.substring(apiKey.length - 4));
      
      // Make the API call to OpenRouter following their documentation exactly
      const openRouterUrl = 'https://openrouter.ai/api/v1/chat/completions';
      const requestData = {
        model: "google/gemini-2.0-flash-lite-001", // Using correct model ID from documentation
        messages: [
          { role: "system", content: systemPrompt },
          { 
            role: "user", 
            content: [
              {
                type: "text",
                text: userMessage
              }
            ]
          }
        ]
      };
      
      // Ensure we're using the correct API key format
      const apiKeyValue = process.env.OPENROUTER_API_KEY;
      console.log("Sending request to OpenRouter with API key starting with:", 
        apiKeyValue ? apiKeyValue.substring(0, 8) + "..." : "undefined");
      
      // Following the example in the OpenRouter documentation exactly
      const response = await axios.post(
        openRouterUrl,
        requestData,
        {
          headers: {
            'Authorization': `Bearer ${apiKeyValue}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://swipefolio.replit.app', // Site URL for OpenRouter rankings
            'X-Title': 'Swipefolio Finance' // Site name for OpenRouter rankings
          }
        }
      );
      
      console.log("OpenRouter API response status:", response.status);
      console.log("OpenRouter API response data:", JSON.stringify(response.data, null, 2));
      
      // Extract the AI's response - handling both formats (string or array of content objects)
      if (response.data && response.data.choices && response.data.choices.length > 0) {
        let answer;
        const content = response.data.choices[0].message.content;
        
        // Handle different response formats
        if (typeof content === 'string') {
          answer = content;
        } else if (Array.isArray(content) && content.length > 0) {
          // Extract from content array structure (if API returns in this format)
          const textContents = content
            .filter(item => item.type === 'text')
            .map(item => item.text)
            .join('\n');
          answer = textContents || 'No text content found in response';
        } else {
          // Fallback - try to stringify the content if it's neither string nor array
          answer = JSON.stringify(content);
        }
        
        console.log("Successfully extracted answer:", answer.substring(0, 50) + "...");
        return res.json({ answer });
      } else {
        console.error("Invalid API response format:", response.data);
        return res.status(500).json({ 
          error: "Invalid API response", 
          message: "The AI service returned an unexpected response format",
          data: response.data
        });
      }
    } catch (error: any) {
      console.error("Error in AI request:", error);
      
      // Define the structure for our error response
      interface AIErrorResponse {
        error: string;
        message: string;
        details?: {
          status?: number;
          data?: any;
        };
      }
      
      let errorResponse: AIErrorResponse = { 
        error: "AI service error", 
        message: error instanceof Error ? error.message : "Unknown error occurred"
      };
      
      // Add more detailed error information if available
      if (error.response) {
        console.error("Error response status:", error.response.status);
        console.error("Error response data:", error.response.data);
        
        // Create a new custom error response with additional details
        errorResponse = {
          error: "AI service error", 
          message: error instanceof Error ? error.message : "Unknown error occurred",
          details: {
            status: error.response.status,
            data: error.response.data
          }
        };
      }
      
      return res.status(500).json(errorResponse);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
