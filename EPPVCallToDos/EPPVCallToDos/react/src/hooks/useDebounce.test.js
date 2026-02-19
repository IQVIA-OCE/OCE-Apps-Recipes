import { renderHook } from '@testing-library/react-hooks';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  it('call useDebounce', () => {
    const { result } = renderHook(() => useDebounce('test', 200));
    expect(result.current).toEqual('test');
    expect(result.all).toEqual(['test']);
  });
});
