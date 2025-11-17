"use client";

import { useState, useEffect, use } from "react";
import SearchHeader from "../../../components/shared/SearchHeader";
import BackButton from "../../../components/picture_detail/BackButton";
import PictureImage from "../../../components/picture_detail/PictureImage";
import PictureActionButtons from "../../../components/picture_detail/PictureActionButtons";
import PictureStats from "../../../components/picture_detail/PictureStats";
import PictureCategories from "../../../components/picture_detail/PictureCategories";
import PictureMetadata from "../../../components/picture_detail/PictureMetadata";
import MasonryGallery from "../../../components/home/MasonryImageDisplay";
import { getImageById } from "../../../api/image";
import type { PictureData } from "../../../components/picture_detail/types";

function mapServerImageToPictureData(serverImage: any): PictureData {
  return {
    id: serverImage.id,
    image_url: serverImage.image_url,
    description: serverImage.description,
    uploader_id: serverImage.uploader_id,
    uploader_name: undefined, // API doesn't return uploader name, will show placeholder
    categories: serverImage.categories || [],
    total_views: serverImage.total_views || 0,
    total_likes: serverImage.total_likes || 0,
    created_at: serverImage.created_at,
    is_liked: false, // TODO: Get from API if available
  };
}

export default function PictureDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [pictureData, setPictureData] = useState<PictureData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [relatedImages] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    getImageById(id)
      .then((serverImage) => {
        if (!mounted) return;
        const mapped = mapServerImageToPictureData(serverImage);
        setPictureData(mapped);
        setIsLiked(mapped.is_liked);
        setLikeCount(mapped.total_likes);
      })
      .catch(() => {
        if (!mounted) return;
        setError("Unable to load image. Please try again later.");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="p-6">
          <SearchHeader />
        </div>
        <div className="px-6 pb-12">
          <BackButton />
          <div className="py-20 text-center text-sm text-zinc-500">
            Loading image...
          </div>
        </div>
      </div>
    );
  }

  if (error || !pictureData) {
    return (
      <div className="min-h-screen bg-white">
        <div className="p-6">
          <SearchHeader />
        </div>
        <div className="px-6 pb-12">
          <BackButton />
          <div className="py-20 text-center text-sm text-red-500">
            {error || "Image not found"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6">
        <SearchHeader />
      </div>

      <div className="px-6 pb-12">
        <BackButton />

        {/* Main content - Pinterest style layout */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <PictureImage pictureData={pictureData} />

            {/* Right side - Details */}
            <div className="flex flex-col">
              

              {/* Title (using description) */}
              <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-6">
                {pictureData.description || "Untitled"}
              </h1>

              <PictureStats total_views={pictureData.total_views} />

              <PictureActionButtons
                isLiked={isLiked}
                likeCount={likeCount}
                onLike={handleLike}
                imageId={pictureData.id}
              />  

              <PictureCategories categories={pictureData.categories} />
              <PictureMetadata created_at={pictureData.created_at} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

