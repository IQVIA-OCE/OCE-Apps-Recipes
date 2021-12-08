import { NativeModules } from 'react-native';

export default NativeModules.EnvironmentDataBridge = {
  userID: '',
  timeZone: '',
  locale: '',
  language: '',
  currencyISOCode: '',
  sfInstanceURL: '',
  sfApiVersion: '',
  territory: '',
  namespace: ''
};
