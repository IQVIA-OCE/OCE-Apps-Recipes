import { DateTime } from 'luxon';
import { Dimensions, Platform } from 'react-native';
import { environment } from '@oce-apps/oce-apps-bridges';

export const stringToHslColor = (str, s, l) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const h = hash % 360;

  return 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
};

const userLocale = environment.locale().replace('_', '-');

export const formatDateInUserLocale = date => {
  const dt = DateTime.fromISO(date, { zone: 'utc' });

  return dt.isValid
    ? dt
        .setLocale(userLocale)
        .setZone(environment.timeZone())
        .toLocaleString(DateTime.DATETIME_MED)
    : null;
};

export const isIphone = typeof Platform.isPad === 'undefined' ? false : !Platform.isPad;

export const isWeb = Platform.OS === 'web';

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

export const isMobilePhone = isIphone || isAndroidPhone;
