"use client";

import { X, Trash2 } from "lucide-react";

type DeleteConfirmationModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
};

export default function DeleteConfirmationModal({
  open,
  onClose,
  onConfirm,
  loading,
}: DeleteConfirmationModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
        onClick={onClose}
      />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-[420px] rounded-[28px] bg-white text-zinc-900 shadow-2xl ring-1 ring-black/5 overflow-hidden">
          <div className="flex items-center justify-between px-6 pt-4 border-b border-zinc-200">
            <h2 className="text-lg font-semibold">Delete image</h2>
            <button
              aria-label="Close"
              className="h-8 w-8 grid place-items-center rounded-full hover:bg-zinc-100"
              onClick={onClose}
              disabled={loading}
            >
              <X size={18} />
            </button>
          </div>

          <div className="px-6 py-4">
            <p className="text-sm text-zinc-600 mb-4">
              Are you sure you want to delete this image? This action is permanent and cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="h-10 px-4 rounded-full border border-zinc-300 text-sm font-semibold text-zinc-700 hover:bg-zinc-100"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="h-10 px-5 rounded-full bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-60 inline-flex items-center gap-2"
                onClick={onConfirm}
                disabled={loading}
              >
                <Trash2 size={16} />
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


