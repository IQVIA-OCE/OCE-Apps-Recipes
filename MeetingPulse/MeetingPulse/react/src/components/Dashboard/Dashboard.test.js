import React from 'react';
import { render } from '@testing-library/react-native';
import Dashboard from './Dashboard';
import { Provider } from 'react-redux';
import store from '../../store/store';
import * as helpers from '../../utils/helpers';

jest.mock('@oce-apps/oce-apps-bridges', () => ({
  environment: {
    locale: () => 'en_US',
    timeZone: () => 'America/Los_Angeles',
    namespace: () => ''
  },
}));

describe('Dashboard', () => {
  it('should render correctly', () => {
    const { getByText } = render(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    );

    expect(getByText(/Attendees/)).toBeTruthy();
  });

  it('should render phone version', () => {
    helpers.isMobilePhone = true;

    const { getByText } = render(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    );

    expect(getByText(/Attendees/)).toBeTruthy();
  });
});
