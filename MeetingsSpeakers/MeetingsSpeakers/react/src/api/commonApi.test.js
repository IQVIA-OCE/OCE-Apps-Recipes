import { NAMESPACE } from '../constants';
import api from '../utils/api';
import * as commonApi from './commonApi';
import * as speakersApi from './speakersApi';
import * as workflowApi from './workflowApi';

jest.mock('../utils/api');
jest.mock('./speakersApi', () => ({
  doesFieldExist: jest.fn(),
}));
jest.mock('./workflowApi');

const ACTIVE_TRIGGER = [{ [`${NAMESPACE}IsActive__c`]: 1 }];
const ACTIVITY_PLAN_CONFIGS = [{ [`${NAMESPACE}Criteria__c`]: '' }];

const setupCommonWorkflowApiMocks = () => {
  workflowApi.fetchWorkflowNode.mockResolvedValueOnce([[{ Id: '5', [`${NAMESPACE}ControllingFieldValue__c`]: 'Draft' }]]);
  workflowApi.fetchContext.mockResolvedValueOnce([[{ Id: '6' }]]);
  workflowApi.fetchContextConditions
    .mockResolvedValueOnce([
      [
        {
          [`${NAMESPACE}Field__c`]: `${NAMESPACE}Status__c`,
          [`${NAMESPACE}Operator__c`]: 'EQUALS',
          [`${NAMESPACE}Value__c`]: 'Draft',
        },
      ],
    ]);
  workflowApi.fetchContextType.mockResolvedValueOnce([[{ Id: '7' }]]);
  workflowApi.fetchWorkflowConfiguration.mockResolvedValueOnce([[{ Id: '8', [`${NAMESPACE}ControllingField__c`]: 'CurrencyIsoCode' }]]);
  workflowApi.fetchWorkflowNode.mockResolvedValueOnce([[{ Id: '9', [`${NAMESPACE}ControllingFieldValue__c`]: 'USD' }]]);
  workflowApi.fetchContext.mockResolvedValueOnce([[{ Id: '10', [`${NAMESPACE}Delete__c`]: 1 }]]);
  workflowApi.fetchContextConditions
    .mockResolvedValueOnce([
      [
        {
          [`${NAMESPACE}Field__c`]: 'RecordType.DeveloperName',
          [`${NAMESPACE}Operator__c`]: 'IN',
          [`${NAMESPACE}Value__c`]: 'Org;Coorg',
        },
      ],
    ]);
};

describe('commonApi', () => {
  afterEach(() => {
    api.queryOffline.mockClear();
  });

  describe('checkIfTriggerIsEnabled', () => {
    it('success path', async () => {
      api.queryOffline.mockResolvedValueOnce([ACTIVE_TRIGGER]);

      const isEnabled = await commonApi.checkIfTriggerIsEnabled('test');
      expect(api.queryOffline).toHaveBeenCalled();
      expect(isEnabled).toBe(true);
    });

    it('error path', async () => {
      api.queryOffline.mockRejectedValueOnce(new Error('error'));
      const isEnabled = await commonApi.checkIfTriggerIsEnabled('test');

      expect(api.queryOffline).toHaveBeenCalled();
      expect(isEnabled).toBe(false);
    });
  });

  describe('checkUtilizationFieldsAccessGranted', () => {
    it('success path', async () => {
      speakersApi.doesFieldExist.mockResolvedValueOnce(true).mockResolvedValueOnce(true);

      const fieldsConfig = await commonApi.checkUtilizationFieldsAccessGranted();
      expect(speakersApi.doesFieldExist).toHaveBeenCalled();
      expect(fieldsConfig).toStrictEqual([
        { field: `${NAMESPACE}AccountGoal__c`, isAccessible: true },
        { field: `${NAMESPACE}Account__c`, isAccessible: true },
      ]);
    });

    it('error path', async () => {
      speakersApi.doesFieldExist.mockRejectedValueOnce(new Error('error'));

      const fieldsConfig = await commonApi.checkUtilizationFieldsAccessGranted();
      expect(speakersApi.doesFieldExist).toHaveBeenCalled();
      expect(fieldsConfig).toStrictEqual([
        { field: `${NAMESPACE}AccountGoal__c`, isAccessible: false },
        { field: `${NAMESPACE}Account__c`, isAccessible: false },
      ]);
    });
  });

  it('fetchActivityPlanConfigs', async () => {
    api.queryOffline.mockResolvedValueOnce([ACTIVITY_PLAN_CONFIGS]);

    const configs = await commonApi.fetchActivityPlanConfigs();
    expect(api.queryOffline).toHaveBeenCalled();
    expect(configs).toStrictEqual([ACTIVITY_PLAN_CONFIGS]);
  });

  describe('checkCanDeleteMeetingMember', () => {
    it('should return true if the user can delete the meeting member', async () => {
      workflowApi.fetchContextType.mockResolvedValueOnce([[{ Id: '1' }]]);
      workflowApi.fetchWorkflowConfiguration.mockResolvedValueOnce([[{ Id: '2', [`${NAMESPACE}ContextType__c`]: '4' }]]);
      setupCommonWorkflowApiMocks();

      const meeting = { Id: '2', [`${NAMESPACE}Status__c`]: 'Draft' };
      const meetingMember = { Id: '3', 'RecordType.DeveloperName': 'Org', CurrencyIsoCode: 'USD' };
      const [canDelete] = await commonApi.checkCanDeleteMeetingMember(meeting, meetingMember);

      expect(canDelete).toBe(true);
    });
    it('should return false if there was an error during checking if the user can delete meeting member', async () => {
      workflowApi.fetchContextType.mockRejectedValueOnce(new Error('error'));

      const meeting = { Id: '2', [`${NAMESPACE}Status__c`]: 'Draft' };
      const meetingMember = { Id: '3', 'RecordType.DeveloperName': 'Org' };
      const [canDelete] = await commonApi.checkCanDeleteMeetingMember(meeting, meetingMember);

      expect(canDelete).toBe(false);
    });
  });

  it('fetchCurrentContextNode', async () => {
    setupCommonWorkflowApiMocks();

    const [contextNode] = await commonApi.fetchCurrentContextNode({
      config: { Id: '1', [`${NAMESPACE}ContextType__c`]: '4' },
      meeting: { Id: '2', [`${NAMESPACE}Status__c`]: 'Draft' },
      meetingMember: { Id: '3', 'RecordType.DeveloperName': 'Org', CurrencyIsoCode: 'USD' },
    });

    expect(contextNode).toStrictEqual({ Id: '10', [`${NAMESPACE}Delete__c`]: 1 });
  });

  describe('checkConditionsPassed', () => {
    it('should return true if all conditions pass (single value)', async () => {
      const conditions = [
        {
          [`${NAMESPACE}Field__c`]: `${NAMESPACE}Status__c`,
          [`${NAMESPACE}Operator__c`]: 'EQUALS',
          [`${NAMESPACE}Value__c`]: 'Draft',
        },
      ];
      const object = {
        [`${NAMESPACE}Status__c`]: 'Draft',
      };

      const [conditionsPassed] = await commonApi.checkConditionsPassed(conditions, object);

      expect(conditionsPassed).toBe(true);
    });

    it('should return true if all conditions pass (multiple values)', async () => {
      const conditions = [
        {
          [`${NAMESPACE}Field__c`]: 'RecordType.DeveloperName',
          [`${NAMESPACE}Operator__c`]: 'IN',
          [`${NAMESPACE}Value__c`]: 'Org;Coorg',
        },
      ];
      const object = {
        'RecordType.DeveloperName': 'Coorg',
      };

      const [conditionsPassed] = await commonApi.checkConditionsPassed(conditions, object);

      expect(conditionsPassed).toBe(true);
    });

    it('should return false if some condition does not pass', async () => {
      const conditions = [
        {
          [`${NAMESPACE}Field__c`]: `${NAMESPACE}Status__c`,
          [`${NAMESPACE}Operator__c`]: 'EQUALS',
          [`${NAMESPACE}Value__c`]: 'Draft',
        },
      ];
      const object = {
        [`${NAMESPACE}Status__c`]: 'Closed',
      };

      const [conditionsPassed] = await commonApi.checkConditionsPassed(conditions, object);

      expect(conditionsPassed).toBe(false);
    });

    it('should return true  with nested field in condition', async () => {
      api.queryOffline.mockResolvedValueOnce([[{ Foo: 'Bar' }]]);

      const conditions = [
        {
          [`${NAMESPACE}Field__c`]: `${NAMESPACE}Status__r.Foo`,
          [`${NAMESPACE}Operator__c`]: 'EQUALS',
          [`${NAMESPACE}Value__c`]: 'Bar',
        },
      ];
      const object = {
        [`${NAMESPACE}Status__c`]: 'Closed',
      };

      const [conditionsPassed] = await commonApi.checkConditionsPassed(conditions, object);
      expect(conditionsPassed).toBe(true);
    });
  });

  it('should not check deeply nested field in condition (i.e. ignore it and return true)', async () => {
    const conditions = [
      {
        [`${NAMESPACE}Field__c`]: `${NAMESPACE}Status__r.Foo__r.Baz__r.Name`,
        [`${NAMESPACE}Operator__c`]: 'EQUALS',
        [`${NAMESPACE}Value__c`]: 'Bar',
      },
    ];
    const object = {
      [`${NAMESPACE}Status__c`]: 'Closed',
    };

    const [conditionsPassed] = await commonApi.checkConditionsPassed(conditions, object);

    expect(conditionsPassed).toBe(true);
    expect(api.queryOffline).not.toHaveBeenCalled();
  });

  it('should ignore the field that is missing in validated object and return true', async () => {
    const conditions = [
      {
        [`${NAMESPACE}Field__c`]: 'Foo',
        [`${NAMESPACE}Operator__c`]: 'EQUALS',
        [`${NAMESPACE}Value__c`]: 'Bar',
      },
    ];
    const object = {
      [`${NAMESPACE}Status__c`]: 'Closed',
    };

    const [conditionsPassed] = await commonApi.checkConditionsPassed(conditions, object);

    expect(conditionsPassed).toBe(true);
    expect(api.queryOffline).not.toHaveBeenCalled();
  });

  describe('validateAllActiveActivityPlanConfigs', () => {
    it('should not return an error if all configs are valid', async () => {
      api.queryOffline.mockResolvedValueOnce([
        [
          {
            [`${NAMESPACE}Criteria__c`]: '{"utilizationTypes":{"actual":true,"estimated":true,"committed":true}}',
          },
        ],
      ]);
      const error = await commonApi.validateAllActiveActivityPlanConfigs();
      expect(error).toBe(undefined);
    });

    it('should return an error if some config is invalid', async () => {
      api.queryOffline.mockResolvedValueOnce([
        [
          {
            [`${NAMESPACE}Criteria__c`]: null,
          },
        ],
      ]);
      const error = await commonApi.validateAllActiveActivityPlanConfigs();
      expect(error).toBeTruthy();
    });
  });

  describe('validateCriteriaJSON', () => {
    it('should not return an error if input json is valid', () => {
      const json = '{"utilizationTypes":{"actual":true,"estimated":true,"committed":true}}';
      const error = commonApi.validateCriteriaJSON(json);
      expect(error).toBe(null);
    });

    it('should return an error if input json is invalid', () => {
      const json = 'invalid json';
      const error = commonApi.validateCriteriaJSON(json);
      expect(error).toBe('Invalid JSON format/structure of Activity Plan Config');
    });

    it('should return an error if all required fields are null in input json', () => {
      const json = '{"utilizationTypes":{"actual":null,"estimated":null,"committed":null}}';
      const error = commonApi.validateCriteriaJSON(json);
      expect(error).toBe('Invalid JSON format/structure of Activity Plan Config');
    });
  });

  it('checkAccountUtilizationEnabled', async () => {
    api.queryOffline.mockResolvedValueOnce([ACTIVE_TRIGGER]).mockResolvedValueOnce([ACTIVE_TRIGGER]);

    const isEnabled = await commonApi.checkAccountUtilizationEnabled();
    expect(api.queryOffline).toHaveBeenCalled();
    expect(isEnabled).toBe(true);
  });
});
