import { Platform, Dimensions } from 'react-native';

export const isIphone = typeof Platform.isPad === 'undefined' ? false : !Platform.isPad;

export const isAndroid = Platform.OS === 'android';

// @TODO: use library react-native-device-info for this check
const isTablet = () => {
  const widthPixels = Dimensions.get('screen').width;
  const heightPixels = Dimensions.get('screen').height;
  const densityDpi = 160;

  const widthInches = widthPixels / densityDpi;
  const heightInches = heightPixels / densityDpi;
  const diagonalSizeInches = Math.sqrt(Math.pow(widthInches, 2) + Math.pow(heightInches, 2));

  return diagonalSizeInches > 6.9 && diagonalSizeInches <= 18.0;
}

export const isAndroidPhone = isAndroid && !isTablet();

export const isMobilePhone = isIphone || isAndroidPhone

export const isWeb = Platform.OS === 'web';
