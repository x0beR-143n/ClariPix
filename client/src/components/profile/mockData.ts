import type { ProfileData } from "./types";

export const getMockProfileData = (id: string): ProfileData => {
  // Mock images for the profile
  const uploaded = [
    "https://res.cloudinary.com/dbysi3x4e/image/upload/v1759316670/hotpink_cqjleo.jpg",
    "https://res.cloudinary.com/dbysi3x4e/image/upload/v1759316669/scarlet_wkmqjc.jpg",
    "https://res.cloudinary.com/dbysi3x4e/image/upload/v1759232912/planet-her_owrm71.jpg",
    "https://res.cloudinary.com/dbysi3x4e/image/upload/v1759571460/v_yfxwao.png",
    "https://res.cloudinary.com/dbysi3x4e/image/upload/v1759680066/eternal-sunshines_xxsizo.jpg",
  ];

  const saved = [
    "https://res.cloudinary.com/dbysi3x4e/image/upload/v1759678761/Yours_Truly_ja27qs.webp",
    "https://res.cloudinary.com/dbysi3x4e/image/upload/v1759678759/My_Everything_uq66ui.png",
    "https://res.cloudinary.com/dbysi3x4e/image/upload/v1759678758/Dangerous_Woman_jy3l2i.jpg",
    "https://res.cloudinary.com/dbysi3x4e/image/upload/v1759374720/austin_wucboq.jpg",
  ];

  const collections = [
    "https://res.cloudinary.com/dbysi3x4e/image/upload/v1759374720/twelve-carat-toothache-album_ijz6iz.jpg",
    "https://res.cloudinary.com/dbysi3x4e/image/upload/v1759374718/beerbong_dxownv.jpg",
    "https://res.cloudinary.com/dbysi3x4e/image/upload/v1759374718/Post-Malone-F-1-Trillion_gwdrw0.webp",
  ];

  return {
    id: id,
    name: "Artist Name",
    email: "artist@example.com",
    gender: "other",
    birthdate: "1995-05-15",
    avatar_url: "/img/ava_main.jpg",
    preferences: ["Music", "Art", "Design", "Fashion"],
    created_at: "2023-01-15T10:30:00Z",
    uploaded,
    saved,
    collections,
  };
};

