import { formatDateInUserLocale } from './helpers';
jest.mock('oce-apps-bridges', () => ({
  environment: {
    locale: () => 'en_US',
    timeZone: () => 'America/Los_Angeles',
  },
}));

describe('helpers', () => {
  describe('formatDateInUserLocale', () => {
    it('should format date', () => {
      expect(formatDateInUserLocale('2021-12-01T13:45:00.000+0000')).toBe('Dec 1, 2021, 5:45 AM');
    });

    it('should return null if given date is invalid', () => {
      expect(formatDateInUserLocale('not a date')).toBeNull();
    });
  });
});
