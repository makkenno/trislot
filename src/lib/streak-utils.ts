export function calculateStreak(logs: number[]): number {
  if (!logs || logs.length === 0) return 0;

  // Clone and sort logs just in case, descending order
  const sortedLogs = [...logs].sort((a, b) => b - a);

  // Normalize dates to midnight to ignore time
  const toDayString = (timestamp: number) => {
    const d = new Date(timestamp);
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  };

  const today = new Date();
  const todayStr = toDayString(today.getTime());

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const uniqueDays = new Set<string>();
  for (const log of sortedLogs) {
    uniqueDays.add(toDayString(log));
  }

  // Check if we have a streak alive (meaning we practiced today or yesterday)
  // If the last practice was before yesterday, streak is broken (0).
  // Exception: If we just practiced today (which is when we call this), it counts.

  // Note: We usually call this function AFTER pushing the new log.
  // So the latest log should be 'today'.

  let currentStreak = 0;
  const checkDate = new Date(today);

  // Check backwards from today
  while (true) {
    const checkStr = toDayString(checkDate.getTime());
    if (uniqueDays.has(checkStr)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      // If we don't have a log for 'today', maybe the streak ended yesterday?
      // But for the confetti purpose, we only care if we just extended the streak.
      // If we call this AFTER logging, 'today' must exist.
      // If we call it for display, and we haven't practiced today, we might want to check if yesterday exists.
      // For now, let's keep it simple: count consecutive days starting from today or yesterday.
      if (checkStr === todayStr && !uniqueDays.has(todayStr)) {
        // Haven't practiced today yet. Check if streak flows from yesterday.
        checkDate.setDate(checkDate.getDate() - 1);
        continue;
      }
      break;
    }
  }

  return currentStreak;
}
