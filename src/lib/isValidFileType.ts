export const isValidFileType = (str: string) => {
  const validTypes = ['jpg', 'jpeg', 'png', 'mp4', 'mov', 'avi'];
  return validTypes.includes(str);
};
