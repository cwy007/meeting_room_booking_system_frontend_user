export const formatImgUrl = (url: string) => {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  return `http://localhost:3000/${url}`;
};