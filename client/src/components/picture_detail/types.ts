export type PictureData = {
  id: string;
  image_url: string;
  description?: string;
  uploader_id: string;
  uploader_name?: string;
  categories?: string[];
  total_views: number;
  total_likes: number;
  created_at: string;
  is_liked: boolean;
};

