import { useMemo } from "react";

interface SkillHeatmapProps {
  logs: number[];
}

export function SkillHeatmap({ logs }: SkillHeatmapProps) {
  // Generate dates for the last 28 days (4 weeks)
  const days = useMemo(() => {
    const today = new Date();
    // Normalize today to start of day
    today.setHours(0, 0, 0, 0);

    const dates: { date: Date; count: number }[] = [];

    // We want to show 12 weeks (84 days) to make it look wider
    // 12 * 7 = 84
    for (let i = 83; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);

      const dayStart = d.getTime();
      const dayEnd = dayStart + 86400000;

      // Count logs for this day
      const count = logs
        ? logs.filter((l) => l >= dayStart && l < dayEnd).length
        : 0;

      dates.push({ date: d, count });
    }
    return dates;
  }, [logs]);

  // Determine intensity color
  const getIntensityClass = (count: number) => {
    if (count === 0) return "bg-muted";
    if (count <= 1) return "bg-green-200 dark:bg-green-900";
    if (count <= 2) return "bg-green-400 dark:bg-green-700";
    if (count <= 3) return "bg-green-600 dark:bg-green-500";
    return "bg-green-800 dark:bg-green-300";
  };

  // Format date for tooltip
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ja-JP", {
      month: "short",
      day: "numeric",
      weekday: "short",
    }).format(date);
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-end mb-1">
        <span className="text-[10px] text-muted-foreground">
          Recent Activity
        </span>
      </div>
      <div className="grid grid-flow-col grid-rows-7 gap-1 w-fit">
        {days.map((day) => (
          <div
            key={day.date.toISOString()}
            className={`w-3 h-3 rounded-sm ${getIntensityClass(day.count)}`}
            title={`${formatDate(day.date)}: ${day.count} practices`}
          />
        ))}
      </div>
    </div>
  );
}
