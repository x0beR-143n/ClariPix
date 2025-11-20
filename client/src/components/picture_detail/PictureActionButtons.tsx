"use client";

import { useState } from "react";
import { Heart, Share2, FolderPlus, Trash2 } from "lucide-react";
import ShareModal from "./ShareModal";
import AddToCollectionModal from "./AddToCollectionModal";
import { useAuthStore } from "../../store/authStore";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

type PictureActionButtonsProps = {
  isLiked: boolean;
  likeCount: number;
  onLike: () => void;
  imageId: string;
  canDelete: boolean;
  onDelete?: () => Promise<void> | void;
  deleteLoading?: boolean;
};

export default function PictureActionButtons({
  isLiked,
  likeCount,
  onLike,
  imageId,
  canDelete,
  onDelete,
  deleteLoading,
}: PictureActionButtonsProps) {
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [collectionModalOpen, setCollectionModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const { isLogin } = useAuthStore();

  return (
    <>
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <button
          onClick={onLike}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm transition-colors min-w-[4.5rem] ${
            isLiked
              ? "bg-zinc-200 text-zinc-900 hover:bg-zinc-300"
              : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
          }`}
        >
          <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
          <span className="tabular-nums">{likeCount}</span>
        </button>

        {isLogin && (
          <button
            onClick={() => setCollectionModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm bg-zinc-100 text-zinc-900 hover:bg-zinc-200 transition-colors"
          >
            <FolderPlus size={18} />
            Save
          </button>
        )}

        <button
          onClick={() => setShareModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm bg-zinc-100 text-zinc-900 hover:bg-zinc-200 transition-colors"
        >
          <Share2 size={18} />
          Share
        </button>

        {canDelete && (
          <button
          onClick={() => setDeleteModalOpen(true)}
            disabled={deleteLoading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-60"
          >
            <Trash2 size={18} />
            {deleteLoading ? "Deleting..." : "Delete"}
          </button>
        )}
      </div>

      <ShareModal
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />

      {isLogin && (
        <AddToCollectionModal
          open={collectionModalOpen}
          onClose={() => setCollectionModalOpen(false)}
          imageId={imageId}
        />
      )}

      {canDelete && onDelete && (
        <DeleteConfirmationModal
          open={deleteModalOpen}
          onClose={() => {
            if (!deleteLoading) setDeleteModalOpen(false);
          }}
          onConfirm={async () => {
            if (deleteLoading) return;
            await onDelete();
            setDeleteModalOpen(false);
          }}
          loading={deleteLoading}
        />
      )}
    </>
  );
}

