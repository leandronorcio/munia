export const getAvatarFallback = (name: string) =>
  name
    .split(' ')
    .slice(0, 2)
    .map((item) => item[0])
    .join('')
    .toUpperCase();
