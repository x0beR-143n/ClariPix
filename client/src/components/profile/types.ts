export type CollectionData = {
  id: string;
  name: string;
  description?: string;
  coverImage?: string; // first image URL or null
  imageCount: number;
};

export type ProfileData = {
  id: string;
  name: string;
  email: string;
  gender?: "male" | "female" | "other";
  birthdate?: string;
  avatar_url?: string;
  preferences?: string[];
  created_at: string;
  uploaded: string[];    // user's uploaded image URLs
  saved: string[];       // user's saved image URLs
  collections: CollectionData[]; // collection data with names
};

