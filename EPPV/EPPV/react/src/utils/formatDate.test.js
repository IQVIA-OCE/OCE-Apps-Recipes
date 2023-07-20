import { formatDate } from './formatDate';

jest.mock('oce-apps-bridges', () => ({
  environment: {
    locale: () => 'en_US',
    timeZone: () => 'America/Los_Angeles',
  },
}));

describe('formatDate', () => {
  it('should format empty date as datetime', () => {
    const result = formatDate('2022-08-06');
    expect(result).toBe('Aug 6, 2022');
  });

  it('should return empty field', () => {
    const result = formatDate('2021-6368879202.000Z');
    expect(result).toBeNull();
  });
});
