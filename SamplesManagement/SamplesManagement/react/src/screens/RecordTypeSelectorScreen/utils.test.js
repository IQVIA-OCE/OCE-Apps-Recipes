import { normalizeRecordTypes } from './utils';

describe('utils', () => {
  it('normalizeRecordTypes', () => {
    const normalized = normalizeRecordTypes([
      {
        DeveloperName: 'Disbursement',
      },
      {
        DeveloperName: 'Adjustment',
      },
    ]);
    expect(normalized).toStrictEqual([
      {
        DeveloperName: 'Adjustment',
      },
    ]);
  });
});
