import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { IconButton, themePrimary, white } from 'apollo-react-native';

class AccountInfoScreen extends Component {
  state = {
    canGoBack: false,
    canGoForward: false
  };

  webViewRef = React.createRef();

  handleNavigationButtonPress(type) {
    const { goBack, goForward } = this.webViewRef.current;

    if (this.webViewRef.current) {
      type === 'BACK' ? goBack() : goForward();
    }
  };

  render() {
    const { accountName, countryCode } = this.props.navigation.state.params;
    const { canGoBack, canGoForward } = this.state;
    const link = `https://clinicaltrials.gov/ct2/results?cond=&term=${accountName}&cntry=${countryCode}&state=&city=&dist=&Search=Search`;

    return (
      <>
        <View style={styles.navigationBar}>
          <IconButton
            icon="arrow-left"
            onPress={() => this.handleNavigationButtonPress('BACK')}
            disabled={!canGoBack}
            color={white[500]}
          />
          <IconButton
            icon="arrow-right"
            onPress={() => this.handleNavigationButtonPress('FORWARD')}
            disabled={!canGoForward}
            color={white[500]}
          />
          <IconButton
            icon="refresh"
            color={white[500]}
            onPress={this.webViewRef.current ? this.webViewRef.current.reload : null}
          />
        </View>
        <WebView
          source={{ uri: link }}
          style={styles.webViewContainer}
          ref={this.webViewRef}
          onNavigationStateChange={(state) => {
            this.setState({
              canGoBack: state.canGoBack,
              canGoForward: state.canGoForward
            });
          }}
        />
      </>
    )
  }
}

const styles = StyleSheet.create({
  navigationBar: {
    flexDirection: 'row',
    height: 50,
    backgroundColor: themePrimary[500]
  },
  webViewContainer: {
    flex: 1
  }
});

export default AccountInfoScreen;
