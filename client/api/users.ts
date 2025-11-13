import { axiosAuth as http } from "../src/api/api";

export type MyImage = {
  id: string;
  image_url: string;
  description?: string | null;
};

export async function getMyImages(page = 1, limit = 50) {
  const { data } = await http.get(`/users/my-images`, { params: { page, limit } });
  const payload = data?.data || {};
  return {
    images: (payload.images || []) as MyImage[],
    pagination: payload.pagination || { page, limit, total: 0, totalPages: 0 },
  };
}

