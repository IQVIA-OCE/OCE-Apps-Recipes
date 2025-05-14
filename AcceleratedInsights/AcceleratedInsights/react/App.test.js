import React from 'react'
import { act, render, screen, waitFor, fireEvent, cleanup } from '@testing-library/react-native';
import { WebView } from "react-native-webview";
import App from './App';
import { databaseManager } from '@oce-apps/oce-apps-bridges';
import { Platform, Linking, View, Text } from "react-native";
import { Provider, DarkTheme } from '@oce-apps/apollo-react-native';

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

let mockedUseColorScheme = jest.fn();

jest.mock('react-native/Libraries/Utilities/useColorScheme', () => {
  return {
    default: mockedUseColorScheme,
  };
});

jest.mock('@oce-apps/oce-apps-bridges', () => ({
  databaseManager: {
      upsert: jest.fn(),
      fetch: jest.fn(),
      delete: jest.fn(),
  },
  layoutBridge: {
    setHeight: jest.fn(),
  },
}));

jest.mock('react-native-webview', () => {
  const React = require('react');
  const {View} = require('react-native');

  const refOverride = {
    goBack: jest.fn(),
    goForward: jest.fn(),
    reload: jest.fn(),
    stopLoading: jest.fn(),
    injectJavaScript: jest.fn(),
    requestFocus: jest.fn(),
    postMessage: jest.fn(),
    clearFormData: jest.fn(),
    clearCache: jest.fn(),
    clearHistory: jest.fn(),
  };
  const MockWebView = React.forwardRef((props, ref) => {
    React.useEffect(() => {
      ref.current = refOverride;
    }, []);
    return <View {...props} ref={ref} />;
  });

  return {
    __esModule: true,
    WebView: MockWebView,
    default: MockWebView,
  };
});

describe('Application', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });
  it('should render properly', () => {
    render(
      <App >
      </App>);
    expect(screen.toJSON()).toMatchSnapshot();
  });

  it('should render properly in dark mode', async () => {
    mockedUseColorScheme.mockImplementationOnce(() => 'dark')

    let tree = render(
        <Provider theme={DarkTheme}>
          <App>
          </App>
        </Provider>
    )

    let promise = Promise.resolve();
    await act(() => promise);

    expect(tree).toBeTruthy();
  }); 

  it('should render with recordId and WebView with no data', async () => {
    databaseManager.fetch = jest
      .fn()
      .mockResolvedValue({ records: [], done: true });
    let webview = null;
    let uri = "";
    let handleWebViewNavigationStateChange = jest.fn();
    let { getByTestId } = render(
      <App recordId={'recordId'}>
        <WebView
            ref={(ref) => (webview = ref)}
            allowsBackForwardNavigationGestures={true}
            source={{ uri: uri }}
            onNavigationStateChange={handleWebViewNavigationStateChange}
            />
      </App>);
    await waitFor(() => {
      expect(screen.toJSON()).toMatchSnapshot();
    });
  });
  it('should render with recordId and WebView with data', async () => {
    databaseManager.fetch = jest
      .fn()
      .mockResolvedValue({ records: [{
        Id: "0016s00000OWox3AAD",
        OKAI_URL__c: "https://google.com"
    }], done: true });
    Platform.OS = 'iPad';
    let webview = null;
    let uri = "";
    let handleWebViewNavigationStateChange = jest.fn();
    let { getByTestId } = render(
      <App recordId={'recordId'}>
        <WebView
            ref={(ref) => (webview = ref)}
            allowsBackForwardNavigationGestures={true}
            source={{ uri: uri }}
            onNavigationStateChange={handleWebViewNavigationStateChange}
        />
      </App>);
    await waitFor(() => {
      expect(screen.toJSON()).toMatchSnapshot();
    });
  });
});

describe('Application with data', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    databaseManager.fetch = jest
      .fn()
      .mockResolvedValue({ records: [{
        Id: "1",
        QIDC__OrchestrationLoginTokenLong__c: "https://google.com"
    }], done: true });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });
  it('should render with recordId and WebView with all data', async () => {
    Platform.OS = 'iPad';
    let webview = null;
    let uri = "";
    let handleWebViewNavigationStateChange = jest.fn();
    render(
      <App recordId={'1'} isTest={true}>
        <WebView />
      </App>);
    await waitFor(() => {
      let buttonFuncs = screen.getByTestId('buttonFuncs-test');
      fireEvent.press(buttonFuncs);
      expect(screen.toJSON()).toMatchSnapshot();
    });

  });
});


describe('web', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });
  it('should render with recordId and WebView with all data on web', async () => {
    databaseManager.fetch = jest
      .fn()
      .mockResolvedValue({ records: [{
        Id: "0016s00000OWox3AAD",
        QIDC__OrchestrationLoginTokenLong__c: "https://google.com",
    }], done: true });
    Platform.OS = 'web';
    let webview = null;
    let uri = "";
    let handleWebViewNavigationStateChange = jest.fn();
    let { getByTestId } = render(
      <App instanceId={'instanceId'} recordId={'recordId'}>
        <View >
            <Text testID="web-test"
            onPress={() => Linking.openURL(uri)}>
              Accelerated Insights can be accessed here.
            </Text>
          </View>
      </App>);
    await waitFor(() => {
      let link = screen.getByTestId('web-test');
      fireEvent.press(link);
      expect(screen.toJSON()).toMatchSnapshot();
    });
  });
});