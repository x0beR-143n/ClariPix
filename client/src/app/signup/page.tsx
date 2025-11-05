"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [birthdate, setBirthdate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      // TODO: replace with real sign-up call
      await new Promise((r) => setTimeout(r, 800));
    } catch (err: any) {
      setError(err?.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center px-4 py-8">
      <div className="h-12 w-12 rounded-full overflow-hidden mb-5">
        <Image src="/claripix_logo.png" alt="ClariPix logo" width={48} height={48} className="h-full w-full object-contain" priority />
      </div>

      <div className="w-full max-w-[420px] rounded-[14px] bg-white text-zinc-900 shadow-lg ring-1 ring-black/5">
        <form onSubmit={handleSubmit} className="p-5 md:p-6 space-y-4">
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
            <p className="mt-2 text-[13px] text-zinc-600">Use 8 or more letters, numbers and symbols</p>
          </div>

          {/* Birthdate */}
          <div>
            <label className="mb-1 block text-[13px] font-semibold">Birthdate</label>
            <div className="relative">
              <input
                type="text"
                placeholder="dd/mm/yyyy"
                inputMode="numeric"
                pattern="^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[0-2])\/\d{4}$"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                className="w-full h-11 rounded-[12px] border border-zinc-300 px-3.5 pr-11 text-[15px] outline-none focus:ring-2 focus:ring-zinc-400"
              />
              <button
                type="button"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md p-2 text-zinc-600 hover:bg-zinc-100"
                onClick={() => {
                  // simple focus; could open a custom date picker in the future
                  (document.getElementById("birthdate-input") as HTMLInputElement | null)?.focus();
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
        </form>

        <div className="px-6 pb-5">
          <p className="text-center text-[14px]">
            Already on ClariPix? {" "}
            <Link href="/" className="font-semibold text-blue-700 hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

