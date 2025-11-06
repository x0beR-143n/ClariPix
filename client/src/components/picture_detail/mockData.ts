import type { PictureData } from "./types";

export const getMockPictureData = (id: string): PictureData => {
  const imageUrl = decodeURIComponent(id);

  return {
    id: id,
    image_url: imageUrl,
    title: "Beautiful Album Cover Art",
    description:
      "This is a stunning piece of album artwork featuring vibrant colors and creative design. The composition showcases artistic excellence and attention to detail.",
    uploader: {
      id: "user-123",
      username: "artist_name",
      display_name: "Artist Name",
      avatar_url: "/img/ava_main.jpg",
    },
    categories: ["Music", "Art", "Design"],
    total_views: 12543,
    total_likes: 892,
    total_comments: 45,
    created_at: "2024-01-15T10:30:00Z",
    is_liked: false,
    is_saved: false,
  };
};

