import basundi from "@/assets/gulab-jamun.jpg";
import kaddukheer from "@/assets/rasmalai.jpg";
import doubleKameta from "@/assets/jalebi.jpg";

export const dessertImages: Record<string, string> = {
  "basundi": basundi,
  "kaddukheer": kaddukheer,
  "double-kameta": doubleKameta,
};

export const getDessertImage = (key: string): string => {
  return dessertImages[key] || "/placeholder.svg";
};
