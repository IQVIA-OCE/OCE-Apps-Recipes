import React, { Component } from 'react';
import { sfNetAPI } from './bridge/sf/sfnetapi';
import { environment } from './bridge/EnvironmentData/EnvironmentData.native';
import { View } from 'react-native';
import { ActivityIndicator, Colors } from 'apollo-react-native';

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

  fetchProfileId = () => {
    const userId = environment.userID();
    return new Promise((resolve, reject) => {
      sfNetAPI.query(
        `SELECT Id, Name, ProfileId FROM User WHERE Id = '${userId}'`,
        data => {
          // console.log(data);
          resolve(data.records);
        },
        e => {
          // console.log(e);
          reject(e);
        }
      );
    });
  };

  fetchOrgId = () => {
    return new Promise((resolve, reject) => {
      sfNetAPI.query(
        `SELECT Id FROM Organization`,
        data => {
          // console.log(data);
          resolve(data.records);
        },
        e => {
          // console.log(e);
          reject(e);
        }
      );
    });
  };

  getInitialData = async () => {
    this.setState({ isLoading: true });
    try {
      const [profile] = await this.fetchProfileId();
      const [org] = await this.fetchOrgId();

      this.setState({
        profileId: profile.Id,
        username: profile.Name,
        orgId: org.Id,
        userId: environment.userID(),
        isLoading: false,
        error: null,
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
