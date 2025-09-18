import { testHook } from './testHook';
import { useBoolean } from './useBoolean';
import { act } from '@testing-library/react-native';

describe('useBoolean', () => {
  it('should return boolean', () => {
    const initial = false;
    let boolean, actions;
    testHook(() => {
      [boolean, actions] = useBoolean(initial);
    });

    expect(boolean).toBe(initial);

    act(() => actions.toggle());
    expect(boolean).toBe(true);

    act(() => actions.setFalse());
    expect(boolean).toBe(false);

    act(() => actions.setTrue());
    expect(boolean).toBe(true);
  });
});
