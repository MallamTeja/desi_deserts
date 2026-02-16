<<<<<<< HEAD
import basundi from "@/assets/gulab-jamun.jpg";
import khaddukakheer from "@/assets/rasmalai.jpg";
import doubleKameta from "@/assets/jalebi.jpg";
=======
import basundi from "@/assets/jalebi.jpeg";
import kaddukheer from "@/assets/jalebi.jpeg";
import doubleKameta from "@/assets/jalebi.jpeg";
>>>>>>> 0cdc526d8fa8a04edf828c071ea906bde70d97e8

export const dessertImages: Record<string, string> = {
  "basundi": basundi,
  "khaddukakheer": khaddukakheer,
  "double-kameta": doubleKameeta,
};

export const getDessertImage = (key: string): string => {
  return dessertImages[key] || "/placeholder.svg";
};
