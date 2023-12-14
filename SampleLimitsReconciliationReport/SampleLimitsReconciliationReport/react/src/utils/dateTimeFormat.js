import { DateTime } from 'luxon';
import { environment } from 'oce-apps-bridges';

const locale = environment.locale().replace('_', '-');

export const formatDate = (date) => {
  const dt = DateTime.fromISO(date);
  return dt.isValid
    ? dt.setLocale(locale).toLocaleString(DateTime.DATE_MED)
    : null;
};
