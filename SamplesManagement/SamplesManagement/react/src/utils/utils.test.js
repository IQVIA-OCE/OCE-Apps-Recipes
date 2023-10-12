import { base64toBitIndex, normalizer, lowercaseKeys } from './utils';

describe('base64toBitIndex', () => {
  it('should return empty array', () => {
    const arr = base64toBitIndex();

    expect(arr).toStrictEqual([]);
  });

  it('should return array with index 0', () => {
    const arr = base64toBitIndex('gA==');

    expect(arr).toStrictEqual([0]);
  });
});

describe('normalizer', () => {
  it('should return normalized data', () => {
    const normalized = normalizer({ TITLE: 'title' })([{ TITLE: 'title', Id: 1 }]);

    expect(normalized).toStrictEqual([{ title: 'title', Id: 1 }]);
  });

  it('should return normalized undefined', () => {
    const normalized = normalizer()([1]);

    expect(normalized).toStrictEqual([undefined]);
  });
});

describe('lowercaseKeys', () => {
  it('should return object with jeys in lower case', () => {
    const normalized = lowercaseKeys({ TITLE: 'title' });

    expect(normalized).toStrictEqual({ title: 'title'});
  });
});
