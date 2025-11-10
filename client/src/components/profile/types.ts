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
  collections: string[]; // collection cover image URLs (mocked)
};

