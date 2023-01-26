import React, { Component } from 'react';
import { sfNetAPI, environment } from 'oce-apps-bridges';
import { View } from 'react-native';
import { ActivityIndicator, Colors } from 'apollo-react-native';
import { fetchUser } from './src/api/AppContext';

const defaultContextValue = {
  isLoading: true,
  userId: null,
  profileId: null,
  orgId: null,
  error: null,
};

export const AppContext = React.createContext(defaultContextValue);

export default class extends Component {
  state = defaultContextValue;

  getInitialData = async () => {
    this.setState({ isLoading: true });
    try {
      const userId = environment.userID();
      const [[user]] = await fetchUser(userId);

      this.setState({
        profileId: user.OCE__ProfileId__c,
        username: user.Name,
        isLoading: false,
        error: null,
        userId
      });
    } catch (error) {
      console.warn(error);
      this.setState({ isLoading: false, error });
    }
  };

  componentDidMount() {
    this.getInitialData();
  }

  render() {
    return (
      <AppContext.Provider value={this.state}>
        {this.state.isLoading ? (
          <View style={{ padding: 20 }}>
            <ActivityIndicator
              animating={true}
              color={Colors.blue}
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
