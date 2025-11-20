/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Edit, Trash2, Lock, Globe, Users, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { getCollectionByID, removeImageFromCollection, deleteCollection } from "@/src/api/collection";
import type { CollectionType } from "@/src/interfaces/collection";
import SelectMyImages from "@/src/app/create/components/select-my-images";

function getPrivacyIcon(privacy?: string) {
  switch (privacy) {
    case "public":
      return <Globe className="h-4 w-4" />;
    case "private":
      return <Lock className="h-4 w-4" />;
    case "friends":
      return <Users className="h-4 w-4" />;
    default:
      return null;
  }
}

function HeaderSkeleton() {
  return (
    <div className="mb-6">
      <Skeleton className="h-9 w-24 mb-4" />

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-0 space-y-3">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-1/2" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <Skeleton className="h-7 w-20 rounded-full" />
        <Skeleton className="h-7 w-24 rounded-full" />
        <Skeleton className="h-7 w-16 rounded-full" />
      </div>
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card
          key={i}
          className="relative overflow-hidden break-inside-avoid"
        >
          <Skeleton className="w-full h-60" />
        </Card>
      ))}
    </div>
  );
}

export default function CollectionDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [data, setData] = useState<CollectionType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSelectingImages, setIsSelectingImages] = useState(false);
  const [removingImageId, setRemovingImageId] = useState<string | null>(null);
  const [isDeletingCollection, setIsDeletingCollection] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  const idParam = params?.id;
  const collectionId =
    typeof idParam === "string" ? idParam : Array.isArray(idParam) ? idParam[0] : undefined;

  useEffect(() => {
    if (!collectionId) return;

    let cancelled = false;

    setLoading(true);
    setError(null);

    async function fetchCollection() {
      try {
        const res = await getCollectionByID(collectionId ?? "");
        if (!cancelled) {
          setData(res);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message || "Can not load collection");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchCollection();

    return () => {
      cancelled = true;
    };
  }, [collectionId, reloadToken]);

  const handleRemoveImage = async (imageId: string) => {
    if (!collectionId) return;
    try {
      setRemovingImageId(imageId);
      await removeImageFromCollection(collectionId, imageId);
      setData((prev) =>
        prev
          ? {
              ...prev,
              images: prev.images.filter((img) => img.id !== imageId),
            }
          : prev
      );
      toast.success("Đã xóa ảnh khỏi bộ sưu tập");
    } catch {
      toast.error("Không thể xóa ảnh khỏi bộ sưu tập");
    } finally {
      setRemovingImageId(null);
    }
  };

  const handleDeleteCollection = async () => {
    if (!collectionId) return;
    const confirmed = window.confirm("Bạn có chắc muốn xóa bộ sưu tập này không?");
    if (!confirmed) return;
    try {
      setIsDeletingCollection(true);
      await deleteCollection(collectionId);
      toast.success("Đã xóa bộ sưu tập");
      router.push("/profile");
    } catch {
      toast.error("Không thể xóa bộ sưu tập");
    } finally {
      setIsDeletingCollection(false);
    }
  };

  const collection = data?.collection;
  const images = data?.images ?? [];

  if (isSelectingImages && collectionId) {
    return (
      <SelectMyImages
        collectionId={collectionId}
        onDone={() => {
          setIsSelectingImages(false);
          setReloadToken((prev) => prev + 1);
        }}
        onCancel={() => setIsSelectingImages(false)}
      />
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        {loading ? (
          <HeaderSkeleton />
        ) : error || !collection ? (
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Card className="p-8">
              <h1 className="text-2xl font-semibold mb-2">Something went wrong</h1>
              <p className="text-muted-foreground mb-4">
                {error ?? "Can not load this collection."}
              </p>
              <Button onClick={() => router.refresh()}>Try again</Button>
            </Card>
          </div>
        ) : (
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold text-foreground text-balance">
                    Collection Name: {collection.name}
                  </h1>

                  {collection.privacy && (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1 capitalize"
                    >
                      {getPrivacyIcon(collection.privacy)}
                      {collection.privacy}
                    </Badge>
                  )}
                </div>

                {collection.description && (
                  <p className="text-muted-foreground text-lg mb-4 text-pretty">
                    Description: {collection.description}
                  </p>
                )}

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{images.length} images</span>
                  {collection.created_at && (
                    <span>
                      Created{" "}
                      {new Date(collection.created_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant={isEditing ? "destructive" : "outline"}
                  size="icon"
                  onClick={() => setIsEditing((prev) => !prev)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsSelectingImages(true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={handleDeleteCollection}
                  disabled={isDeletingCollection}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Tags (nếu backend có gửi) */}
            {collection.tags && collection.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {collection.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Images Grid */}
        {loading ? (
          <GridSkeleton />
        ) : !error && images.length > 0 ? (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {images.map((image) => (
              <Card
                key={image.id}
                className="group relative overflow-hidden break-inside-avoid cursor-pointer transition-all hover:shadow-lg"
              >
                <div className="relative w-full">
                  {isEditing && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!removingImageId) {
                          handleRemoveImage(image.id);
                        }
                      }}
                      className="absolute top-2 right-2 z-10 rounded-full bg-black/60 text-white p-1 hover:bg-black/80 disabled:opacity-50"
                      disabled={removingImageId === image.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                  <Image
                    src={image.image_url || "/placeholder.svg"}
                    alt={image.description || collection?.name || "Image"}
                    width={600}
                    height={600}
                    className="w-full h-auto object-cover transition-transform group-hover:scale-105"
                  />

                  {/* overlay info */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                    {image.description && (
                      <p className="text-white text-sm mb-2 line-clamp-2">
                        {image.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-white/80">
                      <span>{image.total_views} views</span>
                      <span>{image.total_likes} likes</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : !loading && !error ? (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Empty Collection
              </h3>
              <p className="text-muted-foreground mb-4">
                This collection doesn&apos;t have any images yet.
              </p>
              <Button onClick={() => setIsSelectingImages(true)}>Add Images</Button>
            </div>
          </Card>
        ) : null}
      </div>
    </main>
  );
}
