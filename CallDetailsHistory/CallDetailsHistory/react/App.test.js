import { render } from '@testing-library/react-native';
import { layoutBridge } from 'oce-apps-bridges';
import React from 'react';
import { ScrollView } from 'react-native';
import App from './App';
import * as helpers from './src/utils/common';

jest.mock('oce-apps-bridges', () => ({
  sfNetAPI: {
    enablePromises: jest.fn()
  },
  layoutBridge: {
    setHeight: jest.fn()
  },
}))

describe('Application', () => {
  it('should render properly', () => {
    const { queryByText } = render(<App />);

    expect(queryByText(/Call Details History/)).toBeTruthy();
  });

  it('should call setHeight method of layoutBridge if instanceId prop passed', () => {
    const { queryByText } = render(<App instanceId="1-2-3-abc" />);

    expect(queryByText(/Call Details History/)).toBeTruthy();
    expect(layoutBridge.setHeight).toHaveBeenCalled();
    expect(layoutBridge.setHeight).toHaveBeenCalledWith(600);
  });

  it('should render component for non-iphone layout', () => {
    helpers.isIphone = false;
    const { queryByText, container } = render(<App />);

    expect(queryByText(/Call Details History/)).toBeTruthy();
    expect(container.findAllByType(ScrollView).length).toEqual(0);
  });
});
