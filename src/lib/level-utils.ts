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
  // Formula: Total XP = 2.5 * (Level - 1) * (Level + 4)
  // Inverse: Level = (-3 + Sqrt(25 + 1.6 * TotalXP)) / 2
  //
  // New Thresholds (Gentle Growth):
  // Lv 1: 0
  // Lv 2: 15  (Gap: 15)
  // Lv 3: 35  (Gap: 20)
  // Lv 4: 60  (Gap: 25)
  // Lv 5: 90  (Gap: 30)
  // Lv 10: 315

  // Calculate Level from XP
  const level = Math.floor((-3 + Math.sqrt(25 + 1.6 * totalXP)) / 2);

  // Calculate Boundaries
  // Start XP for current level L
  const startXP = 2.5 * (level - 1) * (level + 4);
  
  // XP for next level L+1
  const nextLevel = level + 1;
  const nextXPThreshold = 2.5 * (nextLevel - 1) * (nextLevel + 4);

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
