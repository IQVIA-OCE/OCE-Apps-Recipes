import { Platform } from 'react-native';

import { environment } from 'oce-apps-bridges';

export const NAMESPACE = environment.namespace();

export const isIphone = !Platform.isPad;
