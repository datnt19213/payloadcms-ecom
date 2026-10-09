const removeVietnameseTones = (str: string): string => {
  str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  str = str.replace(/đ/g, "d").replace(/Đ/g, "D");
  return str;
};

/**
 * The `convertToSlug` function takes a string input, removes Vietnamese tones, replaces spaces with
 * hyphens, and returns the resulting slug.
 * @param {string} input - The `convertToSlug` function takes a string input and converts it into a
 * slug format. The input string is the text that you want to convert into a slug. The function removes
 * Vietnamese tones from the input, replaces multiple spaces with a single space, and then replaces
 * spaces with hyphens to
 * @returns The `convertToSlug` function returns a string that is the input string converted into a
 * slug format. The input string has Vietnamese tones removed, spaces condensed, and spaces replaced
 * with hyphens.
 */
export const convertToSlug = (input: string): string => {
  let result = removeVietnameseTones(input);
  result = result.replace(/\s+/g, " ");
  result = result.replace(/ /g, "-");

  return result;
};
