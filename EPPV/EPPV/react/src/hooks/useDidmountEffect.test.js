import { renderHook } from '@testing-library/react-hooks';
import { act } from '@testing-library/react-native';
import { useDidMountEffect } from './useDidmountEffect.js';

describe('useDidMountEffect', () => {
  it('Check if only fire after dep updates', async () => {
    const callBackMock = jest.fn();
    let dep = 'dep';

    const { result, rerender } = renderHook(() => {
      useDidMountEffect(callBackMock, [dep]);
    });
    expect(callBackMock).toHaveBeenCalledTimes(0);
    expect(result.current).toBeUndefined();

    act(() => {
      dep = 'foo';
    });
    rerender();

    expect(callBackMock).toHaveBeenCalledTimes(1);
  });
});
