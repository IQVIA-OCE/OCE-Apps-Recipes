import { render } from '@testing-library/react-native';
import { ApolloProgress } from 'apollo-react-native';
import React from 'react';
import { CustomProgress } from './CustomProgress';

describe('CustomProgress', () => {
  test('should render properly', () => {
    const { UNSAFE_getByType } = render(<CustomProgress />);

    expect(UNSAFE_getByType(ApolloProgress)).toBeTruthy();
  });
});
