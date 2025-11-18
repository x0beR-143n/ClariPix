"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ProfileData } from "./types";
import MasonryGalleryProfile from "./MasonryGalleryForProfile";

type ProfileTabsProps = {
  profileData: ProfileData;
};

const TABS = [
  { key: "uploaded", label: "Uploaded" },
  { key: "collections", label: "Collections" },
] as const;

type TabKey = typeof TABS[number]["key"];

export default function ProfileTabs({ profileData }: ProfileTabsProps) {
  const [active, setActive] = useState<TabKey>("uploaded");

  return (
    <div>
      <div className="flex gap-2 mb-6 border-b border-zinc-200">
        {TABS.map((t) => {
          const isActive = active === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={[
                "relative px-4 py-2 font-semibold text-sm transition-colors",
                isActive
                  ? "text-zinc-900"
                  : "text-zinc-600 opacity-80 hover:opacity-100 hover:text-zinc-900",
              ].join(" ")}
              aria-current={isActive ? "page" : undefined}
            >
              {t.label}
              <span
                aria-hidden
                className={[
                  "pointer-events-none absolute left-1/2 -translate-x-1/2 -bottom-[1px] h-0.5 w-8 rounded-full bg-red-600 transition-opacity",
                  isActive ? "opacity-100" : "opacity-0",
                ].join(" ")}
              />
            </button>
          );
        })}
      </div>

      {active === "uploaded" && (
        <>
          {profileData.uploaded.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              No uploaded images yet
            </div>  
          ) : (
            <MasonryGalleryProfile images={profileData.uploaded} />
          )}
        </>
      )}

      {active === "collections" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {profileData.collections.length === 0 ? (
            <div className="col-span-full text-center py-12 text-zinc-500">
              No collections yet
            </div>
          ) : (
            profileData.collections.map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.id}`}
                className="group relative overflow-hidden rounded-xl bg-zinc-100 aspect-[4/3] hover:opacity-90 transition"
              >
                {collection.coverImage ? (
                  <Image
                    src={collection.coverImage}
                    alt={collection.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-200">
                    <span className="text-4xl">📁</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="text-white font-semibold text-sm mb-1 truncate">
                    {collection.name}
                  </h3>
                  <p className="text-white/80 text-xs">
                    {collection.imageCount} {collection.imageCount === 1 ? "image" : "images"}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
