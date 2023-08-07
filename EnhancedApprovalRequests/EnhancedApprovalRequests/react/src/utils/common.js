import { Platform } from 'react-native';

export const isIphone = typeof Platform.isPad === 'undefined' ? false : !Platform.isPad;

export const isWeb = Platform.OS === 'web';
