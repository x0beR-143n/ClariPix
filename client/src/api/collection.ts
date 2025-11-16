/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { Collection, CollectionType } from "../interfaces/collection";
import { ImageMetadata } from "../interfaces/images";
import { axiosAuth } from "./api";

export async function getCollectionByID(collectionID: string) : Promise<CollectionType> {
    try {
        const data = await axiosAuth.get(`/collections/${collectionID}/images`);
        const collection : Collection = data.data.data.collection;
        const images : ImageMetadata[] = data.data.data.images;
        const collection_metadata : CollectionType = {
            collection: collection,
            images: images,
        }
        return collection_metadata;
    } catch (err : any) {
        if (axios.isAxiosError(err)) {
            if (!err.response) {
                throw { code: 'NETWORK', message: 'Network Error' }
            }
            throw {
                code: 'ServerError',
                message: 'Temporarily can not get collection. Please try again later',
            } 
        }
        throw { code: 'NETWORK', message: 'Network Error' } 
    }
}

export type UserCollection = {
    id: string;
    name: string;
    description?: string;
    created_at: string;
    images: ImageMetadata[];
}

export async function getUserCollections(): Promise<UserCollection[]> {
    try {
        const { data } = await axiosAuth.get<{ success: boolean; data: UserCollection[] }>('/collections/my-collections');
        if (data && 'data' in data) return data.data;
        return [];
    } catch (err: any) {
        if (axios.isAxiosError(err)) {
            if (!err.response) {
                throw { code: 'NETWORK', message: 'Network Error' }
            }
            throw {
                code: 'ServerError',
                message: 'Unable to load collections. Please try again later',
            }
        }
        throw { code: 'NETWORK', message: 'Network Error' }
    }
}

export async function addImageToCollection(collectionId: string, imageId: string): Promise<void> {
    try {
        await axiosAuth.post(`/collections/${collectionId}/images`, { imageIds: [imageId] });
    } catch (err: any) {
        if (axios.isAxiosError(err)) {
            if (!err.response) {
                throw { code: 'NETWORK', message: 'Network Error' }
            }
            throw {
                code: 'ServerError',
                message: 'Unable to add image to collection. Please try again later',
            }
        }
        throw { code: 'NETWORK', message: 'Network Error' }
    }
}