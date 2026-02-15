import basundi from "@/assets/gulab-jamun.jpg";
import khaddukakheer from "@/assets/rasmalai.jpg";
import doubleKameta from "@/assets/jalebi.jpg";

export const dessertImages: Record<string, string> = {
  "basundi": basundi,
  "khaddukakheer": khaddukakheer,
  "double-kameta": doubleKameeta,
};

export const getDessertImage = (key: string): string => {
  return dessertImages[key] || "/placeholder.svg";
};
