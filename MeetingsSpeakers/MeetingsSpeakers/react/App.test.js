import React from 'react';
import { render } from '@testing-library/react-native';
import { App } from './App';

describe('Application', () => {
  it('should render correctly', () => {
    const { getByTestId } = render(<App />);

    expect(getByTestId('loader-wrap')).toBeTruthy();
  });
});
