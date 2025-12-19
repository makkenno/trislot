import { Trash2, Trophy } from "lucide-react";
import { useState } from "react";
import { useSkillStore } from "../../stores/skill-store";
import { ConfirmDialog } from "../common/confirm-dialog";

export function HistoryView() {
  const { history, deleteHistoryItem } = useSkillStore();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = () => {
    if (deleteId) {
      deleteHistoryItem(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">習得済みリスト</h2>
        <p className="text-muted-foreground">
          これまでに習得したスキルです。素晴らしい成果です！
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {history.length === 0 ? (
          <div className="md:col-span-2 lg:col-span-3 text-center py-12 text-muted-foreground border-2 border-dashed border-muted rounded-lg">
            まだ習得済みのスキルはありません。
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-amber-500/50 bg-amber-500/5 text-card-foreground shadow-sm relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
                <Trophy className="w-24 h-24 text-amber-500" />
              </div>
              <div className="p-4 md:p-6 relative z-10">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  {item.title}
                </h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>開始日: {new Date(item.startedAt).toLocaleDateString()}</p>
                  <p>
                    完了日: {new Date(item.completedAt).toLocaleDateString()}
                  </p>
                </div>
                {item.context && (
                  <div className="mt-4 p-3 bg-background/50 rounded-lg text-sm">
                    <p className="font-semibold text-xs text-muted-foreground mb-1">
                      実践した場面
                    </p>
                    <p>{item.context}</p>
                  </div>
                )}
                {item.action && (
                  <div className="mt-2 p-3 bg-background/50 rounded-lg text-sm">
                    <p className="font-semibold text-xs text-muted-foreground mb-1">
                      具体的な行動
                    </p>
                    <p>{item.action}</p>
                  </div>
                )}
              </div>
              <div className="p-3 bg-amber-500/10 border-t border-amber-500/20 flex justify-end">
                <button
                  type="button"
                  onClick={() => setDeleteId(item.id)}
                  className="text-sm text-muted-foreground hover:text-destructive flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  履歴から削除
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        title="履歴の削除"
        message="この記録を永久に削除しますか？"
        confirmLabel="削除"
        isDestructive
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
