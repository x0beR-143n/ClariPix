"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 text-zinc-700 hover:text-zinc-900 mb-6 transition-colors"
    >
      <ArrowLeft size={20} />
      <span className="text-sm font-medium">Back to home</span>
    </Link>
  );
}

