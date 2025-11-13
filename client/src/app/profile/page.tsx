"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SearchHeader from "../../components/shared/SearchHeader";
import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileTabs from "../../components/profile/ProfileTabs";
import type { ProfileData } from "../../components/profile/types";
import { fetchCurrentUserProfile } from "../../api/user";
import { useAuthStore } from "../../store/authStore";

export default function ProfilePage() {
  const router = useRouter();
  const { isLogin } = useAuthStore();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLogin) {
      router.replace("/");
      return;
    }

    let mounted = true;
    setLoading(true);
    setError(null);

    fetchCurrentUserProfile()
      .then((data) => {
        if (!mounted) return;
        setProfileData(data);
      })
      .catch(() => {
        if (!mounted) return;
        setError("Unable to load profile. Please try again later.");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [isLogin, router]);

  if (!isLogin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6">
        <SearchHeader />
      </div>

      <div className="pt-4 pl-4 pr-4">
        <div className="mx-auto">
          {loading && (
            <div className="py-20 text-center text-sm text-zinc-500">
              Loading profile...
            </div>
          )}

          {!loading && error && (
            <div className="py-20 text-center text-sm text-red-500">
              {error}
            </div>
          )}

          {!loading && !error && profileData && (
            <>
              <ProfileHeader profileData={profileData} />
              <ProfileTabs profileData={profileData} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
