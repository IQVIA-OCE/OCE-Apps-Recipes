import { Platform } from 'react-native';

export const isIphone = Platform.OS === 'ios' && !Platform.isPad;
