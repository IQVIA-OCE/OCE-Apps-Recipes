import { TRENDS } from '../constants';

export const getTrend = (thisPeriod, previousPeriod) => {
  switch (true) {
    case (thisPeriod > previousPeriod):
      return TRENDS.GROWING;
    case (thisPeriod < previousPeriod):
      return TRENDS.DOWNWARD;
    case (thisPeriod === previousPeriod):
      return TRENDS.STABLE;
    default:
      return TRENDS.NONE;
  }
};

export const calculateRatio = (numerator, denominator) => {
  if (denominator === 0) return 0;
  return numerator / denominator * 100;
};
