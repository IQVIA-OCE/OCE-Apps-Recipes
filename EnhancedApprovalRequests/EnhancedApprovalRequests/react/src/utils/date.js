import { DateTime } from 'luxon';
import { environment } from 'oce-apps-bridges';

const userLocale = environment.locale().replace('_', '-');

export const formatDateInUserLocaleAndTimezone = date => {
  const dt = DateTime.fromISO(date, { zone: 'utc' });

  return dt.isValid
    ? dt
      .setLocale(userLocale)
      .setZone(environment.timeZone())
      .toLocaleString(DateTime.DATETIME_SHORT)
    : null;
};
