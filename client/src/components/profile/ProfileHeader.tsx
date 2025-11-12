"use client";

import Image from "next/image";
import { Settings, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import type { ProfileData } from "./types";

type ProfileHeaderProps = {
  profileData: ProfileData;
};

export default function ProfileHeader({ profileData }: ProfileHeaderProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-zinc-200">
            {profileData.avatar_url ? (
              <Image
                src={profileData.avatar_url}
                alt={profileData.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl md:text-4xl font-bold text-zinc-400">
                {profileData.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-2">
                {profileData.name}
              </h1>
              <p className="text-zinc-600 mb-1">@{profileData.email.split("@")[0]}</p>
              {profileData.birthdate && (
                <p className="text-sm text-zinc-500">
                  Joined {formatDate(profileData.created_at)}
                </p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <Link
                href="/settings"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 text-zinc-900 font-semibold text-sm hover:bg-zinc-200 transition-colors"
              >
                <Settings size={18} />
                Settings
              </Link>
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 text-zinc-900 font-semibold text-sm hover:bg-zinc-200 transition-colors"
                aria-label="More options"
              >
                <MoreHorizontal size={18} />
              </button>
            </div>
          </div>

          {/* Preferences */}
          {profileData.preferences && profileData.preferences.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {profileData.preferences.map((pref, index) => (
                <Link
                  key={index}
                  href={`/discover?category=${encodeURIComponent(pref)}`}
                  className="px-3 py-1.5 rounded-full bg-zinc-100 text-zinc-700 text-sm font-medium hover:bg-zinc-200 transition-colors"
                >
                  {pref}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

