import { DateTime } from 'luxon';

export const THRESHOLD_ERROR =
  'You have reached the limit on your threshold for changes. You can no longer edit this plan.';
export const DATES_ERROR = (start = '', end = '') =>
  `You can only edit this plan between ${DateTime.fromISO(start).toFormat(
    'MMM dd, yyyy'
  )} and ${DateTime.fromISO(end).toFormat('MMM dd, yyyy')}`;
