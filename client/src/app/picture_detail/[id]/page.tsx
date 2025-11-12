"use client";

import { useState, use } from "react";
import SearchHeader from "../../../components/shared/SearchHeader";
import BackButton from "../../../components/picture_detail/BackButton";
import PictureImage from "../../../components/picture_detail/PictureImage";
import PictureActionButtons from "../../../components/picture_detail/PictureActionButtons";
import PictureAuthorInfo from "../../../components/picture_detail/PictureAuthorInfo";
import PictureStats from "../../../components/picture_detail/PictureStats";
import PictureDescription from "../../../components/picture_detail/PictureDescription";
import PictureCategories from "../../../components/picture_detail/PictureCategories";
import PictureMetadata from "../../../components/picture_detail/PictureMetadata";
import { getMockPictureData, getMockRelatedImages } from "../../../components/picture_detail/mockData";
import MasonryGallery from "../../../components/home/MasonryImageDisplay";

export default function PictureDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [pictureData, setPictureData] = useState(getMockPictureData(id));
  const [isLiked, setIsLiked] = useState(pictureData.is_liked);
  const [isSaved, setIsSaved] = useState(pictureData.is_saved);
  const [likeCount, setLikeCount] = useState(pictureData.total_likes);
  const [relatedImages] = useState<string[]>(getMockRelatedImages(pictureData.categories));

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

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
              <PictureActionButtons
                isLiked={isLiked}
                isSaved={isSaved}
                likeCount={likeCount}
                onLike={handleLike}
                onSave={handleSave}
              />

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
                {pictureData.title}
              </h1>

              <PictureAuthorInfo uploader={pictureData.uploader} />
              <PictureStats
                total_views={pictureData.total_views}
                total_comments={pictureData.total_comments}
              />
              <PictureDescription description={pictureData.description} />
              <PictureCategories categories={pictureData.categories} />
              <PictureMetadata created_at={pictureData.created_at} />
            </div>
          </div>

          {/* Related images */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-zinc-900 mb-6">Related images</h2>
            <MasonryGallery images={relatedImages} />
          </div>
        </div>
      </div>
    </div>
  );
}

