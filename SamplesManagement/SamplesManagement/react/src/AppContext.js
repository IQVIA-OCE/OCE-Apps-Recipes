import React, { Component } from 'react';
import { sfNetAPI, environment } from '@oce-apps/oce-apps-bridges';
import { View } from 'react-native';
import { ActivityIndicator, withTheme } from '@oce-apps/apollo-react-native';
import { fetchUser } from './api/AppContext';
import { NAMESPACE } from './constants/constants';

const defaultContextValue = {
  isLoading: true,
  userId: null,
  profileId: null,
  orgId: null,
  error: null,
};

export const AppContext = React.createContext(defaultContextValue);

class AppContextProvider extends Component {
  state = defaultContextValue;

  getInitialData = async () => {
    try {
      const userId = environment.userId();
      const [[user]] = await fetchUser(userId);

      this.setState({
        profileId: user[`${NAMESPACE}ProfileId__c`],
        username: user.Name,
        isLoading: false,
        error: null,
        userId
      });
    } catch (error) {
      this.setState({ isLoading: false, error });
    }
  };

  componentDidMount() {
    this.getInitialData();
  }

  render() {
    const { theme } = this.props;

    return (
      <AppContext.Provider value={this.state}>
        {this.state.isLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
            <ActivityIndicator
              animating={true}
              color={theme.colors.primary}
              style={{ paddingVertical: 10 }}
            />
          </View>
        ) : (
          this.props.children
        )}
      </AppContext.Provider>
    );
  }
}

export default withTheme(AppContextProvider);
