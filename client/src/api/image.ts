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

export const getAllImages = async (
  page: number,
  limit: number,
  queries?: string
): Promise<ImageMetadata[]> => {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      sorter: "created_at",
      order: "DESC",
    });

    if (queries && queries.trim()) {
      params.set("queries", queries.trim());
    }

    const res = await axiosBase.get(`/images?${params.toString()}`);

    if (!(res.status >= 200 && res.status < 300)) {
      return [];
    }

    let raw = res.data?.data;

    // 🔹 Nếu backend trả [ [img1, img2, ...] ] thì bóc ra [img1, img2, ...]
    if (Array.isArray(raw) && Array.isArray(raw[0])) {
      raw = raw[0];
    }

    // 🔹 Nếu không phải mảng thì coi như không có data hợp lệ
    if (!Array.isArray(raw)) {
      return [];
    }

    // 🔹 Lọc bớt phần tử lỗi / thiếu image_url
    const cleaned: ImageMetadata[] = raw.filter(
      (item) =>
        item &&
        typeof item.image_url === "string" &&
        item.image_url.trim() !== ""
    );

    return cleaned;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (!err.response) {
        throw { code: "NETWORK", message: "Network Error" };
      }
      throw {
        code: "ServerError",
        message: "Temporarily can not get images. Please try again later",
      };
    }
    throw { code: "NETWORK", message: "Network Error" };
  }
};

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

