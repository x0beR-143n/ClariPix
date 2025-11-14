import { axiosBase } from "./api";
import { ImageMetadata } from "../interfaces/images";
import axios from "axios";

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
