import api from '../utils/api';
import * as commonApi from './commonApi';
import * as speakersApi from './speakersApi';
import * as workflowApi from './workflowApi';

jest.mock('../utils/api');
jest.mock('./speakersApi', () => ({
  doesFieldExist: jest.fn(),
}));
jest.mock('./workflowApi');

const ACTIVE_TRIGGER = [{ OCE__IsActive__c: 1 }];
const ACTIVITY_PLAN_CONFIGS = [{ OCE__Criteria__c: '' }];

const setupCommonWorkflowApiMocks = () => {
  workflowApi.fetchContextTypeById.mockResolvedValueOnce([[{ Id: '4' }]]);
  workflowApi.fetchWorkflowNode.mockResolvedValueOnce([[{ Id: '5', OCE__MeetingStatus__c: 'Draft' }]]);
  workflowApi.fetchContext.mockResolvedValueOnce([[{ Id: '6' }]]);
  workflowApi.fetchContextConditions
    .mockResolvedValueOnce([
      [
        {
          OCE__Field__c: 'OCE__Status__c',
          OCE__Operator__c: 'EQUALS',
          OCE__Value__c: 'Draft',
        },
      ],
    ])
    .mockResolvedValueOnce([
      [
        {
          OCE__Field__c: 'RecordType.DeveloperName',
          OCE__Operator__c: 'IN',
          OCE__Value__c: 'Org;Coorg',
        },
      ],
    ]);
  workflowApi.fetchChildContextType.mockResolvedValueOnce([[{ Id: '7' }]]);
  workflowApi.fetchChildContext.mockResolvedValueOnce([[{ Id: '8', OCE__Delete__c: 1 }]]);
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
        { field: 'OCE__AccountGoal__c', isAccessible: true },
        { field: 'OCE__Account__c', isAccessible: true },
      ]);
    });

    it('error path', async () => {
      speakersApi.doesFieldExist.mockRejectedValueOnce(new Error('error'));

      const fieldsConfig = await commonApi.checkUtilizationFieldsAccessGranted();
      expect(speakersApi.doesFieldExist).toHaveBeenCalled();
      expect(fieldsConfig).toStrictEqual([
        { field: 'OCE__AccountGoal__c', isAccessible: false },
        { field: 'OCE__Account__c', isAccessible: false },
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
      workflowApi.fetchWorkflowConfiguration.mockResolvedValueOnce([[{ Id: '2' }]]);
      setupCommonWorkflowApiMocks();

      const meeting = { Id: '2', OCE__Status__c: 'Draft' };
      const meetingMember = { Id: '3', 'RecordType.DeveloperName': 'Org' };
      const [canDelete] = await commonApi.checkCanDeleteMeetingMember(meeting, meetingMember);

      expect(canDelete).toBe(true);
    });
    it('should return false if there was an error during checking if the user can delete meeting member', async () => {
      workflowApi.fetchContextType.mockRejectedValueOnce(new Error('error'));

      const meeting = { Id: '2', OCE__Status__c: 'Draft' };
      const meetingMember = { Id: '3', 'RecordType.DeveloperName': 'Org' };
      const [canDelete] = await commonApi.checkCanDeleteMeetingMember(meeting, meetingMember);

      expect(canDelete).toBe(false);
    });
  });

  it('fetchCurrentContextNode', async () => {
    setupCommonWorkflowApiMocks();

    const [contextNode] = await commonApi.fetchCurrentContextNode({
      config: {
        Id: '1',
        OCE__ContextType__c: 'OCE__Meeting__c',
      },
      meeting: { Id: '2', OCE__Status__c: 'Draft' },
      meetingMember: { Id: '3', 'RecordType.DeveloperName': 'Org' },
    });

    expect(contextNode).toStrictEqual({ Id: '8', OCE__Delete__c: 1 });
  });

  describe('checkConditionsPassed', () => {
    it('should return true if all conditions pass (single value)', async () => {
      const conditions = [
        {
          OCE__Field__c: 'OCE__Status__c',
          OCE__Operator__c: 'EQUALS',
          OCE__Value__c: 'Draft',
        },
      ];
      const object = {
        OCE__Status__c: 'Draft',
      };

      const [conditionsPassed] = await commonApi.checkConditionsPassed(conditions, object);

      expect(conditionsPassed).toBe(true);
    });

    it('should return true if all conditions pass (multiple values)', async () => {
      const conditions = [
        {
          OCE__Field__c: 'RecordType.DeveloperName',
          OCE__Operator__c: 'IN',
          OCE__Value__c: 'Org;Coorg',
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
          OCE__Field__c: 'OCE__Status__c',
          OCE__Operator__c: 'EQUALS',
          OCE__Value__c: 'Draft',
        },
      ];
      const object = {
        OCE__Status__c: 'Closed',
      };

      const [conditionsPassed] = await commonApi.checkConditionsPassed(conditions, object);

      expect(conditionsPassed).toBe(false);
    });

    it('should return true  with nested field in condition', async () => {
      api.queryOffline.mockResolvedValueOnce([[{ Foo: 'Bar' }]]);

      const conditions = [
        {
          OCE__Field__c: 'OCE__Status__r.Foo',
          OCE__Operator__c: 'EQUALS',
          OCE__Value__c: 'Bar',
        },
      ];
      const object = {
        OCE__Status__c: 'Closed',
      };

      const [conditionsPassed] = await commonApi.checkConditionsPassed(conditions, object);
      expect(conditionsPassed).toBe(true);
    });
  });

  it('should not check deeply nested field in condition (i.e. ignore it and return true)', async () => {
    const conditions = [
      {
        OCE__Field__c: 'OCE__Status__r.Foo__r.Baz__r.Name',
        OCE__Operator__c: 'EQUALS',
        OCE__Value__c: 'Bar',
      },
    ];
    const object = {
      OCE__Status__c: 'Closed',
    };

    const [conditionsPassed] = await commonApi.checkConditionsPassed(conditions, object);

    expect(conditionsPassed).toBe(true);
    expect(api.queryOffline).not.toHaveBeenCalled();
  });

  it('should ignore the field that is missing in validated object and return true', async () => {
    const conditions = [
      {
        OCE__Field__c: 'Foo',
        OCE__Operator__c: 'EQUALS',
        OCE__Value__c: 'Bar',
      },
    ];
    const object = {
      OCE__Status__c: 'Closed',
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
            OCE__Criteria__c: '{"utilizationTypes":{"actual":true,"estimated":true,"committed":true}}',
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
            OCE__Criteria__c: null,
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
