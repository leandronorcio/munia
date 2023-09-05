export const isValidFileType = (fileType: string) => {
  const validTypes = ['jpg', 'jpeg', 'png', 'mp4', 'mov', 'avi'];
  return validTypes.includes(fileType.split('/')[1]);
};
