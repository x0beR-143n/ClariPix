export type PictureData = {
  id: string;
  image_url: string;
  title: string;
  description?: string;
  uploader: {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string;
  };
  categories?: string[];
  total_views: number;
  total_likes: number;
  total_comments: number;
  created_at: string;
  is_liked: boolean;
  is_saved: boolean;
};

