import React from 'react';
import AccountInfoScreen from './index';
import renderer from 'react-test-renderer';
import { WebView } from 'react-native-webview';

describe('AccountInfoScreen', () => {
  it('should render properly', () => {
    const tree = renderer.create(
      <AccountInfoScreen navigation={{ state: { params: { accountName: 'Test', countryCode: 'US' } } }} />,
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call onNavigationStateChange', () => {
    const tree = renderer.create(
      <AccountInfoScreen navigation={{ state: { params: { accountName: 'Test', countryCode: 'US' } } }} />,
    );

    const webview = tree.root.findByType(WebView);
    webview.props.onNavigationStateChange({ canGoForward: true, canGoBack: true });
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
