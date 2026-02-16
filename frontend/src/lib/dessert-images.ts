import basundiImg from "@/assets/basundi.png";
import kadduImg from "@/assets/kaddu-ki-kheer.png";
import doubleImg from "@/assets/double-ka-meetha.png";

export const dessertImages: Record<string, string> = {
  "basundi": basundiImg,
  "kaddu-ki-kheer": kadduImg,
  "double-ka-meetha": doubleImg,
  // Maintaining old keys for backward compatibility if needed, but pointing to correct images
  "khaddukakheer": kadduImg,
  "double-kameta": doubleImg,
};

export const getDessertImage = (key: string): string => {
  if (!key) return "/placeholder.svg";
  return dessertImages[key] || dessertImages[key.toLowerCase().replace(/\s+/g, '-')] || "/placeholder.svg";
};
