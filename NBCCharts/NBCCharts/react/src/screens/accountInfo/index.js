import React, { Component } from "react";
import { View, StyleSheet } from 'react-native';
import { WebView } from "react-native-webview";
import {
  IconButton,
  white,
  withTheme
} from "@oce-apps/apollo-react-native";

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
    const { theme, route } = this.props;
    const externalLink = route.params?.externalLink;
    const { canGoBack, canGoForward } = this.state;

    return (
      <>
        <View
          style={[
            styles.navigationBar,
            { backgroundColor: theme.colors.primary }
          ]}
        >
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
          source={{ uri: externalLink }}
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
  },
  webViewContainer: {
    flex: 1
  }
});

export default withTheme(AccountInfoScreen);
