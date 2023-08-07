import React from 'react';
import { render } from '@testing-library/react-native';
import { App } from './App';

jest.mock('oce-apps-bridges', () => {
  const actualModule = jest.requireActual('oce-apps-bridges');

  return {
    ...actualModule,
    environment: {
      ...actualModule.environment,
      profileId: () => '1'
    }
  }
});

describe('Application', () => {
  it('should render correctly', () => {
    const { getByTestId } = render(<App />);

    expect(getByTestId('loader-wrap')).toBeTruthy();
  });
});
