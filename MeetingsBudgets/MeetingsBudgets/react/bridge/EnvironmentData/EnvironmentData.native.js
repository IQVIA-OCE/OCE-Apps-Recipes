// @flow

import { NativeEventEmitter, NativeModules } from 'react-native';
import EventEmitter from 'react-native/Libraries/vendor/emitter/EventEmitter';

const BridgeEnvData = NativeModules.EnvironmentDataBridge;

interface IData {
  namespace: string;
  userID: string;
  timeZone: string;
  locale: string;
  language: string;
  currencyISOCode: string;
  sfInstanceURL: string;
  sfApiVersion: string;
  territory: Object;
}

class EnvironmentData {
  dataEmitter: any;
  metadataBridgeEmitter: NativeEventEmitter;
  data: IData;

  constructor() {
    try {
      this.dataEmitter = new EventEmitter();

      if (!this.metadataBridgeEmitter) {
        this.metadataBridgeEmitter = new NativeEventEmitter(
          NativeModules.MetadataUpdatesBridge
        );
      }

      const listener = this.metadataBridgeEmitter.addListener(
        //event name
        'MetadataChangedEvent',
        () => this.getEnvironmentData()
      );

      this.getEnvironmentData();
    } catch (error) {
      //it's ok. We are on version 7.x
    }
  }

  getEnvironmentData() {
    BridgeEnvData.getEnvironmentData().then(
      function (environmentData) {
        this.data = environmentData;
        this.dataEmitter.emit('EnvironmentDataChangedEvent');
      }.bind(this)
    );
  }

  namespace(): string {
    return this.data ? this.data.namespace : BridgeEnvData.namespace;
  }

  userID(): string {
    return this.data ? this.data.userID : BridgeEnvData.userID;
  }

  timeZone(): string {
    return this.data ? this.data.timeZone : BridgeEnvData.timeZone;
  }

  locale(): string {
    return this.data ? this.data.locale : BridgeEnvData.locale;
  }

  language(): string {
    return this.data ? this.data.language : BridgeEnvData.language;
  }

  currencyISOCode(): string {
    return this.data
      ? this.data.currencyISOCode
      : BridgeEnvData.currencyISOCode;
  }

  sfInstanceURL(): string {
    return this.data ? this.data.sfInstanceURL : BridgeEnvData.sfInstanceURL;
  }

  sfApiVersion(): string {
    return this.data ? this.data.sfApiVersion : BridgeEnvData.sfApiVersion;
  }

  territory(): Object {
    return this.data ? this.data.territory : BridgeEnvData.territory;
  }
}

export const environment: EnvironmentData = new EnvironmentData();
