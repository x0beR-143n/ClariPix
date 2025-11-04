
"use client";

import { useState } from "react";
import LoginModal from "../components/LoginModal";
import SignUpModal from "../components/SignUpModal";
import FavoritesModal from "../components/FavoritesModal";

export default function Home() {
  const [openLogin, setOpenLogin] = useState(false);
  const [openSignup, setOpenSignup] = useState(false);
  const [openFav, setOpenFav] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Top-right actions only */}
      <header className="w-full p-3 md:p-4">
        <div className="ml-auto flex w-full items-center justify-end gap-2 md:gap-3">
          <button
            onClick={() => setOpenLogin(true)}
            className="rounded-full bg-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-300 md:px-5 md:py-2.5"
          >
            Log in
          </button>
          <button
            onClick={() => setOpenSignup(true)}
            className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 md:px-5 md:py-2.5"
          >
            Sign up
          </button>
        </div>
      </header>

      {/* Modals */}
      <LoginModal
        open={openLogin}
        onClose={() => setOpenLogin(false)}
        onLogin={() => setOpenLogin(false)}
        onOpenSignup={() => {
          setOpenLogin(false);
          setOpenSignup(true);
        }}
      />

      <SignUpModal
        open={openSignup}
        onClose={() => setOpenSignup(false)}
        onSignUp={() => {
          setOpenSignup(false);
          setOpenFav(true);
        }}
        onGoToLogin={() => {
          setOpenSignup(false);
          setOpenLogin(true);
        }}
      />

      <FavoritesModal
        open={openFav}
        onClose={() => setOpenFav(false)}
        onSave={() => setOpenFav(false)}
      />
    </div>
  );
}
