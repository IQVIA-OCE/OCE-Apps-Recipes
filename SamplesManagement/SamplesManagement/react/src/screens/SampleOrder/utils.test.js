import { normalizeProductsList } from './utils';

describe('utils', () => {
  it('normalizeProductsList: should return normalized data', () => {
    const normalized = normalizeProductsList();

    expect(normalized).toStrictEqual({ byId: {}, allIds: [] });
  });
});
