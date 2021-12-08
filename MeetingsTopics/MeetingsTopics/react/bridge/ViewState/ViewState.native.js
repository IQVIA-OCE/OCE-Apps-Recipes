// @flow

import { NativeEventEmitter, NativeModules } from 'react-native';

class ViewStateBridge {
  viewStateBridgeEmitter: NativeEventEmitter;

  addViewStateListener(callback: function): Promise<Object> {
    try {
      if (!this.viewStateBridgeEmitter) {
        this.viewStateBridgeEmitter = new NativeEventEmitter(
          NativeModules.ViewStateBridge
        );
      }

      const listener = this.viewStateBridgeEmitter.addListener(
        //event name
        'ViewStateChangedEvent',
        (body) => callback(body)
      );
      return new Promise((resolve, reject) => {
        resolve(listener);
      });
    } catch (error) {
      return new Promise((resolve, reject) => {
        reject(error);
      });
    }
  }

  removeViewStateListener(listener: any): Promise<Object> {
    try {
      //workaround
      //listener.remove() does not handled properly with try-catch because it falls in native code
      const subscriptionsForType =
        listener.subscriber._subscriptionsForType[listener.eventType];
      if (subscriptionsForType) {
        if (subscriptionsForType[listener.key]) {
          listener.remove();
        } else {
          throw 'Listener already removed';
        }
      } else {
        throw 'There are no subscriptions for event ' + listener.eventType;
      }

      return new Promise((resolve, reject) => {
        resolve(true);
      });
    } catch (error) {
      return new Promise((resolve, reject) => {
        reject(error);
      });
    }
  }
}

export const viewStateBridge: ViewStateBridge = new ViewStateBridge();
