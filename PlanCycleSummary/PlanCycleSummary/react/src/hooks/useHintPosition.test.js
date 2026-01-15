import React from 'react';
import useHintPosition from './useHintPosition';
import { renderHook } from '@testing-library/react-native';
import { clamp } from '../utils';

describe('useHintPosition', () => {
  test('should calculate hint position correctly when progressWidth and hintWidth are provided', () => {
    const value = 50;
    const hintWidth = 20;
    const progressWidth = 100;

    const { result } = renderHook(() => useHintPosition(value, hintWidth, progressWidth));

    const minHintLeft = 0;
    const maxHintLeft = progressWidth - hintWidth;
    const expectedHintPosition = clamp((value / 100) * progressWidth - hintWidth / 2, minHintLeft, maxHintLeft);

    expect(result.current).toBe(expectedHintPosition);
  });
});
