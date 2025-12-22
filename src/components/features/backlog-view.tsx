import { ArrowUpRight, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useSkillStore } from "../../stores/skill-store";
import { ConfirmDialog } from "../common/confirm-dialog";

export function BacklogView() {
  const {
    backlog,
    addBacklogItem,
    moveToActive,
    deleteBacklogItem,
    activeSkills,
  } = useSkillStore();
  const [newItemTitle, setNewItemTitle] = useState("");
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;
    addBacklogItem(newItemTitle.trim());
    setNewItemTitle("");
  };

  const isMaxActive = activeSkills.length >= 9;

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          やりたいことリスト
        </h2>
        将来習得したいアイデアやスキルです。優先順位をつけて、一度に取り組むのは一つだけに絞りましょう。
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newItemTitle}
          onChange={(e) => setNewItemTitle(e.target.value)}
          placeholder="習得したいことは？"
          className="flex-1 px-4 py-2 rounded-md bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          追加
        </button>
      </form>

      <div className="grid gap-3">
        {backlog.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-muted rounded-lg">
            リストは空です。習得したいことを追加しましょう！
          </div>
        ) : (
          backlog.map((item) => (
            <div
              key={item.id}
              className="p-3 md:p-4 rounded-lg border border-border bg-card flex items-center justify-between group hover:border-sidebar-primary/50 transition-colors"
            >
              <span className="font-medium">{item.title}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setItemToDelete(item.id)}
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                  title="削除"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => moveToActive(item.id)}
                  disabled={isMaxActive}
                  className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  title={
                    isMaxActive
                      ? "同時に習得できるのは3つまでです"
                      : "習得を開始する"
                  }
                >
                  開始する
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <ConfirmDialog
        isOpen={!!itemToDelete}
        title="削除の確認"
        message="この項目をやりたいことリストから削除しますか？"
        confirmLabel="削除"
        isDestructive
        onConfirm={() => {
          if (itemToDelete) {
            deleteBacklogItem(itemToDelete);
            setItemToDelete(null);
          }
        }}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
}
