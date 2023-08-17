import { render } from '@testing-library/react-native';
import { ApolloProgress } from 'apollo-react-native';
import { layoutBridge } from 'oce-apps-bridges';
import React from 'react';
import { App } from './App';
import * as helpers from './src/utils/helpers';

describe('Application', () => {
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
