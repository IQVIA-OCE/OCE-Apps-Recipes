import React from 'react';
import App from './App';
import * as constants from './src/constants';
import { render, waitFor} from '@testing-library/react-native';
import { layoutBridge } from 'oce-apps-bridges';
import { Provider, DarkTheme } from 'apollo-react-native';

jest.mock(
  './node_modules/react-native/Libraries/EventEmitter/NativeEventEmitter.js',
);

jest.mock('oce-apps-bridges', () => ({
  sfNetAPI: {
    enablePromises: jest.fn(),
    query: jest.fn(),
  },
  environment: {
    namespace: () => 'OCE__',
    sfApiVersion: () => '1',
    userID: () => '1',
    territory: () => 'Atlanta',
  },
  layoutBridge: {
    setHeight: jest.fn()
  },
  reachability: {
    addListener: jest.fn(),
    networkReachabilityStatus: jest.fn()
      .mockResolvedValueOnce('ONLINE')
      .mockRejectedValue('ERROR')
  }

}))


describe('App', () => {

  const layout = layoutBridge.setHeight;

  it('should render properly', async () => {
    constants.isIphone = true;

    const tree = await waitFor(() =>
      render(<App instanceId="123"/>)
    );
    expect(tree).toBeTruthy();
    expect(layout).toHaveBeenCalled();
  });

  it('should render properly ipad version and in dark mode', async () => {
    constants.isIphone = false;

    const tree = await waitFor(() => render(
        <Provider theme={DarkTheme}>
          <App />
        </Provider>
    ));
    expect(tree).toBeTruthy();
    expect(layout).toHaveBeenCalledWith(375);
  });
});
