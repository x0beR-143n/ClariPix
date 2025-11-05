"use client";

import { useState } from "react";
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";

type Props = {
  className?: string;
  children?: React.ReactNode;
};

export default function LoginButton({ className, children }: Props) {
  const [openLogin, setOpenLogin] = useState(false);
  const [openSignup, setOpenSignup] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpenLogin(true)}
        className={
          className ||
          "rounded-full bg-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-300 md:px-5 md:py-2.5"
        }
      >
        {children ?? "Log in"}
      </button>

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
        onSignUp={() => setOpenSignup(false)}
        onGoToLogin={() => {
          setOpenSignup(false);
          setOpenLogin(true);
        }}
      />
    </>
  );
}
