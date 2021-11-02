import { getDbSearchFields } from './getDbSearchFields';
import { ADDITIONAL_FIELDS, NAMESPACE } from '../constants';
import { getIsAdvancedSearchEnabled, doesFieldExist } from '../api/commonApi';

jest.mock('../../bridge/EnvironmentData/EnvironmentData.native', () => ({
  environment: {
    namespace: () => 'OCE__',
    sfApiVersion: () => '1',
    userID: () => '1',
    locale: () => '',
  },
}));

jest.mock('../api/commonApi');

const dbSearchDefault = [`${NAMESPACE}Topic__c.Name`];
const dbSearchDefaultFull = [
  `${NAMESPACE}Topic__c.Name`,
  `${NAMESPACE}Status__c`,
  `${NAMESPACE}MeetingRecordTypes__c`,
  `${NAMESPACE}MeetingType__c`
];

describe('getDbSearchFields', () => {
  it('with enabled default search', async () => {
    getIsAdvancedSearchEnabled.mockResolvedValue(false);

    const result = await getDbSearchFields(
      dbSearchDefault,
      ADDITIONAL_FIELDS,
      `${NAMESPACE}Topic__c`
    );
    expect(result).toEqual(dbSearchDefault);
  });

  it('with enabled advanced search', async () => {
    getIsAdvancedSearchEnabled.mockResolvedValue(true);

    doesFieldExist.mockResolvedValue(true);
    doesFieldExist.mockResolvedValue(true);
    doesFieldExist.mockResolvedValue(true);

    const result = await getDbSearchFields(
      dbSearchDefault,
      ADDITIONAL_FIELDS,
      `${NAMESPACE}Topic__c`
    );
    expect(result).toEqual(dbSearchDefaultFull);
  });

  it('with enabled advanced search with no fields', async () => {
    getIsAdvancedSearchEnabled.mockResolvedValue(true);

    doesFieldExist.mockResolvedValue(false);

    const result = await getDbSearchFields(
      dbSearchDefault,
      ADDITIONAL_FIELDS,
      `${NAMESPACE}Topic__c`
    );
    expect(result).toEqual(dbSearchDefaultFull);
  });
});
