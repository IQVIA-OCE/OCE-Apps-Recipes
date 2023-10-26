import { Platform } from 'react-native';
import { NAMESPACE } from './namespace'

export const isIphone = !Platform.isPad && Platform.OS !== 'web';

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