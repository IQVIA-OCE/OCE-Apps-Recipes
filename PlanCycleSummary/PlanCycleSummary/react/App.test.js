import React from 'react';
import { render } from '@testing-library/react-native';
import App from './App';

jest.mock('@oce-apps/oce-apps-bridges', () => {
  const actualBridges = jest.requireActual('@oce-apps/oce-apps-bridges');

  return {
    ...actualBridges,
    layoutBridge: {
      ...actualBridges.layoutBridge,
      setHeight: jest.fn().mockResolvedValue(true)
    },
    environment: {
      ...actualBridges.environment,
      namespace: jest.fn(() => 'OCE__'),
      territory: jest.fn(() => ({ name: 'Mocked Territory' })),
      organizationId: jest.fn(() => 'mocked-id'),
    },
  };
});

describe('Application', () => {
  it('should render properly', () => {
    const { findByText } = render(<App />);

    expect(findByText('Plan Cycle Summary')).toBeTruthy();
  })
});
