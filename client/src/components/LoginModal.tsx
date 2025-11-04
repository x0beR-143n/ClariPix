"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type LoginModalProps = {
  open: boolean;
  onClose: () => void;
  onLogin?: (email: string, password: string) => Promise<void> | void;
  onOpenSignup?: () => void;
};

export default function LoginModal({ open, onClose, onLogin, onOpenSignup }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      await onLogin?.(email, password);
    } catch (err: any) {
      setError(err?.message || "Login failed");
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
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
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

            <h2 className="text-center text-[22px] md:text-[24px] leading-7 font-extrabold mb-6">Log in to see more</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="mb-1 block text-[13px] font-semibold">Email</label>
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
                <label className="mb-1 block text-[13px] font-semibold">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full h-11 rounded-[12px] border border-zinc-300 px-3.5 pr-11 text-[15px] outline-none focus:ring-2 focus:ring-zinc-400"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md p-2 text-zinc-600 hover:bg-zinc-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12 18 18.75 12 18.75 2.25 12 2.25 12Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-3 h-11 w-full rounded-[18px] bg-red-600 text-white font-semibold text-[15px] hover:bg-red-700 disabled:opacity-60"
              >
                {loading ? "Logging in..." : "Log in"}
              </button>

              <button type="button" className="text-[13px] font-semibold text-blue-700 hover:underline">
                Forgot your password?
              </button>

              <hr className="my-4 border-zinc-200" />

              <p className="text-center text-[14px]">
                Not on ClariPix yet? {" "}
                {onOpenSignup ? (
                  <button type="button" className="font-semibold text-blue-700 hover:underline" onClick={onOpenSignup}>
                    Sign up
                  </button>
                ) : (
                  <Link href="/signup" className="font-semibold text-blue-700 hover:underline">Sign up</Link>
                )}
              </p>

              <p className="text-center pt-2 text-[12px] text-zinc-600 leading-5">
                By continuing, you agree to ClariPix's <a className="underline" href="#">Terms of Service</a> and acknowledge you've read our <a className="underline" href="#">Privacy Policy</a>.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
