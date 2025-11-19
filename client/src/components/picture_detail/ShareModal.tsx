"use client";

import { useState } from "react";
import { X, Copy, Check } from "lucide-react";

type ShareModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function ShareModal({ open, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const displayUrl = currentUrl.length > 50 
    ? `${currentUrl.substring(0, 47)}...` 
    : currentUrl;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-[500px] rounded-[28px] bg-white text-zinc-900 shadow-2xl ring-1 ring-black/5 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-zinc-200">
            <h2 className="text-xl font-bold">Share image</h2>
            <button
              aria-label="Close"
              className="h-8 w-8 grid place-items-center rounded-full hover:bg-zinc-100 transition-colors"
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 px-4 py-3 rounded-xl bg-zinc-100 border border-zinc-200 text-sm text-zinc-700 truncate">
                {displayUrl}
              </div>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-colors ${
                  copied
                    ? "bg-green-600 text-white"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                {copied ? (
                  <>
                    <Check size={18} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={18} />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

