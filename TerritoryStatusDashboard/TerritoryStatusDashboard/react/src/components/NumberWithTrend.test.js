import { render } from '@testing-library/react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TRENDS } from '../constants';
import { NumberWithTrend } from './NumberWithTrend';

describe('NumberWithTrend', () => {
  test('should render properly', () => {
    const { queryByText } = render(
      <NumberWithTrend number={12345} />
    );

    expect(queryByText(/12345/i)).toBeTruthy();
  });

  test('should render with icon if trend is passed and it is not "none"', () => {
    const { queryByText, UNSAFE_queryByType } = render(
      <NumberWithTrend number={12345} trend={TRENDS.GROWING} />
    );

    expect(queryByText(/12345/i)).toBeTruthy();
    expect(UNSAFE_queryByType(Icon)).toBeTruthy();
  });
});
