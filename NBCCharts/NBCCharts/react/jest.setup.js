global.alert = jest.fn();

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return jest.fn().mockImplementation((Component) => Component);
});

jest.mock('react-native-webview', () => {
  const React = require('react');
  const { View } = require('react-native');

  class MockWebView extends React.Component {
    render() {
      return <View testID="mocked-webview" {...this.props} />;
    }
  }

  return {
    WebView: MockWebView,
  };
});

global.Promise = jest.requireActual('promise');

beforeEach(() => {
  jest.useFakeTimers({ advanceTimers: true })
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});
