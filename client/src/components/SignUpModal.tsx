"use client";

import { useState } from "react";
import Image from "next/image";

type SignUpModalProps = {
  open: boolean;
  onClose: () => void;
  onSignUp?: (
    email: string,
    password: string,
    birthdate?: string,
    name?: string,
    gender?: string
  ) => Promise<void> | void;
  onGoToLogin?: () => void;
};

export default function SignUpModal({
  open,
  onClose,
  onSignUp,
  onGoToLogin,
}: SignUpModalProps) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [birthdate, setBirthdate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Kiểm tra mật khẩu khớp
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await onSignUp?.(email, password, birthdate, name, gender);
    } catch (err: any) {
      setError(err?.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute inset-0 flex items-start md:items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-[420px] rounded-[28px] bg-white text-zinc-900 shadow-2xl ring-1 ring-black/5 overflow-hidden">
          {/* Header close */}
          <div className="flex items-center justify-end p-3">
            <button
              aria-label="Close"
              className="h-8 w-8 grid place-items-center rounded-full hover:bg-zinc-100"
              onClick={onClose}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="px-7 pb-8 -mt-2">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full overflow-hidden">
              <Image
                src="/claripix_logo.png"
                alt="ClariPix logo"
                width={48}
                height={48}
                className="h-full w-full object-contain"
                priority
              />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="mb-1 block text-[13px] font-semibold">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full h-11 rounded-[12px] border border-zinc-300 px-3.5 text-[15px] outline-none focus:ring-2 focus:ring-zinc-400"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="mb-1 block text-[13px] font-semibold">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                  className="w-full h-11 rounded-[12px] border border-zinc-300 px-3.5 text-[15px] outline-none focus:ring-2 focus:ring-zinc-400 bg-white"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Email */}
              <div>
                <label className="mb-1 block text-[13px] font-semibold">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-11 rounded-[12px] border border-zinc-300 px-3.5 text-[15px] outline-none focus:ring-2 focus:ring-zinc-400"
                />
              </div>

              {/* Password */}
              <div>
                <label className="mb-1 block text-[13px] font-semibold">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="no-password-reveal w-full h-11 rounded-[12px] border border-zinc-300 px-3.5 pr-11 text-[15px] outline-none focus:ring-2 focus:ring-zinc-400"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md p-2 text-zinc-600 hover:bg-zinc-100"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12 18 18.75 12 18.75 2.25 12 2.25 12Z"
                      />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                </div>
                <p className="mt-2 text-[13px] text-zinc-600">
                  Use 8 or more letters, numbers and symbols
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="mb-1 block text-[13px] font-semibold">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="no-password-reveal w-full h-11 rounded-[12px] border border-zinc-300 px-3.5 text-[15px] outline-none focus:ring-2 focus:ring-zinc-400"
                />
              </div>

              {/* Birthdate */}
              <div>
                <label className="mb-1 block text-[13px] font-semibold">Birthdate</label>
                <div className="relative">
                  <input
                    id="birthdate-input"
                    type="date"
                    // Lưu ý: <input type="date"> dùng format yyyy-mm-dd
                    value={birthdate}
                    onChange={(e) => setBirthdate(e.target.value)}
                    className="hide-date-icon appearance-none w-full h-11 rounded-[12px] border border-zinc-300 px-3.5 text-[15px] outline-none focus:ring-2 focus:ring-zinc-400"
                  />
                  <button
                    type="button"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md p-2 text-zinc-600 hover:bg-zinc-100"
                    onClick={() => {
                      const el = document.getElementById("birthdate-input") as HTMLInputElement | null;
                      // Ưu tiên mở native picker (Chromium hỗ trợ showPicker)
                      // Fallback: focus() để hiện picker trên các trình duyệt khác
                      (el as any)?.showPicker?.() ?? el?.focus();
                    }}
                    aria-label="Pick date"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                      <rect x="3" y="5" width="18" height="16" rx="2" ry="2" />
                      <path d="M16 3v4M8 3v4M3 11h18" />
                    </svg>
                  </button>
                </div>
              </div>


              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 h-11 w-full rounded-[18px] bg-red-600 text-white font-semibold text-[15px] hover:bg-red-700 disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create account"}
              </button>

              <p className="text-center text-[14px] pt-1">
                Already on ClariPix?{" "}
                <button
                  type="button"
                  className="font-semibold text-blue-700 hover:underline"
                  onClick={onGoToLogin}
                >
                  Log in
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
