import { axiosAuth as http } from "../src/api/api";

export type CreateCollectionPayload = {
  name: string;
  description?: string;
};

export async function createCollection(payload: CreateCollectionPayload) {
  const { data } = await http.post("/collections", payload);
  // server returns { success:true, data:{ id, ... } }
  return data?.data as { id: string };
}

export async function addImagesToCollection(collectionId: string, imageIds: string[]) {
  const { data } = await http.post(`/collections/${collectionId}/images`, { imageIds });
  return data;
}
