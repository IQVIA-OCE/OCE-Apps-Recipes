jest.mock('react-native-webview', () => {
  return {
    WebView: () => <></>,
    default: () => jest.fn(),
    __esModule: true,
  };
});