import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { finnhubService } from "./finnhub-service";
import cron from 'node-cron';

// Common stock symbols to keep in cache
const COMMON_SYMBOLS = [
  // Tech stocks
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META',
  // Real Estate
  'AVB', 'O', 'PLD', 'SPG', 'AMT',
  // Healthcare
  'JNJ', 'PFE', 'UNH', 'ABBV', 'SYK'
];

// Initialize stock cache with common symbols
async function initializeStockCache() {
  try {
    log('Initializing stock cache for common symbols...');
    const result = await finnhubService.refreshCache(COMMON_SYMBOLS);
    log(`Cache initialization complete: ${result.success.length} succeeded, ${result.failures.length} failed`);
    
    if (result.failures.length > 0) {
      log(`Failed to cache: ${result.failures.join(', ')}`);
    }
  } catch (error) {
    log(`Error initializing stock cache: ${error}`);
  }
}

// Set up scheduled cache updates
function setupScheduledCacheUpdates() {
  // Run updates every day at 1:00 AM
  cron.schedule('0 1 * * *', async () => {
    try {
      log('Running scheduled stock cache update...');
      const result = await finnhubService.refreshCache(COMMON_SYMBOLS);
      log(`Cache update complete: ${result.success.length} succeeded, ${result.failures.length} failed`);
      
      if (result.failures.length > 0) {
        log(`Failed to update: ${result.failures.join(', ')}`);
      }
    } catch (error) {
      log(`Error in scheduled cache update: ${error}`);
    }
  });
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
    
    // Initialize cache for commonly used stock symbols
    initializeStockCache();
    
    // Schedule periodic cache updates
    setupScheduledCacheUpdates();
  });
})();
