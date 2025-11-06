"use client";

type PictureDescriptionProps = {
  description?: string;
};

export default function PictureDescription({
  description,
}: PictureDescriptionProps) {
  if (!description) return null;

  return (
    <div className="mb-6">
      <p className="text-base text-zinc-700 leading-relaxed whitespace-pre-line">
        {description}
      </p>
    </div>
  );
}

