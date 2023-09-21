import { databaseManager, metadataBridge, sfNetAPI } from 'oce-apps-bridges';
import {
  deleteCallToDo,
  fetchAccounts,
  fetchAllComplianceRecords,
  fetchByQueryLocator,
  fetchCall,
  fetchCallToDoRecordType,
  fetchCallToDos,
  fetchCallToDosCount,
  fetchComplianceTypes,
  fetchSurveyTypes,
  saveCallToDo,
} from './callToDoApi';
import { Platform } from 'react-native';

jest.mock('oce-apps-bridges', () => ({
  environment: {
    namespace: () => 'OCE__',
  },
  databaseManager: {
    fetch: jest.fn(),
    upsert: jest.fn(),
    delete: jest.fn(),
  },
  sfNetAPI: {
    describe: jest.fn(),
    restRequest: jest.fn(),
  },
  metadataBridge: {
    describe: jest.fn(),
  },
}));

const COMPLIANCE_TYPE_FIELD = {
  autoNumber: false,
  externalId: false,
  formulaTreatNullNumberAsZero: false,
  inlineHelpText: 'Type of compliance.',
  label: 'Compliance Type',
  length: 255,
  name: 'OCE__ComplianceType__c',
  picklistValues: [
    { active: true, defaultValue: false, label: 'EPPV', value: 'EPPV' },
    { active: true, defaultValue: false, label: 'MID', value: 'MID' },
  ],
  soapType: 'xsd:string',
  type: 'picklist',
  updateable: true,
  writeRequiresMasterRead: false,
};

const SURVEY_TYPE_FIELD = {
  autoNumber: false,
  externalId: false,
  formulaTreatNullNumberAsZero: false,
  inlineHelpText: 'Channel using which account was interviewed.',
  label: 'Survey Type',
  length: 255,
  name: 'OCE__SurveyType__c',
  picklistValues: [
    { active: true, defaultValue: false, label: 'Face To Face', value: 'Face To Face' },
    { active: true, defaultValue: false, label: 'DM', value: 'DM' },
    { active: true, defaultValue: false, label: 'Phone', value: 'Phone' },
    { active: true, defaultValue: false, label: 'Fax', value: 'Fax' },
    { active: true, defaultValue: false, label: 'Email', value: 'Email' },
  ],
  soapType: 'xsd:string',
  type: 'picklist',
  updateable: true,
  writeRequiresMasterRead: false,
};

describe('callToDoApi', () => {
  beforeEach(() => {
    databaseManager.upsert.mockReset();
    databaseManager.delete.mockReset();
    databaseManager.fetch.mockReset();
    metadataBridge.describe.mockReset();
    sfNetAPI.restRequest.mockReset();
    sfNetAPI.describe.mockReset();
  });

  it('fetchCallToDos', async () => {
    await fetchCallToDos({
      callId: '1',
      page: 1,
      rowsPerPage: 5,
      sortColumn: 'complianceName',
      sortOrder: 'ASC',
    });

    expect(databaseManager.fetch).toHaveBeenCalled();
  });

  it('fetchCallToDosCount', async () => {
    databaseManager.fetch.mockResolvedValueOnce({ records: [{ totalSize: 0 }] });
    await fetchCallToDosCount('1');

    expect(databaseManager.fetch).toHaveBeenCalled();
  });

  describe('fetchComplianceTypes', () => {
    it('ios', async () => {
      metadataBridge.describe.mockResolvedValueOnce({ fields: [COMPLIANCE_TYPE_FIELD] });

      await fetchComplianceTypes();

      expect(metadataBridge.describe).toHaveBeenCalled();
    });

    it('web', async () => {
      Platform.OS = 'web';
      sfNetAPI.describe.mockResolvedValueOnce({ fields: [COMPLIANCE_TYPE_FIELD] });

      await fetchComplianceTypes();

      expect(sfNetAPI.describe).toHaveBeenCalled();
    });
  });

  describe('fetchSurveyTypes', () => {
    it('ios', async () => {
      Platform.OS = 'ios';
      metadataBridge.describe.mockResolvedValueOnce({ fields: [SURVEY_TYPE_FIELD] });

      await fetchSurveyTypes();

      expect(metadataBridge.describe).toHaveBeenCalled();
    });

    it('web', async () => {
      Platform.OS = 'web';
      sfNetAPI.describe.mockResolvedValueOnce({ fields: [SURVEY_TYPE_FIELD] });

      await fetchSurveyTypes();

      expect(sfNetAPI.describe).toHaveBeenCalled();
    });
  });

  it('fetchByQueryLocator', async () => {
    await fetchByQueryLocator('1');

    expect(databaseManager.fetch).toHaveBeenCalled();
  });

  describe('fetchAllComplianceRecords', () => {
    it('without queryLocator', async () => {
      Platform.OS = 'ios';
      databaseManager.fetch.mockResolvedValueOnce({ records: [], done: true, queryLocator: null });

      await fetchAllComplianceRecords({
        callDateTime: '2023-02-22T11:36:00.000+0000',
        complianceType: 'EPPV',
      });

      expect(databaseManager.fetch).toHaveBeenCalled();
    });

    it('with queryLocator', async () => {
      databaseManager.fetch.mockResolvedValueOnce({ records: [], done: true, queryLocator: null });

      await fetchAllComplianceRecords(
        {
          callDateTime: '2023-02-22T11:36:00.000+0000',
          complianceType: 'EPPV',
        },
        'ql'
      );

      expect(databaseManager.fetch).toHaveBeenCalled();
    });
  });

  it('fetchCall', async () => {
    await fetchCall('1');

    expect(databaseManager.fetch).toHaveBeenCalled();
  });

  describe('fetchAccounts', () => {
    it('without searchQuery', async () => {
      await fetchAccounts({
        parentId: '1',
        searchQuery: '',
        sortColumn: 'Name',
        sortOrder: 'ASC',
      });

      expect(databaseManager.fetch).toHaveBeenCalled();
    });

    it('with searchQuery', async () => {
      await fetchAccounts({
        parentId: '1',
        searchQuery: 'Test',
        sortColumn: 'Name',
        sortOrder: 'ASC',
      });

      expect(databaseManager.fetch).toHaveBeenCalled();
    });
  });

  it('fetchCallToDoRecordType', async () => {
    databaseManager.fetch.mockResolvedValueOnce({ records: [{ Id: '1' }] });
    await fetchCallToDoRecordType('EPPV');

    expect(databaseManager.fetch).toHaveBeenCalled();
  });

  it('saveCallToDo', async () => {
    await saveCallToDo({});

    expect(databaseManager.upsert).toHaveBeenCalled();
  });

  it('deleteCallToDo', async () => {
    await deleteCallToDo('1');

    expect(databaseManager.delete).toHaveBeenCalled();
  });
});
