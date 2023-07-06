import { capitalizeFirstLetter } from './capitalizeFirstLettet';

export const reverseCapitalizeWithUnderscores = (str: string) => {
  return capitalizeFirstLetter(str.toLowerCase().replace(/_/g, ' '));
};
