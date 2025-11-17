"use client";

import { useState, useEffect } from "react";
import { X, FolderPlus, Check } from "lucide-react";
import { getUserCollections, addImageToCollection, type UserCollection } from "../../api/collection";

type AddToCollectionModalProps = {
  open: boolean;
  onClose: () => void;
  imageId: string;
  onSuccess?: () => void;
};

export default function AddToCollectionModal({
  open,
  onClose,
  imageId,
  onSuccess,
}: AddToCollectionModalProps) {
  const [collections, setCollections] = useState<UserCollection[]>([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [addedCollections, setAddedCollections] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (open) {
      loadCollections();
    } else {
      // Reset state when modal closes
      setCollections([]);
      setError(null);
      setAddedCollections(new Set());
    }
  }, [open]);

  const loadCollections = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUserCollections();
      setCollections(data);
    } catch (err: any) {
      setError(err?.message || "Unable to load collections");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCollection = async (collectionId: string) => {
    if (adding) return; // Prevent multiple clicks

    setAdding(collectionId);
    setError(null);
    try {
      await addImageToCollection(collectionId, imageId);
      setAddedCollections((prev) => new Set(prev).add(collectionId));
      onSuccess?.();
    } catch (err: any) {
      setError(err?.message || "Unable to add image to collection");
    } finally {
      setAdding(null);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute inset-0 flex items-start md:items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-[420px] rounded-[28px] bg-white text-zinc-900 shadow-2xl ring-1 ring-black/5 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-4 border-b border-zinc-200">
            <h2 className="text-[22px] md:text-[24px] leading-7 font-extrabold">
              Add to collection
            </h2>
            <button
              aria-label="Close"
              className="h-8 w-8 grid place-items-center rounded-full hover:bg-zinc-100"
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
            {loading && (
              <div className="text-center py-8 text-sm text-zinc-500">
                Loading collections...
              </div>
            )}

            {error && !loading && (
              <div className="text-center py-4 text-sm text-red-500 mb-4">
                {error}
              </div>
            )}

            {!loading && collections.length === 0 && (
              <div className="text-center py-8 text-sm text-zinc-500">
                No collections yet. Create one in your profile.
              </div>
            )}

            {!loading && collections.length > 0 && (
              <div className="space-y-2">
                {collections.map((collection) => {
                  const isAdded = addedCollections.has(collection.id);
                  const isAdding = adding === collection.id;

                  return (
                    <button
                      key={collection.id}
                      onClick={() => handleAddToCollection(collection.id)}
                      disabled={isAdding || isAdded}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                        isAdded
                          ? "bg-green-50 text-green-700"
                          : "bg-zinc-100 hover:bg-zinc-200 text-zinc-900"
                      } ${isAdding ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <div className="flex-shrink-0">
                        {isAdded ? (
                          <div className="w-10 h-10 rounded-lg bg-green-200 flex items-center justify-center">
                            <Check size={20} className="text-green-700" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-zinc-200 flex items-center justify-center">
                            <FolderPlus size={20} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <div className="font-semibold text-sm truncate">
                          {collection.name}
                        </div>
                        {collection.images && collection.images.length > 0 && (
                          <div className="text-xs text-zinc-500 mt-0.5">
                            {collection.images.length}{" "}
                            {collection.images.length === 1 ? "image" : "images"}
                          </div>
                        )}
                      </div>
                      {isAdding && (
                        <div className="text-xs text-zinc-500">Adding...</div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

