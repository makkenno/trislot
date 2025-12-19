import { AlertTriangle } from "lucide-react";
import { Modal } from "./modal";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "OK",
  cancelLabel = "キャンセル",
  isDestructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title}>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`p-2 rounded-full ${
              isDestructive
                ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
            }`}
          >
            <AlertTriangle className="w-6 h-6" />
          </div>
          <span className="font-medium text-lg hidden sm:inline">
            {/* Title is already in Modal header, but we keep icon context here if desired. 
                Actually Modal usually puts title in header. 
                Let's simplify: If Modal has title, we might duplicate.
                But existing design has icon+title in body.
                Let's suppress Modal title if we want custom body, OR adapt.
                Standard Modal usually has simple text header.
                Let's use Modal for container but keep custom body content unique.
             */}
          </span>
        </div>
        <p className="text-muted-foreground mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors font-medium border border-border"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-lg shadow-sm transition-colors font-medium ${
              isDestructive
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
