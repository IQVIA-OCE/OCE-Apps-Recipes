// @flow

import { NativeEventEmitter, NativeModules } from 'react-native';

class MetadataUpdatesBridge {
  metadataBridgeEmitter: NativeEventEmitter;

  addChangesListener(callback: function): Promise<Object> {
    try {
      if (!this.metadataBridgeEmitter) {
        this.metadataBridgeEmitter = new NativeEventEmitter(
          NativeModules.MetadataUpdatesBridge
        );
      }

      const listener = this.metadataBridgeEmitter.addListener(
        //event name
        'MetadataChangedEvent',
        (body) => callback()
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

  removeChangesListener(listener: any): Promise<Object> {
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

export const metadataUpdatesBridge: MetadataUpdatesBridge =
  new MetadataUpdatesBridge();
