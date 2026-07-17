import { Platform } from 'react-native';

export { SORT_OPTION_LIST, ACCESS_LEVEL_PICKLIST } from './sortOptionsList';
export { NAMESPACE, LOCALIZATION_NAMESPACE } from './namespacePrefix';
export { LOADING_STATUS } from './loadingStatus';
export const isIphone = !Platform.isPad && Platform.OS !== 'web';
