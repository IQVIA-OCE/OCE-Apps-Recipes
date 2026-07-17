import { Platform } from 'react-native';

export const isIphone =
  typeof Platform.isPad === 'undefined' ? false : !Platform.isPad;

export const isIOS = Platform.OS === 'ios';

export const isWeb = Platform.OS === 'web';
