export const GetLastStringFromUrl = (): string => {
  const url = window.location.href;
  const parsedUrl = new URL(url);
  const pathSegments = parsedUrl.pathname.split("/");
  return pathSegments[pathSegments.length - 1];
};
