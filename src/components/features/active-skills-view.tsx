import { Archive, CheckCircle2, ThumbsUp, Trash2, Trophy } from "lucide-react";
import { useState } from "react";
import {
  triggerBigConfetti,
  triggerSmallConfetti,
} from "../../lib/confetti-utils";
import { calculateStreak } from "../../lib/streak-utils";
import { useSkillStore } from "../../stores/skill-store";
import type { ActiveSkill } from "../../types/skill";
import { ConfirmDialog } from "../common/confirm-dialog";
import { SkillHeatmap } from "./skill-heatmap";

type Rank = "入門" | "初級" | "中級" | "上級" | "達人" | "伝説";

function getRank(p: number): Rank {
  if (p === 100) return "伝説";
  if (p >= 80) return "達人";
  if (p >= 60) return "上級";
  if (p >= 40) return "中級";
  if (p >= 20) return "初級";
  return "入門";
}

function getRankStyles(rank: Rank) {
  switch (rank) {
    case "伝説":
      return {
        border: "border-blue-900",
        shadow: "shadow-lg shadow-blue-900/20",
        badge: "bg-blue-900 text-blue-50 dark:bg-blue-900 dark:text-blue-50",
        slider: "accent-blue-900",
      };
    case "達人":
      return {
        border: "border-blue-700",
        shadow: "shadow-md shadow-blue-700/10",
        badge: "bg-blue-700 text-blue-50 dark:bg-blue-700 dark:text-blue-50",
        slider: "accent-blue-700",
      };
    case "上級":
      return {
        border: "border-blue-600",
        shadow: "shadow-md shadow-blue-600/10",
        badge: "bg-blue-600 text-blue-50 dark:bg-blue-600 dark:text-blue-50",
        slider: "accent-blue-600",
      };
    case "中級":
      return {
        border: "border-blue-500",
        shadow: "shadow-sm shadow-blue-500/10",
        badge: "bg-blue-500 text-blue-50 dark:bg-blue-500 dark:text-blue-50",
        slider: "accent-blue-500",
      };
    case "初級":
      return {
        border: "border-blue-400",
        shadow: "shadow-sm shadow-blue-400/10",
        badge: "bg-blue-400 text-white dark:bg-blue-400 dark:text-white",
        slider: "accent-blue-400",
      };
    default:
      return {
        border: "border-blue-200",
        shadow: "shadow-sm",
        badge: "bg-blue-100 text-blue-700",
        slider: "accent-blue-200",
      };
  }
}

export function ActiveSkillsView() {
  const {
    activeSkills,
    updateActiveSkill,
    moveToBacklog,
    moveToHistory,
    deleteActiveSkill,
    logPractice,
  } = useSkillStore();
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    itemId: string | null;
    type: "delete" | "master" | "backlog" | null;
  }>({
    isOpen: false,
    itemId: null,
    type: null,
  });

  const handleConfirm = () => {
    if (confirmState.itemId && confirmState.type) {
      if (confirmState.type === "delete") {
        deleteActiveSkill(confirmState.itemId);
      } else if (confirmState.type === "backlog") {
        moveToBacklog(confirmState.itemId);
      } else if (confirmState.type === "master") {
        moveToHistory(confirmState.itemId);
      }
      setConfirmState({ isOpen: false, itemId: null, type: null });
    }
  };

  const handleCancel = () => {
    setConfirmState({ isOpen: false, itemId: null, type: null });
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">現在習得中</h2>
        <p className="text-muted-foreground">
          意識して実践するスキルです。確実に習得するために最大3つまでに絞っています。
        </p>
      </div>

      <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {activeSkills.length === 0 ? (
          <div className="md:col-span-2 lg:col-span-3 text-center py-12 text-muted-foreground border-2 border-dashed border-muted rounded-lg">
            習得中のスキルはありません。やりたいことリストから選びましょう！
          </div>
        ) : (
          activeSkills.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              onUpdate={updateActiveSkill}
              onMoveToBacklog={(id) =>
                setConfirmState({ isOpen: true, itemId: id, type: "backlog" })
              }
              onDelete={(id) =>
                setConfirmState({ isOpen: true, itemId: id, type: "delete" })
              }
              onMaster={(id) =>
                setConfirmState({ isOpen: true, itemId: id, type: "master" })
              }
              onLogPractice={logPractice}
            />
          ))
        )}
      </div>

      <ConfirmDialog
        isOpen={confirmState.isOpen}
        title={
          confirmState.type === "master"
            ? "習得完了の確認"
            : confirmState.type === "backlog"
              ? "リストに戻す"
              : "削除の確認"
        }
        message={
          confirmState.type === "master"
            ? "このスキルを習得完了にしますか？（習得済みリストに移動します）"
            : confirmState.type === "backlog"
              ? "このスキルをやりたいことリストに戻しますか？"
              : "このスキルを習得中リストから削除しますか？"
        }
        confirmLabel={
          confirmState.type === "master"
            ? "完了"
            : confirmState.type === "backlog"
              ? "戻す"
              : "削除"
        }
        isDestructive={confirmState.type === "delete"}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}

interface SkillCardProps {
  skill: ActiveSkill;
  onUpdate: (id: string, updates: Partial<ActiveSkill>) => void;
  onMoveToBacklog: (id: string) => void;
  onDelete: (id: string) => void;
  onMaster: (id: string) => void;
  onLogPractice: (id: string) => void;
}

function SkillCard({
  skill,
  onUpdate,
  onMoveToBacklog,
  onDelete,
  onMaster,
  onLogPractice,
}: SkillCardProps) {
  const rank = getRank(skill.proficiency);
  const styles = getRankStyles(rank);

  const getProgressColor = (r: Rank) => {
    switch (r) {
      case "伝説":
        return "#1e3a8a"; // blue-900
      case "達人":
        return "#1d4ed8"; // blue-700
      case "上級":
        return "#2563eb"; // blue-600
      case "中級":
        return "#3b82f6"; // blue-500
      case "初級":
        return "#60a5fa"; // blue-400
      default:
        return "#bfdbfe"; // blue-200
    }
  };

  const getTrackColor = (r: Rank) => {
    switch (r) {
      case "伝説":
      case "達人":
      case "上級":
        return "#dbeafe"; // blue-100
      case "中級":
      case "初級":
        return "#eff6ff"; // blue-50
      default:
        return "#f0f9ff"; // sky-50
    }
  };

  const progressColor = getProgressColor(rank);
  const trackColor = getTrackColor(rank);

  const handleLogPractice = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Get button position for confetti origin
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    // Trigger action
    onLogPractice(skill.id);

    // Immediate feedback
    triggerSmallConfetti({ x, y });

    // Check for milestones with optimistic update
    const newLogs = [...(skill.practiceLogs || []), Date.now()];
    const streak = calculateStreak(newLogs);

    // Celebrate streaks (3 days, 7 days, etc.)
    if (streak > 0 && (streak % 7 === 0 || streak === 3)) {
      setTimeout(() => {
        triggerBigConfetti();
      }, 300);
    }
  };

  return (
    <div
      className={`rounded-xl border bg-card flex flex-col overflow-hidden transition-all duration-300 ${styles.border} ${styles.shadow}`}
    >
      <div className="p-3 md:p-4 border-b border-border bg-muted/30">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg leading-tight">
              {skill.title}
            </h3>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${styles.badge}`}
            >
              {rank === "伝説" && <Trophy className="w-3 h-3" />}
              {rank}
            </span>
          </div>
          <div className="flex -mr-2 -mt-2">
            <button
              type="button"
              onClick={() => onMoveToBacklog(skill.id)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              title="リストに戻す"
            >
              <Archive className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(skill.id)}
              className="p-2 text-muted-foreground hover:text-destructive transition-colors"
              title="諦める / 削除"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-3 md:p-4 space-y-4 flex-1">
        <div className="space-y-1.5">
          <label
            htmlFor={`context-${skill.id}`}
            className="text-xs font-medium text-muted-foreground uppercase"
          >
            実践する場面 (いつ)
          </label>
          <textarea
            id={`context-${skill.id}`}
            value={skill.context}
            onChange={(e) => onUpdate(skill.id, { context: e.target.value })}
            placeholder="例: 質問をする時..."
            rows={2}
            className="w-full text-base md:text-sm px-3 py-2 rounded-md bg-input border border-border focus:outline-none focus:ring-1 focus:ring-ring resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor={`action-${skill.id}`}
            className="text-xs font-medium text-muted-foreground uppercase"
          >
            具体的な行動 (なにを)
          </label>
          <textarea
            id={`action-${skill.id}`}
            value={skill.action}
            onChange={(e) => onUpdate(skill.id, { action: e.target.value })}
            placeholder="例: 3秒間沈黙する"
            rows={2}
            className="w-full text-base md:text-sm px-3 py-2 rounded-md bg-input border border-border focus:outline-none focus:ring-1 focus:ring-ring resize-none"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label
              htmlFor={`proficiency-${skill.id}`}
              className="text-xs font-medium text-muted-foreground uppercase"
            >
              習得度
            </label>
            <span className="text-xs font-bold">{skill.proficiency}%</span>
          </div>
          <div className="relative w-full h-5 flex items-center select-none touch-none">
            {/* Track Background */}
            <div
              className="absolute w-full h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: trackColor }}
            >
              {/* Progress Fill */}
              <div
                className="h-full transition-all duration-300 ease-out"
                style={{
                  width: `${skill.proficiency}%`,
                  backgroundColor: progressColor,
                }}
              />
            </div>

            {/* Thumb */}
            <div
              className={`absolute h-5 w-5 bg-background border-2 rounded-full shadow-sm transition-transform hover:scale-110 flex items-center justify-center`}
              style={{
                left: `${skill.proficiency}%`,
                transform: "translateX(-50%)",
                borderColor: progressColor,
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: progressColor }}
              />
            </div>

            {/* Invisible Input for Interaction */}
            <input
              id={`proficiency-${skill.id}`}
              type="range"
              min="0"
              max="100"
              value={skill.proficiency}
              onChange={(e) =>
                onUpdate(skill.id, { proficiency: Number(e.target.value) })
              }
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              aria-label="習得度"
            />
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground px-1 mt-1">
            <span>0: 意識してもできない</span>
            <span className="text-center">50: 意識すればできる</span>
            <span>100: 無意識でできる</span>
          </div>
        </div>
      </div>

      <div className="p-3 bg-muted/20 border-t border-border flex flex-wrap gap-y-3 gap-x-2 justify-between items-center">
        <SkillHeatmap logs={skill.practiceLogs || []} />

        <div className="flex flex-col items-end gap-2 ml-auto">
          <button
            type="button"
            onClick={handleLogPractice}
            className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-full shadow-sm hover:bg-primary/90 transition-transform active:scale-95 flex items-center gap-1.5"
            title="今日実践した！"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">今日やった！</span>
          </button>

          <button
            type="button"
            onClick={() => onMaster(skill.id)}
            className="text-xs font-medium text-muted-foreground hover:text-primary hover:underline flex items-center gap-1"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            習得完了
          </button>
        </div>
      </div>
    </div>
  );
}
