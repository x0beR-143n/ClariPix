"use client";

import { useState } from "react";
import SearchHeader from "../../components/shared/SearchHeader";
import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileTabs from "../../components/profile/ProfileTabs";
import { getMockProfileData } from "../../components/profile/mockData";

export default function ProfilePage() {
  const [profileData] = useState(getMockProfileData("current-user"));

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6">
        <SearchHeader />
      </div>

      <div className="pt-4 pl-4 pr-4">
        <div className="mx-auto">
          <ProfileHeader profileData={profileData} />
          <ProfileTabs profileData={profileData} />
        </div>
      </div>
    </div>
  );
}
