/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useRef, useState } from "react";
import MasonryGallery, { ImageItem } from "../components/home/MasonryImageDisplay";
import SearchHeader from "../components/shared/SearchHeader";
import { ImageMetadata } from "../interfaces/images";
import { getAllImages } from "../api/image";
import GallerySkeleton from "../components/home/GallerySkeleton";
import { useSearchParams } from "next/navigation";

const LIMIT = 15;

export default function Home() {
  const [images, setImages] = useState<ImageItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState<number>(1)
  const [canGetImage, setCanGetImage] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const bottomRef = useRef<HTMLDivElement | null>(null)

  const searchParams = useSearchParams();
  const queries = searchParams.get("search") || undefined;

  // load page 1
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true)
        setError(null)
        const data: ImageMetadata[] = await getAllImages(1, LIMIT, queries)
        const images_url: ImageItem[] = data.map(e => ({
          id: e.id,
          image_url: e.image_url
        }));
        setImages(images_url)
        // nếu số ảnh ít hơn LIMIT => coi như hết luôn
        if (data.length < LIMIT) {
          setHasMore(false)
        }
      } catch (err: any) {
        setError(err?.message || "Failed to load images")
      } finally {
        setLoading(false)
      }
    }

    fetchImages()
  }, [queries])

  // khi canGetImage = true thì load thêm
  useEffect(() => {
    const getMoreImage = async () => {
      if (!canGetImage || isLoadingMore || !hasMore) return

      try {
        setIsLoadingMore(true)
        const nextPage = page + 1
        const data: ImageMetadata[] = await getAllImages(nextPage, LIMIT, queries)
        const images_url: ImageItem[] = data.map(e => ({
          id: e.id,
          image_url: e.image_url
        }));

        setImages(prev => [...prev, ...images_url])
        setPage(nextPage)

        if (data.length < LIMIT) {
          setHasMore(false) // lần này cũng ít hơn LIMIT -> hết data
        }
      } catch (err: any) {
        setError(err?.message || "Failed to load images")
      } finally {
        setIsLoadingMore(false)
        setCanGetImage(false)
      }
    }

    getMoreImage()
  }, [canGetImage, isLoadingMore, page, hasMore, queries])

  // observer: đến gần đáy thì setCanGetImage(true)
  useEffect(() => {
    // nếu đang load lần đầu, đang lỗi, hoặc hết ảnh rồi -> khỏi setup observer
    if (loading || error || !hasMore) return

    const sentinel = bottomRef.current
    if (!sentinel) {
      console.log("Sentinel chưa tồn tại lúc này")
      return
    }

    console.log("IntersectionObserver được setup")

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting && !isLoadingMore && hasMore) {
          console.log("🚀 GẦN ĐÁY RỒI – gọi API / load thêm ở đây")
          setCanGetImage(true)
        }
      },
      {
        root: null,
        rootMargin: '0px 0px 300px 0px',
        threshold: 0,
      }
    )

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  }, [error, isLoadingMore, loading, hasMore])

  return (
    <div className="p-6 flex flex-col gap-y-10 min-h-screen">
      <SearchHeader text={queries}/>

      {loading && <GallerySkeleton count={16} />}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {!loading && !error && (
        <>
          <MasonryGallery images={images} />
          <div
            ref={bottomRef}
            className="h-10 w-full bg-transparent"
          />
          {isLoadingMore && (
            <p className="text-center text-gray-400 text-sm">
              Loading more images...
            </p>
          )}
          {!hasMore && (
            <p className="text-center text-gray-400 text-sm">
              You have seen all images 🎉
            </p>
          )}
        </>
      )}
    </div>
  );
}
