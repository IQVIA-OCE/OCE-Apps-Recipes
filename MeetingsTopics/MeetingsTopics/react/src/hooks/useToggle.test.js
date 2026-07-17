import {useToggle, toggleReducer} from './useToggle';

describe('useToggle', () => {

  it('toggleReducer', () => {
    const state = {};
    expect(toggleReducer(state, false)).toBe(false);
    expect(toggleReducer(state, [])).toBe(false);
  });
});
