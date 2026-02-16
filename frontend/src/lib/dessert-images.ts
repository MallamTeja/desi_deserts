// Use direct static paths from the public directory for better reliability in local dev
export const dessertImages: Record<string, string> = {
  "basundi": "/images/basundi.png",
  "kaddu-ki-kheer": "/images/kaddu-ki-kheer.png",
  "kaddu-ka-kheer": "/images/kaddu-ki-kheer.png",
  "double-ka-meetha": "/images/double-ka-meetha.png",
  // Maintaining old keys for backward compatibility
  "khaddukakheer": "/images/kaddu-ki-kheer.png",
  "kaddukhakheer": "/images/kaddu-ki-kheer.png",
  "double-kameta": "/images/double-ka-meetha.png",
  "doublekameeta": "/images/double-ka-meetha.png",
};

export const getDessertImage = (key: string): string => {
  if (!key) return "/placeholder.svg";
  const normalizedKey = key.toLowerCase().replace(/\s+/g, '-');
  const result = dessertImages[key] || dessertImages[normalizedKey] || "/placeholder.svg";
  console.log(`[getDessertImage] key="${key}", normalizedKey="${normalizedKey}", found=${result !== "/placeholder.svg"}, path=${result}`);
  return result;
};
