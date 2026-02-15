import basundi from "@/assets/jalebi.jpeg";
import kaddukheer from "@/assets/jalebi.jpeg";
import doubleKameta from "@/assets/jalebi.jpeg";

export const dessertImages: Record<string, string> = {
  "basundi": basundi,
  "kaddukheer": kaddukheer,
  "double-kameta": doubleKameta,
};

export const getDessertImage = (key: string): string => {
  return dessertImages[key] || "/placeholder.svg";
};
