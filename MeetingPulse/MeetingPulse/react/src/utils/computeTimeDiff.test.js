import { computeTimeDiff } from './computeTimeDiff';

describe('computeTimeDiff', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should compute the count of days, hours, minutes and seconds from given count of milliseconds', () => {
    const now = new Date('2021-12-01T13:45:00.000+0000').getTime();
    jest.spyOn(global.Date, 'now').mockImplementation(() => now);

    const diffInMs = new Date('2022-01-27T13:45:00.000+0000').getTime() - now;

    expect(computeTimeDiff(diffInMs)).toStrictEqual({
      days: 57,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
  });
});
