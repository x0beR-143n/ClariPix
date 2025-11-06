"use client";

type PictureMetadataProps = {
  created_at: string;
};

export default function PictureMetadata({ created_at }: PictureMetadataProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="mt-auto pt-6 border-t border-zinc-200">
      <p className="text-sm text-zinc-500">
        Published on {formatDate(created_at)}
      </p>
    </div>
  );
}

