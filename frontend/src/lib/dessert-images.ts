import basundiImg from "@/assets/basundi.png";
import kadduImg from "@/assets/kaddu-ki-kheer.png";
import doubleImg from "@/assets/double-ka-meetha.png";

export const dessertImages: Record<string, string> = {
  "basundi": basundiImg,
  "kaddu-ki-kheer": kadduImg,
  "kaddu-ka-kheer": kadduImg,
  "double-ka-meetha": doubleImg,
  // Maintaining old keys for backward compatibility
  "khaddukakheer": kadduImg,
  "kaddukhakheer": kadduImg,
  "double-kameta": doubleImg,
  "doublekameeta": doubleImg,
};

export const getDessertImage = (key: string): string => {
  if (!key) return "/placeholder.svg";
  const normalizedKey = key.toLowerCase().replace(/\s+/g, '-');
  const result = dessertImages[key] || dessertImages[normalizedKey] || "/placeholder.svg";
  console.log(`[getDessertImage] key="${key}", normalizedKey="${normalizedKey}", found=${result !== "/placeholder.svg"}`);
  return result;
};
