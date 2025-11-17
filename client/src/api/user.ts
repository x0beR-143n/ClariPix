// src/api/user.ts
import { axiosAuth } from './api'
import type { ProfileData } from '../components/profile/types'

export const setPreferences = async (preferences: string[]) => {
  preferences = preferences.map(pref => pref.toLowerCase())
  const { data } = await axiosAuth.post('/users/preferences', { preferences })
  return data
}

export type ServerImage = {
  id: string
  uploader_id: string
  image_url: string
  description?: string
  safe_score?: number
  adult_level?: string
  violence_level?: string
  racy_level?: string
  categories?: string[]
  created_at: string
  total_views?: number
  total_likes?: number
  safe_search_status?: string
  categorization_status?: string
}

export type ServerCollection = {
  id: string
  user_id: string
  name: string
  description?: string
  created_at: string
  images: ServerImage[]
}

export type ServerProfile = {
  id: string
  name: string
  email: string
  gender?: 'male' | 'female' | 'other' | null
  birthdate?: string | null
  avatar_url?: string | null
  preferences?: string[]
  created_at: string
  recent_images: ServerImage[]
  collections: ServerCollection[]
}

export type ServerProfileResponse = {
  success: boolean
  data: ServerProfile
}

export const getUserProfile = async (): Promise<ServerProfile> => {
  const { data } = await axiosAuth.get<ServerProfileResponse>('/users/profile')
  if (data && 'data' in data) return (data as ServerProfileResponse).data
  return data as ServerProfile
}

export function mapServerProfileToProfileData(p: ServerProfile): ProfileData {
  const uploaded = (p.recent_images || [])
    .map((img) => img?.image_url)
    .filter((url): url is string => Boolean(url) && typeof url === 'string')
  
  const collections = (p.collections || []).map((col) => ({
    id: col.id,
    name: col.name,
    description: col.description,
    coverImage: col.images?.[0]?.image_url,
    imageCount: col.images?.length || 0,
  }))

  return {
    id: p.id,
    name: p.name,
    email: p.email,
    gender: p.gender || undefined,
    birthdate: p.birthdate || undefined,
    avatar_url: p.avatar_url || undefined,
    preferences: p.preferences || [],
    created_at: p.created_at,
    uploaded,
    saved: [],
    collections,
  }
}

export async function fetchCurrentUserProfile(): Promise<ProfileData> {
  const server = await getUserProfile()
  return mapServerProfileToProfileData(server)
}

