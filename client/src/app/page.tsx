import MasonryGallery from "../components/home/MasonryImageDisplay";
import SearchHeader from "../components/shared/SearchHeader";

export const images = [
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
  "https://res.cloudinary.com/dbysi3x4e/image/upload/v1759678977/AV%C4%AACI_01_EP_fpf2jc.jpg",
  "https://res.cloudinary.com/dbysi3x4e/image/upload/v1759678862/The_Days_Nights_EP_rrf6xt.jpg",
  "https://res.cloudinary.com/dbysi3x4e/image/upload/v1759678822/TIM_pgtasj.jpg",
  "https://res.cloudinary.com/dbysi3x4e/image/upload/v1759679779/Don_t_Smile_at_Me_EP_nau2sv.jpg",
  "https://res.cloudinary.com/dbysi3x4e/image/upload/v1759679775/When_We_All_Fall_Asleep_Where_Do_We_go_zwmkav.jpg",
  "https://res.cloudinary.com/dbysi3x4e/image/upload/v1759679773/HIT_ME_HARD_AND_SOFT_rvaovt.webp",
  "https://res.cloudinary.com/dbysi3x4e/image/upload/v1759316862/amala_xxrrmt.jpg",
  "https://res.cloudinary.com/dbysi3x4e/image/upload/v1759571449/Red_Pill_Blues_ds1fco.png",
  "https://res.cloudinary.com/dbysi3x4e/image/upload/v1759571447/Hands_All_Over_bx0fun.png",
  "https://res.cloudinary.com/dbysi3x4e/image/upload/v1759571445/It_Won_t_Be_Soon_Before_Long_gykoj1.jpg",
  "https://res.cloudinary.com/dbysi3x4e/image/upload/v1759571442/Songs_About_Jane_hcv3pl.png",
]

export default function Home() {
  return (
    <div className="p-6 flex flex-col gap-y-10">
      <SearchHeader />
      <MasonryGallery images={images}></MasonryGallery>
    </div>
  );
}
