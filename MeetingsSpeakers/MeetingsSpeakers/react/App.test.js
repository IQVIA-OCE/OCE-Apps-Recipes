import React from 'react';
import { render } from '@testing-library/react-native';
import { App } from './App';

jest.mock('./bridge/EnvironmentData/EnvironmentData', () => ({
  environment: {
    locale: () => '',
    sfApiVersion: () => '',
    namespace: () => '',
    userID: () => '1',
  },
}));

describe('Application', () => {
  it('should render correctly', () => {
    const { getByTestId } = render(<App />);

    expect(getByTestId('loader-wrap')).toBeTruthy();
  });
});
