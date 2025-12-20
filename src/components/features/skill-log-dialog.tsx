import { Send, Trash2 } from "lucide-react";
import { useState } from "react";
import type { SkillNote } from "../../types/skill";
import { Modal } from "../common/modal";

interface SkillLogDialogProps {
  isOpen: boolean;
  onClose: () => void;
  skillTitle: string;
  notes: SkillNote[];
  onAddNote: (text: string) => void;
  onDeleteNote: (noteId: string) => void;
}

export function SkillLogDialog({
  isOpen,
  onClose,
  skillTitle,
  notes,
  onAddNote,
  onDeleteNote,
}: SkillLogDialogProps) {
  const [newNote, setNewNote] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onAddNote(newNote.trim());
    setNewNote("");
  };

  const sortedNotes = [...notes].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`実践ログ: ${skillTitle}`}>
      <div className="flex flex-col h-[60vh] md:h-[500px]">
        {/* Note List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10">
          {sortedNotes.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground text-sm">
              まだログはありません。
              <br />
              気づきや反省をメモしてみましょう。
            </div>
          ) : (
            sortedNotes.map((note) => (
              <div
                key={note.id}
                className="bg-card border border-border rounded-lg p-3 shadow-sm relative group"
              >
                <div className="text-sm whitespace-pre-wrap mb-4">
                  {note.text}
                </div>
                <div className="flex justify-between items-center text-xs text-muted-foreground border-t border-border/50 pt-2">
                  <span>{new Date(note.createdAt).toLocaleString()}</span>
                  <button
                    type="button"
                    onClick={() => onDeleteNote(note.id)}
                    className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                    title="削除"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-background border-t border-border">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="気づいたことを記録..."
              className="flex-1 px-4 py-2 rounded-md bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="submit"
              disabled={!newNote.trim()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center p-2.5"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </Modal>
  );
}
