export const truncateText = (
  text: string,
  maxLengthOfText: number = 50
): string => {
  if (text.length <= maxLengthOfText) return text;
  return text.slice(0, maxLengthOfText - 3) + "...";
};
