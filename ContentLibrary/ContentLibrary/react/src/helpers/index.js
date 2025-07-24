import { Dimensions } from 'react-native';

export const isTablet = () => {
  const widthPixels = Dimensions.get('screen').width;
  const heightPixels = Dimensions.get('screen').height;
  const densityDpi = 160;

  const widthInches = widthPixels / densityDpi;
  const heightInches = heightPixels / densityDpi;
  const diagonalSizeInches = Math.sqrt(
    Math.pow(widthInches, 2) + Math.pow(heightInches, 2)
  );

  return diagonalSizeInches > 6.9 && diagonalSizeInches <= 18.0;
};
