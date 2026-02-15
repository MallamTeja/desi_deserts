import gulabJamun from "@/assets/gulab-jamun.jpg";
import rasmalai from "@/assets/rasmalai.jpg";
import jalebi from "@/assets/jalebi.jpg";

export const dessertImages: Record<string, string> = {
  "gulab-jamun": gulabJamun,
  "rasmalai": rasmalai,
  "jalebi": jalebi,
};

export const getDessertImage = (key: string): string => {
  return dessertImages[key] || "/placeholder.svg";
};
