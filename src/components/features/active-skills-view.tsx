import { Archive, CheckCircle2, Trash2 } from "lucide-react";
import { useState } from "react";
import { useSkillStore } from "../../stores/skill-store";
import type { ActiveSkill } from "../../types/skill";
import { ConfirmDialog } from "../common/confirm-dialog";

export function ActiveSkillsView() {
  const { activeSkills, updateActiveSkill, moveToBacklog, deleteActiveSkill } =
    useSkillStore();
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    itemId: string | null;
    type: "delete" | "master" | null;
  }>({
    isOpen: false,
    itemId: null,
    type: null,
  });

  const handleConfirm = () => {
    if (confirmState.itemId && confirmState.type) {
      deleteActiveSkill(confirmState.itemId);
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
              onMoveToBacklog={moveToBacklog}
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
        title={confirmState.type === "master" ? "習得完了の確認" : "削除の確認"}
        message={
          confirmState.type === "master"
            ? "このスキルを習得完了にしますか？（リストから削除されます）"
            : "このスキルを習得中リストから削除しますか？"
        }
        confirmLabel={confirmState.type === "master" ? "完了" : "削除"}
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
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm flex flex-col overflow-hidden">
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg leading-tight">{skill.title}</h3>
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
            className="w-full accent-primary h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
          />
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
