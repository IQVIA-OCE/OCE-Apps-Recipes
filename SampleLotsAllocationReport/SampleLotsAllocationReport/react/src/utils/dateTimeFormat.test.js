import { formatDate } from './dateTimeFormat';

jest.mock('@oce-apps/oce-apps-bridges', () => ({
  environment: {
    locale: () => '',
    namespace: () => '',
  },
}));

describe('formatDate', () => {
  it('should format empty date as datetime', () => {
    const result = formatDate('2022-03-15T19:00:00.000Z');
    expect(result).toBe('Mar 15, 2022');
  });

  it('should return empty field', () => {
    const result = formatDate('2022-6368879202.000Z');
    expect(result).toBeNull();
  });
});
