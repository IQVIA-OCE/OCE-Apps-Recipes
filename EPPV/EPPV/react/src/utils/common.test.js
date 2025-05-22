import { isIphone } from './common';

describe('common utils', () => {
  it('should return isIphone true', () => {
    jest.mock('react-native/Libraries/Utilities/Platform', () => ({
      isPad: undefined,
    }));

    expect(isIphone).toBeTruthy();
  });
});
