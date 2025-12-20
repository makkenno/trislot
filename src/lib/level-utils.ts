import { calculateStreak } from "./streak-utils";

/**
 * Calculates total XP based on practice logs.
 * - Base XP per practice: 10
 * - Streak Bonus: 100 XP * current streak
 * - Daily Bonus: 50 XP per unique day practiced (to encourage consistency)
 */
export function calculateXP(logs: number[]): number {
  if (!logs || logs.length === 0) return 0;

  // 1. Base XP: 10 per practice
  const baseXP = logs.length * 10;

  // 2. Streak Bonus: 100 * current streak
  // (Note: This rewards the current momentum heavily)
  const currentStreak = calculateStreak(logs);
  const streakBonus = currentStreak * 100;

  // 3. Consistency Bonus: 50 per unique day
  const uniqueDays = new Set<string>();
  for (const timestamp of logs) {
    const d = new Date(timestamp);
    const dayStr = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    uniqueDays.add(dayStr);
  }
  const consistencyBonus = uniqueDays.size * 50;

  return baseXP + streakBonus + consistencyBonus;
}

export interface LevelInfo {
  level: number;
  currentLevelXP: number; // XP earned in this level
  nextLevelXP: number; // XP needed to finish this level
  totalXP: number; // Total accumulated XP
  progress: number; // 0.0 to 1.0
}

/**
 * Calculates level info from total XP.
 * Formula: Required XP for Level L = 100 * (L^2)
 * Cumulative XP to reach Level L = Sum(100 * i^2) for i=1 to L-1
 *
 * Simplified for easier calculation:
 * Let's just say Total XP Required to reach Level L = 50 * (L-1)^2 * something?
 *
 * Let's stick to a simple iterative approach or a direct formula.
 * Level L requires `100 * L` XP to pass to L+1? Linear is too easy.
 *
 * Let's use: Total XP = 50 * (Level ^ 2)
 * Level = Sqrt(Total XP / 50)
 */
export function getLevelInfo(totalXP: number): LevelInfo {
  // Formula: Total XP = 100 * (Level^2)
  // Level = Sqrt(XP / 100)
  // Example:
  // 100 XP -> Lv 1 (Sqrt(1) = 1)
  // 400 XP -> Lv 2 (Sqrt(4) = 2)
  // 900 XP -> Lv 3 (Sqrt(9) = 3)
  // 10000 XP -> Lv 10

  // Base Level calculation
  // We want Level 1 to start at 0 XP.
  // Let's say:
  // Lv 1: 0 - 100 XP (Next Level at 100)
  // Lv 2: 100 - 400 XP (Next Level at 400)

  let level = Math.floor(Math.sqrt(totalXP / 100));
  // If XP < 100, level is 0. But we want to start at Level 1.
  level = Math.max(1, level);

  // Calculate boundaries for current level
  // The threshold to reach THIS level (Lv L) was 100 * L^2 ? No..

  // Let's redefine:
  // XP required to reach Level L+1 from 0 is: 100 * L^2
  // So if I have 150 XP:
  // 100 * 1^2 = 100 (Reached Lv 2)
  // 100 * 2^2 = 400 (Need 400 for Lv 3)
  // So I am Level 2.

  // Re-evaluating:
  // Sqrt(150 / 100) = Sqrt(1.5) = 1.22 -> Floor = 1.
  // If result is 1, it means I have passed the threshold for Level 1? No..

  // Let's treat formula as: XP Threshold for Level N = 100 * (N-1)^2
  // Lv 1 starts at 0. (100 * 0^2 = 0)
  // Lv 2 starts at 100. (100 * 1^2 = 100)
  // Lv 3 starts at 400. (100 * 2^2 = 400)

  level = Math.floor(Math.sqrt(totalXP / 100)) + 1;

  const startXP = 100 * (level - 1) ** 2;
  const nextXPThreshold = 100 * level ** 2;

  const currentLevelXP = totalXP - startXP;
  const nextLevelXP = nextXPThreshold - startXP;

  const progress = Math.min(1, Math.max(0, currentLevelXP / nextLevelXP));

  return {
    level,
    currentLevelXP,
    nextLevelXP,
    totalXP,
    progress,
  };
}
