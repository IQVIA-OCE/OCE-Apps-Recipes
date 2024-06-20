import { useBanner } from './useBanner';
import { testHook } from './testHook';
import { act } from '@testing-library/react-native';

describe('useBanner', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });
  afterAll(() => {
    jest.useRealTimers();
  });
  it('should show banner', async () => {
    const banner = {
      variant: 'success',
      message: 'some message',
      visible: true,
      icon: 'info',
    };
    let state, setBanner;

    testHook(() => {
      [state, setBanner] = useBanner();
    });

    // banner is hidden initially
    expect(state.visible).toBe(false);

    // banner is visible after trigger
    act(() => setBanner(banner));
    expect(state).toBe(banner);

    // banner is hidden after timeout
    act(() => jest.advanceTimersByTime(4000));
    expect(state.visible).toBe(false);
  });
});
