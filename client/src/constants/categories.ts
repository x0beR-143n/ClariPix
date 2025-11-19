export const AVAILABLE_CATEGORIES = [
  "travel",
  "food",
  "art",
  "nature",
  "technology",
  "fashion",
  "fitness",
  "sports",
  "animals",
  "music",
  "diy",
  "home decor",
  "cars",
  "gaming",
  "education",
] as const;

export type Category = typeof AVAILABLE_CATEGORIES[number];

