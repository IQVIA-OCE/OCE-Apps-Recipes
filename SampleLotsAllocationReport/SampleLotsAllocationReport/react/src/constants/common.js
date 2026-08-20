import { Dimensions, Platform } from 'react-native';
import { NAMESPACE } from './namespace'

export const isIphone = typeof Platform.isPad === 'undefined' ? false : !Platform.isPad;

export const isAndroid = Platform.OS === 'android';

// @TODO: use library react-native-device-info for this check
const isTablet = () => {
    const widthPixels = Dimensions.get('screen').width;
    const heightPixels = Dimensions.get('screen').height;
    const densityDpi = 160;

    const widthInches = widthPixels / densityDpi;
    const heightInches = heightPixels / densityDpi;
    const diagonalSizeInches = Math.sqrt(Math.pow(widthInches, 2) + Math.pow(heightInches, 2));

    return diagonalSizeInches > 6.9 && diagonalSizeInches <= 18.0;
}

export const isAndroidPhone = isAndroid && !isTablet();

export const isMobilePhone = isIphone || isAndroidPhone;

export const SEARCH_FIELDS = [
    { label: 'Product', value: 'product' },
    { label: 'Lot', value: 'lot' },
];

export const DTP_SEARCH_FIELDS = [
    { label: 'Product', value: 'product' }
];

export const DTP_SEARCH_DETAIL_FIELDS = [
    { label: 'Account', value: 'account' },
    { label: 'Product', value: 'product' }
];

export const TRANSACTION_SEARCH_FIELDS = [
    { label: 'Product', value: 'product' },
];

export const TRANSACTION_SEARCH_QUERY = {
    account: `AND ${NAMESPACE}SampleTransaction__r.${NAMESPACE}Call__r.${NAMESPACE}Account__r.Name`,
    product: `AND ${NAMESPACE}Product__r.Name`,
    lot: `AND ${NAMESPACE}LotNumber__r.Name`
}

export const SEARCH_QUERY = {
    product: `AND ${NAMESPACE}Lot__r.${NAMESPACE}Product__r.Name`,
    lot: `AND ${NAMESPACE}Lot__r.Name`
}


export const DTP_SEARCH_QUERY = {
    product: `AND ${NAMESPACE}Product__r.Name`,
}

export const DTP_DETAIL_SEARCH_QUERY = {
    account: `AND ${NAMESPACE}Call__r.${NAMESPACE}Account__r.Name`,
    product: `AND ${NAMESPACE}Product__r.Name`,
}
