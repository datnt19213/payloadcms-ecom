export const capitalizeFirstLetter = (text: string): string => {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const capitalizeEachWord = (text: string): string => {
  return text
    .split(" ")
    .map((word) => capitalizeFirstLetter(word))
    .join(" ");
};
export const capitalizeAllLetter = (text: string): string => {
  return text.toUpperCase();
};
