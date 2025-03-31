import { pgTable, text, serial, integer, boolean, jsonb, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name").notNull(),
  xp: integer("xp").notNull().default(0),
  streakCount: integer("streak_count").notNull().default(0),
  lastActive: timestamp("last_active").notNull().default(new Date()),
  level: integer("level").notNull().default(1),
  dailyGoal: integer("daily_goal").notNull().default(3),
  interests: text("interests").array().notNull().default([]),
  experienceLevel: text("experience_level").notNull().default("beginner"),
  onboarded: boolean("onboarded").notNull().default(false)
});

export const stacks = pgTable("stacks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  cardCount: integer("card_count").notNull(),
  estimatedMinutes: integer("estimated_minutes").notNull(),
  industry: text("industry").notNull(),
  iconName: text("icon_name").notNull(),
  color: text("color").notNull(),
  difficulty: text("difficulty").notNull(), // beginner, intermediate, advanced
  rating: integer("rating").notNull().default(0),
});

export const cards = pgTable("cards", {
  id: serial("id").primaryKey(),
  stackId: integer("stack_id").notNull(),
  type: text("type").notNull(), // info, quiz, data-viz
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  content: jsonb("content").notNull(), // Stores the card content in JSON format
  order: integer("order").notNull(),
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  stackId: integer("stack_id").notNull(),
  completed: boolean("completed").notNull().default(false),
  currentCardIndex: integer("current_card_index").notNull().default(0),
  earnedXp: integer("earned_xp").notNull().default(0),
  lastAccessed: timestamp("last_accessed"),
});

export const userBadges = pgTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  badgeName: text("badge_name").notNull(),
  earnedOn: timestamp("earned_on").notNull().default(new Date()),
  badgeDescription: text("badge_description").notNull(),
  iconName: text("icon_name").notNull(),
});

export const userDailyProgress = pgTable("user_daily_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: timestamp("date").notNull().default(new Date()),
  lessonsCompleted: integer("lessons_completed").notNull().default(0),
  xpEarned: integer("xp_earned").notNull().default(0),
  goalCompleted: boolean("goal_completed").notNull().default(false),
});

export const stockCache = pgTable("stock_cache", {
  id: serial("id").primaryKey(),
  symbol: varchar("symbol", { length: 20 }).notNull().unique(),
  data: text("data").notNull(), // JSON string of the stock data
  updatedAt: timestamp("updated_at").notNull().default(new Date()),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  displayName: true,
}).extend({
  password: z.string().min(6, "Password must be at least 6 characters")
});

export const insertStackSchema = createInsertSchema(stacks).omit({
  id: true,
});

export const insertCardSchema = createInsertSchema(cards).omit({
  id: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
});

export const insertUserBadgeSchema = createInsertSchema(userBadges).omit({
  id: true,
});

export const insertUserDailyProgressSchema = createInsertSchema(userDailyProgress).omit({
  id: true,
});

export const insertStockCacheSchema = createInsertSchema(stockCache).omit({
  id: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Stack = typeof stacks.$inferSelect;
export type Card = typeof cards.$inferSelect;
export type UserProgress = typeof userProgress.$inferSelect;
export type UserBadge = typeof userBadges.$inferSelect;
export type UserDailyProgress = typeof userDailyProgress.$inferSelect;
export type StockCache = typeof stockCache.$inferSelect;
