import { ApolloProgress } from '@oce-apps/apollo-react-native';
import { layoutBridge, sfNetAPI } from '@oce-apps/oce-apps-bridges';
import { render } from '@testing-library/react-native';
import React from 'react';
import { App } from './App';
import * as helpers from './src/utils/helpers';

describe('Application', () => {
  beforeEach(() => {
    sfNetAPI.query.mockImplementation((query) => {
      if (query.includes('COUNT_DISTINCT')) {
        return { records: [{ number: 2 }], metadata: { done: true } };
      } else {
        return {
          records: [
            { status: 'Approved', number: 1 },
            { status: 'Rejected', number: 2 },
          ],
          metadata: { done: true },
        };
      }
    });
  });

  afterEach(() => {
    sfNetAPI.query.mockReset();
  });

  test('should render properly with height for phones', () => {
    helpers.isMobilePhone = true;
    const { UNSAFE_queryByType } = render(<App />);

    expect(UNSAFE_queryByType(ApolloProgress)).toBeTruthy();
    expect(layoutBridge.setHeight).toHaveBeenCalled();
    expect(layoutBridge.setHeight).toHaveBeenCalledWith(550);
  });

  test('should render properly with height for WEB and tablets', () => {
    helpers.isMobilePhone = false;
    const { UNSAFE_queryByType } = render(<App />);

    expect(UNSAFE_queryByType(ApolloProgress)).toBeTruthy();
    expect(layoutBridge.setHeight).toHaveBeenCalled();
    expect(layoutBridge.setHeight).toHaveBeenCalledWith(330);
  });
});
