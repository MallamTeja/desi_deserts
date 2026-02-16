import basundiImg from "@/assets/basundi.png";
import kadduImg from "@/assets/kaddukhakheer.png";
import doubleImg from "@/assets/doublekameeta.png";

export const dessertImages: Record<string, string> = {
  "basundi": basundiImg,
  "khaddukakheer": kadduImg,
  "double-kameta": doubleImg,
  // Normalize keys to standard names used in other parts of the app
  "kaddu-ki-kheer": kadduImg,
  "double-ka-meetha": doubleImg,
};

export const getDessertImage = (key: string): string => {
  if (!key) return "/placeholder.svg";
  return dessertImages[key] || dessertImages[key.toLowerCase().replace(/\s+/g, '-')] || "/placeholder.svg";
};
