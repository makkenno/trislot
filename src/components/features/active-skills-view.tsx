import { Archive, CheckCircle2, Trash2, Trophy } from "lucide-react";
import { useState } from "react";
import { useSkillStore } from "../../stores/skill-store";
import type { ActiveSkill } from "../../types/skill";
import { ConfirmDialog } from "../common/confirm-dialog";

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
        border: "border-amber-500",
        shadow: "shadow-lg shadow-amber-500/20",
        badge:
          "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
        slider: "accent-amber-500",
      };
    case "達人":
      return {
        border: "border-orange-500",
        shadow: "shadow-md shadow-orange-500/10",
        badge:
          "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
        slider: "accent-orange-500",
      };
    case "上級":
      return {
        border: "border-purple-500",
        shadow: "shadow-md shadow-purple-500/10",
        badge:
          "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
        slider: "accent-purple-500",
      };
    case "中級":
      return {
        border: "border-blue-500",
        shadow: "shadow-sm shadow-blue-500/10",
        badge:
          "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        slider: "accent-blue-500",
      };
    case "初級":
      return {
        border: "border-green-500",
        shadow: "shadow-sm shadow-green-500/10",
        badge:
          "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        slider: "accent-green-500",
      };

    default:
      return {
        border: "border-border",
        shadow: "shadow-sm",
        badge: "bg-muted text-muted-foreground",
        slider: "accent-primary",
      };
  }
}

export function ActiveSkillsView() {
  const { activeSkills, updateActiveSkill, moveToBacklog, deleteActiveSkill } =
    useSkillStore();
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
      }
      setConfirmState({ isOpen: false, itemId: null, type: null });
    }
  };

  const handleCancel = () => {
    setConfirmState({ isOpen: false, itemId: null, type: null });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">現在習得中</h2>
        <p className="text-muted-foreground">
          意識して実践するスキルです。確実に習得するために最大3つまでに絞っています。
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
            ? "このスキルを習得完了にしますか？（リストから削除されます）"
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
}

function SkillCard({
  skill,
  onUpdate,
  onMoveToBacklog,
  onDelete,
  onMaster,
}: SkillCardProps) {
  const rank = getRank(skill.proficiency);
  const styles = getRankStyles(rank);

  return (
    <div
      className={`rounded-xl border bg-card flex flex-col overflow-hidden transition-all duration-300 ${styles.border} ${styles.shadow}`}
    >
      <div className="p-4 border-b border-border bg-muted/30">
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

      <div className="p-4 space-y-4 flex-1">
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
            className="w-full text-sm px-3 py-2 rounded-md bg-input border border-border focus:outline-none focus:ring-1 focus:ring-ring resize-none"
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
            className="w-full text-sm px-3 py-2 rounded-md bg-input border border-border focus:outline-none focus:ring-1 focus:ring-ring resize-none"
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
          <input
            id={`proficiency-${skill.id}`}
            type="range"
            min="0"
            max="100"
            value={skill.proficiency}
            onChange={(e) =>
              onUpdate(skill.id, { proficiency: Number(e.target.value) })
            }
            className={`w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer ${styles.slider}`}
          />
          <div className="flex justify-between text-[10px] text-muted-foreground px-1 mt-1">
            <span>0: 意識してもできない</span>
            <span className="text-center">50: 意識すればできる</span>
            <span>100: 無意識でできる</span>
          </div>
        </div>
      </div>

      <div className="p-3 bg-muted/20 border-t border-border flex justify-end">
        <button
          type="button"
          onClick={() => onMaster(skill.id)}
          className="text-sm font-medium text-primary hover:underline flex items-center gap-1.5"
        >
          <CheckCircle2 className="w-4 h-4" />
          習得完了
        </button>
      </div>
    </div>
  );
}
