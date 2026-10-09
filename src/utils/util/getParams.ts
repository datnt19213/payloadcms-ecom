export const getParams = (param?: string): string => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
};
