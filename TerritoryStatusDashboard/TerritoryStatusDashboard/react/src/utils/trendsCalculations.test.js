import { TRENDS } from '../constants';
import { calculateRatio, getTrend } from './trendsCalculations';

describe('trendsCalculations utils', () => {
  describe('getTrend() function', () => {
    test('should return specific trend, if parameters are passed', () => {
      expect(getTrend(1, 2)).toBe(TRENDS.DOWNWARD);
      expect(getTrend(2, 1)).toBe(TRENDS.GROWING);
      expect(getTrend(1, 1)).toBe(TRENDS.STABLE);
    });

    test('should return "none" trend, if one parameter are skipped', () => {
      expect(getTrend(1)).toBe(TRENDS.NONE);
    });
  });

  describe('calculateRatio() function', () => {
    test('should return ratio, if parameters are valid', () => {
      expect(calculateRatio(1, 8)).toBe(12.5);
    });

    test('should return 0, if second parameter (denominator) equal 0', () => {
      expect(calculateRatio(1, 0)).toBe(0);
    });
  });
});
