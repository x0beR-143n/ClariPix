import { ImageMetadata } from "./images";

export interface CollectionType {
    collection: Collection
    images: ImageMetadata[];
}

export interface Collection {
    id: string;
    name: string;
    description: string;
    privacy?: "public" | "private" | "friends";
    tags?: string[];
    created_at: string;
}