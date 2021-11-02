// @flow

import { NativeModules } from 'react-native';

class ExternalNavigator {
  open(url: string): Promise<Object> {
    try {
      return NativeModules.ExternalNavigatorBridge.open(url);
    } catch (error) {
      return new Promise((resolve, reject) => {
        reject(error);
      });
    }
  }
}

export const externalNavigator: ExternalNavigator = new ExternalNavigator();
