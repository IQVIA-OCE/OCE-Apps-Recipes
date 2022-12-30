import { DateTime } from 'luxon';
import { Platform } from 'react-native';
import { environment } from 'oce-apps-bridges';

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
