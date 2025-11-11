import { axiosAuth as http } from "../src/api/api";

export type UploadedImage = {
  id: string;
  image_url: string;
  description?: string | null;
};

export async function uploadMultipleImages(
  files: File[],
  descriptions?: (string | null | undefined)[]
) {
  const form = new FormData();
  files.forEach((f) => form.append("images", f));
  if (descriptions && descriptions.length) {
    form.append("descriptions", JSON.stringify(descriptions));
  }

  const { data } = await http.post("/images/uploads", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  // server returns { status:'success', data:[...] } for multi-upload
  return (data?.data || []) as UploadedImage[];
}

export async function uploadSingleImage(file: File, description?: string) {
  const form = new FormData();
  form.append("image", file);
  if (description) form.append("description", description);
  const { data } = await http.post("/images/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  // server returns { status:'success', data:{...} }
  return data?.data as UploadedImage;
}
