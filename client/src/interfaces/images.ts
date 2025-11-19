export interface ImageMetadata {
  id: string
  uploader_id: string
  image_url: string
  description: string
  safe_score: number
  adult_level: string
  violence_level: string
  racy_level: string
  categories: string[]
  created_at: string
  total_views: number
  total_likes: number
  safe_search_status: string
  categorization_status: string
}
