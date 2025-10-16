import { Platform } from 'react-native';

export const isIphone = !Platform.isPad && Platform.OS !== 'web';
