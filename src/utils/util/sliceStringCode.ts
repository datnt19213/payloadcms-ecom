export const cutString = (str: string): string => {
  if (str.length < 20) {
    throw new Error("String must be least 9 letters.");
  }

  const firstFour = str.slice(0, 4);
  const middleStartIndex = Math.floor((str.length - 1) / 2);
  const middle = str.slice(middleStartIndex, middleStartIndex + 2);
  const lastThree = str.slice(-3);

  return firstFour + middle + lastThree;
};
