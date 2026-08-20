import { SECOND } from '../constants/time';

/**
 * @typedef {Object} TimeDiff
 * @property {number} days
 * @property {number} hours
 * @property {number} minutes
 * @property {number} seconds
 *
 * @param  {number} ms
 * @return TimeDiff
 */
export const computeTimeDiff = ms => {
  const seconds = ms / SECOND;

  return {
    days: Math.floor(seconds / (3600 * 24)),
    hours: Math.floor((seconds / 3600) % 24),
    minutes: Math.floor((seconds / 60) % 60),
    seconds: Math.floor(seconds % 60),
  };
};
