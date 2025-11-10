"use client";

import { useState } from "react";
import type { ProfileData } from "./types";
import MasonryGallery from "../home/MasonryImageDisplay";

type ProfileTabsProps = {
  profileData: ProfileData;
};

const TABS = [
  { key: "uploaded", label: "Uploaded" },
  { key: "saved", label: "Saved" },
  { key: "collections", label: "Collections" },
] as const;

type TabKey = typeof TABS[number]["key"];

export default function ProfileTabs({ profileData }: ProfileTabsProps) {
  const [active, setActive] = useState<TabKey>("uploaded");

  const getImages = () => {
    if (active === "uploaded") return profileData.uploaded;
    if (active === "saved") return profileData.saved;
    return profileData.collections; // mock as cover images
  };

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

      <MasonryGallery images={getImages()} />
    </div>
  );
}
