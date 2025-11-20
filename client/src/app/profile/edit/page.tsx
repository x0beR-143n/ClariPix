"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";
import { useRouter } from "next/navigation";
import SearchHeader from "../../../components/shared/SearchHeader";
import type { ProfileData } from "../../../components/profile/types";
import { fetchCurrentUserProfile, updateUserProfile } from "../../../api/user";
import { useAuthStore } from "../../../store/authStore";
import { AVAILABLE_CATEGORIES } from "../../../constants/categories";

type FormState = {
  name: string;
  email: string;
  gender: "male" | "female" | "other" | ""; 
  birthdate: string;
  avatar_url: string;
  preferences: string[];
};

export default function EditProfilePage() {
  const router = useRouter();
  const { isLogin } = useAuthStore();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    gender: "",
    birthdate: "",
    avatar_url: "",
    preferences: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLogin) {
      router.replace("/");
      return;
    }

    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchCurrentUserProfile();
        if (!mounted) return;
        setProfile(data);
        setForm({
          name: data.name ?? "",
          email: data.email ?? "",
          gender: (data.gender as FormState["gender"]) || "",
          // birthdate from API is yyyy-mm-dd or full ISO; keep date part
          birthdate: data.birthdate ? data.birthdate.substring(0, 10) : "",
          avatar_url: data.avatar_url ?? "",
          preferences: data.preferences
            ?.filter((pref): pref is string =>
              AVAILABLE_CATEGORIES.includes(pref as any)
            ) ?? [],
        });
      } catch (err: any) {
        if (!mounted) return;
        setError(err?.message || "Unable to load profile.");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [isLogin, router]);

  if (!isLogin) {
    return null;
  }

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarUpload = (file?: File) => {
    if (!file) return;
    const maxBytes = 5 * 1024 * 1024; // 5MB limit for avatar
    if (file.size > maxBytes) {
      setAvatarError("Avatar must be under 5MB.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setAvatarError("Please select an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarError(null);
      setForm((prev) => ({ ...prev, avatar_url: reader.result as string }));
      setSuccess("Avatar ready. Remember to save changes.");
    };
    reader.onerror = () => {
      setAvatarError("Failed to read image file.");
    };
    reader.readAsDataURL(file);
    if (avatarInputRef.current) {
      avatarInputRef.current.value = "";
    }
  };

  const togglePreference = (category: string) => {
    setForm((prev) => {
      const exists = prev.preferences.includes(category);
      return {
        ...prev,
        preferences: exists
          ? prev.preferences.filter((c) => c !== category)
          : [...prev.preferences, category],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    // Preferences already selected via UI, ensure only valid categories and lowercase
    const preferences = form.preferences
      .map((p) => p.toLowerCase())
      .filter((p) => AVAILABLE_CATEGORIES.includes(p as any));

    try {
      const updated = await updateUserProfile({
        name: form.name || undefined,
        email: form.email || undefined,
        gender: form.gender || undefined,
        birthdate: form.birthdate || undefined,
        avatar_url: form.avatar_url || undefined,
        preferences: preferences.length > 0 ? preferences : undefined,
      });
      setProfile(updated);
      setSuccess("Profile updated successfully.");
      // Optionally navigate back to profile after short delay
      setTimeout(() => {
        router.push("/profile");
      }, 800);
    } catch (err: any) {
      setError(err?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6">
        <SearchHeader />
      </div>

      <div className="px-6 pb-12">
        <div className="max-w-xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-6">
            Edit profile
          </h1>

          {loading ? (
            <div className="py-20 text-center text-sm text-zinc-500">
              Loading profile...
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-5 bg-white border border-zinc-200 rounded-2xl px-5 py-6 shadow-sm"
            >
              {/* Avatar preview */}
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-zinc-200 flex items-center justify-center">
                  {form.avatar_url ? (
                    <Image
                      src={form.avatar_url}
                      alt="Avatar"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-zinc-500">
                      {form.name ? form.name.charAt(0).toUpperCase() : "U"}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute bottom-1 right-1 h-7 w-7 rounded-full bg-zinc-900 text-white grid place-items-center hover:bg-zinc-800"
                    aria-label="Upload avatar"
                  >
                    <Camera size={14} />
                  </button>
                </div>
                <div className="text-xs text-zinc-500 flex-1">
                  Upload a square image (JPG/PNG, max 5MB). This avatar will appear on your profile.
                  {avatarError && (
                    <p className="text-red-600 mt-1">{avatarError}</p>
                  )}
                </div>
                <label htmlFor="avatar-upload-input" className="sr-only">
                  Choose avatar image
                </label>
                <input
                  ref={avatarInputRef}
                  id="avatar-upload-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleAvatarUpload(e.target.files?.[0])}
                />
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 text-red-700 text-sm px-3 py-2">
                  {error}
                </div>
              )}
              {success && (
                <div className="rounded-lg bg-green-50 text-green-700 text-sm px-3 py-2">
                  {success}
                </div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="name-input" className="block text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Name
                </label>
                <input
                  type="text"
                  id="name-input"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                  className="w-full h-10 rounded-lg border border-zinc-300 px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-400"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email-input" className="block text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Email
                </label>
                <input
                  type="email"
                  id="email-input"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                  className="w-full h-10 rounded-lg border border-zinc-300 px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="gender-select" className="block text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Gender
                  </label>
                  <select
                    id="gender-select"
                    value={form.gender}
                    onChange={(e) =>
                      handleChange("gender", e.target.value as FormState["gender"])
                    }
                    className="w-full h-10 rounded-lg border border-zinc-300 px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-400 bg-white"
                  >
                    <option value="">Not specified</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="birthdate-input" className="block text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Birthdate
                  </label>
                  <input
                    type="date"
                    id="birthdate-input"
                    value={form.birthdate}
                    onChange={(e) => handleChange("birthdate", e.target.value)}
                    className="w-full h-10 rounded-lg border border-zinc-300 px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-400"
                  />
                </div>
              </div>


               <div className="space-y-2">
                 <label className="block text-xs font-semibold uppercase tracking-wide text-zinc-500">
                   Preferences
                 </label>
                 <div className="flex flex-wrap gap-2">
                   {AVAILABLE_CATEGORIES.map((category) => {
                     const selected = form.preferences.includes(category);
                     return (
                       <button
                         type="button"
                         key={category}
                         onClick={() => togglePreference(category)}
                         className={[
                           "px-3 py-1.5 rounded-full text-sm font-medium border transition-colors",
                           selected
                             ? "bg-red-600 text-white border-red-600"
                             : "bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-100",
                         ].join(" ")}
                       >
                         {category}
                       </button>
                     );
                   })}
                 </div>
                 <p className="text-xs text-zinc-500">
                   Select from the available categories only.
                 </p>
               </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  className="h-10 px-4 rounded-full border border-zinc-300 text-sm font-semibold text-zinc-700 hover:bg-zinc-100"
                  onClick={() => router.push("/profile")}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="h-10 px-6 rounded-full bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}


