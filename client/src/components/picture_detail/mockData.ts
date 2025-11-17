import type { PictureData } from "./types";

export const getMockPictureData = (id: string): PictureData => {
  const imageUrl = decodeURIComponent(id);

  return {
    id: id,
    image_url: imageUrl,
    description: "Beautiful Album Cover Art",
    uploader_id: "user-123",
    uploader_name: "Artist Name",
    categories: ["Music", "Art", "Design"],
    total_views: 12543,
    total_likes: 892,
    created_at: "2024-01-15T10:30:00Z",
    is_liked: false,
  };
};

// Mock related images (fetch using APIs later on)
export const getMockRelatedImages = (_categories?: string[]): string[] => {
  return [
    "https://res.cloudinary.com/dbysi3x4e/image/upload/v1759316670/hotpink_cqjleo.jpg",
    "https://res.cloudinary.com/dbysi3x4e/image/upload/v1759316669/scarlet_wkmqjc.jpg",
    "https://res.cloudinary.com/dbysi3x4e/image/upload/v1759232912/planet-her_owrm71.jpg",
    "https://res.cloudinary.com/dbysi3x4e/image/upload/v1759571460/v_yfxwao.png",
    "https://res.cloudinary.com/dbysi3x4e/image/upload/v1759680066/eternal-sunshines_xxsizo.jpg",
    "https://res.cloudinary.com/dbysi3x4e/image/upload/v1759678761/Yours_Truly_ja27qs.webp",
    "https://res.cloudinary.com/dbysi3x4e/image/upload/v1759678759/My_Everything_uq66ui.png",
    "https://res.cloudinary.com/dbysi3x4e/image/upload/v1759678758/Dangerous_Woman_jy3l2i.jpg",
    "https://res.cloudinary.com/dbysi3x4e/image/upload/v1759374720/austin_wucboq.jpg",
    "https://res.cloudinary.com/dbysi3x4e/image/upload/v1759374720/twelve-carat-toothache-album_ijz6iz.jpg",
    "https://res.cloudinary.com/dbysi3x4e/image/upload/v1759374718/beerbong_dxownv.jpg",
    "https://res.cloudinary.com/dbysi3x4e/image/upload/v1759374718/Post-Malone-F-1-Trillion_gwdrw0.webp",
    "https://res.cloudinary.com/dbysi3x4e/image/upload/v1759678663/Sweetener_k4j8dd.jpg",
    "https://res.cloudinary.com/dbysi3x4e/image/upload/v1759571443/Overexposed_njovkp.jpg",
    "https://res.cloudinary.com/dbysi3x4e/image/upload/v1759374721/Post-Malone-Hollywoods-Bleeding_iakfas.webp",
    "https://res.cloudinary.com/dbysi3x4e/image/upload/v1759374720/stoney_wszlvr.jpg",
    "https://res.cloudinary.com/dbysi3x4e/image/upload/v1759678642/Thank_U_Next_xfbvpy.jpg",
    "https://res.cloudinary.com/dbysi3x4e/image/upload/v1759678587/Positions_eeujsv.webp",
    "https://res.cloudinary.com/dbysi3x4e/image/upload/v1759678980/true_egt1mn.webp",
    "https://res.cloudinary.com/dbysi3x4e/image/upload/v1759678979/Stories_vqzd8c.webp",
  ];
};

