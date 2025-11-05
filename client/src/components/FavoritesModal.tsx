"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

type FavoritesModalProps = {
  open: boolean;
  onClose: () => void;
  onSave?: (favorites: string[]) => Promise<void> | void;
  topics?: string[];
  minSelect?: number; // default 3
};

const DEFAULT_TOPICS = [
  "Travel",
  "Food",
  "Art",
  "Nature",
  "Technology",
  "Fashion",
  "Fitness",
  "Sports",
  "Animals",
  "Music",
  "DIY",
  "Home Decor",
  "Cars",
  "Gaming",
  "Education",
];

const BLUR_PLACEHOLDER =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

function toSlug(label: string) {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function FavoritesModal({
  open,
  onClose,
  onSave,
  topics,
  minSelect = 3,
}: FavoritesModalProps) {
  const items = useMemo(() => {
    const names = topics ?? DEFAULT_TOPICS;
    return names.map((label) => {
      const slug = toSlug(label);
      return {
        key: label,
        label,
        image: `/topics/${slug}.jpg`,
      };
    });
  }, [topics]);

  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});

  if (!open) return null;

  const toggle = (key: string) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await onSave?.(selected);
    } finally {
      setSaving(false);
    }
  };

  const canContinue = selected.length >= minSelect;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute inset-0 flex items-start md:items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-[520px] max-h-[90vh] rounded-[28px] bg-white text-zinc-900 shadow-2xl ring-1 ring-black/5 overflow-hidden flex flex-col">
          {/* Close (fixed) */}
          <div className="flex items-center justify-end p-3 flex-shrink-0">
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

          {/* Header (fixed) */}
          <div className="px-7 flex-shrink-0">
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

            <h2 className="text-center text-[22px] md:text-[24px] leading-7 font-extrabold mb-2">
              Pick your favorites
            </h2>
            <p className="text-center text-[13px] text-zinc-600 mb-4">
              Choose at least {minSelect} topics to personalize your feed
            </p>
          </div>

          {/* Grid (scrollable area, added top padding) */}
          <div className="px-7 pt-3 pb-4 overflow-y-auto flex-1 scroll-py-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {items.map((it) => {
                const active = selected.includes(it.key);
                const isLoaded = !!loaded[it.key];

                return (
                  <button
                    key={it.key}
                    type="button"
                    onClick={() => toggle(it.key)}
                    aria-pressed={active}
                    className={[
                      "group relative cursor-pointer rounded-2xl overflow-hidden aspect-[4/3]",
                      "ring-1 ring-zinc-200 hover:ring-zinc-300",
                      "transform-gpu transition-transform duration-300 ease-out",
                      "hover:scale-[1.03] active:scale-95 hover:z-[1] hover:shadow-xl",
                      active ? "outline outline-2 outline-red-500" : "",
                    ].join(" ")}
                  >
                    {!isLoaded && <div className="absolute inset-0 animate-pulse bg-zinc-200" />}

                    <Image
                      src={it.image}
                      alt={it.label}
                      fill
                      sizes="(max-width: 640px) 50vw, 33vw"
                      quality={70}
                      placeholder="blur"
                      blurDataURL={BLUR_PLACEHOLDER}
                      className={[
                        "object-cover transition-opacity",
                        isLoaded ? "opacity-100" : "opacity-0",
                      ].join(" ")}
                      onLoadingComplete={() =>
                        setLoaded((prev) => ({ ...prev, [it.key]: true }))
                      }
                      onError={() =>
                        setLoaded((prev) => ({ ...prev, [it.key]: true }))
                      }
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

                    <span className="absolute left-2.5 bottom-2.5 text-white font-semibold text-[14px] drop-shadow pointer-events-none">
                      {it.label}
                    </span>

                    {active && (
                      <span className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white shadow">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer (fixed) */}
          <div className="px-7 pb-6 pt-2 border-t border-zinc-200 flex-shrink-0">
            <button
              onClick={handleSave}
              disabled={!canContinue || saving}
              className="h-11 w-full rounded-[18px] bg-red-600 text-white font-semibold text-[15px] hover:bg-red-700 disabled:opacity-60 cursor-pointer"
            >
              {saving ? "Saving..." : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
