import { NAMESPACE } from '../../../constants/constants';

export const normalizeLocation = records =>
  records.length ? records[0][`${NAMESPACE}FullAddress__c`] : '';
