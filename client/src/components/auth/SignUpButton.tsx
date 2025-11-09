"use client";

import { useState } from "react";
import SignUpModal from "./SignUpModal";
import FavoritesModal from "./FavoritesModal";
import { RegisterDTO } from "@/src/interfaces/auth";
import { register } from "@/src/api/auth";
import { toast } from "sonner";

type Props = {
  className?: string;
  children?: React.ReactNode;
};

export default function SignUpButton({ className, children }: Props) {
  const [openSignup, setOpenSignup] = useState(false);
  const [openFav, setOpenFav] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpenSignup(true)}
        className={
          className ||
          "rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 md:px-5 md:py-2.5"
        }
      >
        {children ?? "Sign up"}
      </button>

      <SignUpModal
        open={openSignup}
        onClose={() => setOpenSignup(false)}
        onSignUp={async (email, password, birthdate, name, gender) => {
          const birth = birthdate ?? ''
          const user_name = name ?? "";
          const user_gender = gender ?? ''
          const registerDTO : RegisterDTO = {
            email, password, birthdate: birth , name: user_name, gender: user_gender,
          }
          const data = await register(registerDTO);
          console.log(data);
          toast.success("Sign Up successfully")
          setOpenSignup(false);
          setOpenFav(true);
        }}
        onGoToLogin={() => {
          setOpenSignup(false);
        }}
      />

      <FavoritesModal
        open={openFav}
        onClose={() => setOpenFav(false)}
        onSave={() => setOpenFav(false)}
      />
    </>
  );
}
