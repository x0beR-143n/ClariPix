
import { axiosBase, axiosAuth } from './api'
import { ImageMetadata } from '../interfaces/images'
import axios from 'axios';

export type ServerImageDetail = {
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

export type ServerImageDetailResponse = {
  status: string
  data: ServerImageDetail
}

export const getImageById = async (imageId: string): Promise<ServerImageDetail> => {
  try {
    const { data } = await axiosBase.get<ServerImageDetailResponse>(`/images/${imageId}`)
    if (data && 'data' in data) return (data as ServerImageDetailResponse).data
    return data as ServerImageDetail
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (!err.response) {
        throw { code: 'NETWORK', message: 'Network Error' }
      }
      throw {
        code: 'ServerError',
        message: 'Unable to load image. Please try again later',
      }
    }
    throw { code: 'NETWORK', message: 'Network Error' }
  }
}

export const getAllImages = async (page: number, limit: number ) : Promise<ImageMetadata[]> => {
  try {
    const data = await axiosBase.get(`/images?page=${page}&limit=${limit}`);
    const isSuccess = data.status;
    if(isSuccess) {
        // console.log(data.data.data);
        return data.data.data;
    } else {
        return [];
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (!err.response) {
        throw { code: 'NETWORK', message: 'Network Error' }
      }
      throw {
        code: 'ServerError',
        message: 'Temporarily can not get images. Please try again later',
      } 
    }
    throw { code: 'NETWORK', message: 'Network Error' } 
  }
}

export const deleteImage = async (imageId: string): Promise<void> => {
  try {
    await axiosAuth.delete(`/images/${imageId}`);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (!err.response) {
        throw { code: 'NETWORK', message: 'Network Error' }
      }
      throw {
        code: 'ServerError',
        message: err.response.data?.message || 'Unable to delete image. Please try again later',
      }
    }
    throw { code: 'NETWORK', message: 'Network Error' }
  }
}

