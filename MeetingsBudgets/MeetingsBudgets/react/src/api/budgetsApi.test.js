import { databaseManager } from 'oce-apps-bridges';
import {
  MAPPED_BUDGETS_DATA,
  MAPPED_MEETING_DATA,
  ORIGINAL_BUDGETS_DATA,
  ORIGINAL_MEETING_DATA,
} from '../constants';
import api from '../utils/api';
import * as budgetsApi from './budgetsApi';

jest.mock('../utils/api');

describe('budgetsApi', () => {
  beforeEach(() => {
    api.query.mockReset();
    api.queryOffline.mockReset();
    databaseManager.upsert.mockReset();
  });

  describe('fetchMeeting method', () => {
    test('should return data from API', async () => {
      api.queryOffline.mockResolvedValueOnce(ORIGINAL_MEETING_DATA);

      const response = await budgetsApi.fetchMeeting(MAPPED_MEETING_DATA.id);

      expect(api.queryOffline).toHaveBeenCalled();
      expect(response).toStrictEqual(ORIGINAL_MEETING_DATA);
    });

    test('should return error if API returns error', async () => {
      api.queryOffline.mockImplementation(() => {
        throw 'Test error';
      });

      await expect(() => {
        budgetsApi.fetchMeeting(MAPPED_MEETING_DATA.id);
      }).toThrow('Test error');
    });
  });

  describe('fetchBudgets method', () => {
    test('should return data from API (all parameters is enabled)', async () => {
      api.queryOffline.mockResolvedValueOnce([[ORIGINAL_BUDGETS_DATA[1].Id]]);
      api.queryOffline.mockResolvedValueOnce([ORIGINAL_BUDGETS_DATA[0]]);

      const response = await budgetsApi.fetchBudgets({
        searchQuery: 'test',
        isSystemGeneratedFilterEnabled: true,
        meeting: MAPPED_MEETING_DATA,
      });

      expect(api.queryOffline).toHaveBeenCalledTimes(2);
      expect(api.queryOffline).toHaveBeenLastCalledWith(
        `SELECT Id, Name, CurrencyIsoCode, OCE__ChildrenAllocatedAmount__c, OCE__ActualAmount__c, OCE__ConsumptionBudget__c, OCE__EndDate__c, OCE__EstimatedAmount__c, OCE__MeetingType__c, OCE__Remaining__c, OCE__StartDate__c, OCE__Status__c, OCE__TotalAmount__c FROM OCE__Budget__c WHERE Id NOT IN ('undefined') AND (OCE__Budget__c.Name LIKE '%test%' OR OCE__Budget__c.OCE__Status__c LIKE '%test%' OR OCE__Budget__c.OCE__MeetingType__c INCLUDES ('test')) AND OCE__MeetingType__c INCLUDES ('Speaker_Meeting') AND OCE__ConsumptionBudget__c = true AND OCE__Status__c = 'Active' AND OCE__StartDate__c <= '2021-09-07' AND OCE__EndDate__c >= '2021-09-08' ORDER BY Name ASC NULLS FIRST LIMIT 15 OFFSET 0`
      );
      expect(response).toStrictEqual([ORIGINAL_BUDGETS_DATA[0]]);
    });

    test('should return data from API (all parameters is disabled)', async () => {
      api.queryOffline.mockResolvedValueOnce([[]]);
      api.queryOffline.mockResolvedValueOnce(ORIGINAL_BUDGETS_DATA);

      const response = await budgetsApi.fetchBudgets({
        isSystemGeneratedFilterEnabled: false,
        meeting: MAPPED_MEETING_DATA,
      });

      expect(api.queryOffline).toHaveBeenCalledTimes(2);
      expect(api.queryOffline).toHaveBeenLastCalledWith(
        `SELECT Id, Name, CurrencyIsoCode, OCE__ChildrenAllocatedAmount__c, OCE__ActualAmount__c, OCE__ConsumptionBudget__c, OCE__EndDate__c, OCE__EstimatedAmount__c, OCE__MeetingType__c, OCE__Remaining__c, OCE__StartDate__c, OCE__Status__c, OCE__TotalAmount__c FROM OCE__Budget__c ORDER BY Name ASC NULLS FIRST LIMIT 15 OFFSET 0`
      );
      expect(response).toStrictEqual(ORIGINAL_BUDGETS_DATA);
    });

    test('should return error if API returns error', async () => {
      api.queryOffline.mockImplementationOnce(() => new Promise.resolve([[]]));
      api.queryOffline.mockImplementationOnce(() => {
        throw 'Test error';
      });

      await expect(() =>
        budgetsApi.fetchBudgets({
          isSystemGeneratedFilterEnabled: true,
          meeting: MAPPED_MEETING_DATA,
        })
      ).rejects.toEqual('Test error');
    });
  });

  describe('saveBudget method', () => {
    test('should return new record id from API if object to save is correct', async () => {
      api.queryOffline.mockResolvedValueOnce([[{ Id: 'a00000001' }]]);
      api.queryOffline.mockResolvedValueOnce([
        [{ Id: 'a00000001', OCE__ControllingField__c: 'CurrencyIsoCode' }],
      ]);
      api.queryOffline.mockResolvedValueOnce([
        [{ Id: 'a00000001', OCE__ControllingFieldValue__c: 'USD' }],
      ]);
      api.queryOffline.mockResolvedValueOnce([
        [
          {
            Id: 'a00000001',
            OCE__Create__c: 1,
            OCE__Delete__c: 1,
            OCE__Edit__c: 1,
          },
        ],
      ]);
      api.queryOffline.mockResolvedValueOnce([
        [
          {
            OCE__Field__c: 'Name',
            OCE__Operator__c: 'NOT_EQUALS',
            OCE__Value__c: 'test',
          },
          {
            OCE__Field__c: 'OCE__Meeting__r.Name',
            OCE__Operator__c: 'EQUALS',
            OCE__Value__c: 'meeting name',
          },
          {
            OCE__Field__c: 'OCE__Meeting__r.IsDeleted',
            OCE__Operator__c: 'NOT_EQUALS',
            OCE__Value__c: true,
          },
          {
            OCE__Field__c: 'OCE__Meeting__r.Type',
            OCE__Operator__c: 'EQUALS_NULL',
            OCE__Value__c: null,
          },
          {
            OCE__Field__c: 'OCE__Meeting__r.CreatorType',
            OCE__Operator__c: 'NOT_EQUALS_NULL',
            OCE__Value__c: null,
          },
          {
            OCE__Field__c: 'OCE__Meeting__r.TagList',
            OCE__Operator__c: 'IN',
            OCE__Value__c: 'one;two;three',
          },
          {
            OCE__Field__c: 'OCE__Meeting__r.RelationList',
            OCE__Operator__c: 'NOT_IN',
            OCE__Value__c: 'one;two;three',
          },
        ],
      ]);
      api.queryOffline.mockResolvedValueOnce([[{ Name: 'meeting name' }]]);
      api.queryOffline.mockResolvedValueOnce([[{ IsDeleted: 0 }]]);
      api.queryOffline.mockResolvedValueOnce([[{ Type: null }]]);
      api.queryOffline.mockResolvedValueOnce([[{ CreatorType: 'sales_rep' }]]);
      api.queryOffline.mockResolvedValueOnce([[{ TagList: 'two' }]]);
      api.queryOffline.mockResolvedValueOnce([[{ RelationList: 'test' }]]);
      databaseManager.upsert.mockResolvedValueOnce('new_record_id');

      let response = await budgetsApi.saveBudget(
        {
          ...MAPPED_BUDGETS_DATA[1],
          actualAmount: null,
          estimatedAmount: '$10000',
          totalAmount: 'USD 0',
        },
        MAPPED_MEETING_DATA.id
      );

      expect(databaseManager.upsert).toHaveBeenCalled();
      expect(databaseManager.upsert).toHaveBeenCalledWith([
        {
          CurrencyIsoCode: 'USD',
          Name: 'Alex',
          OCE__BudgetActualAmount__c: null,
          OCE__BudgetEstimatedAmount__c: 10000,
          OCE__BudgetTotalAmount__c: 0,
          OCE__Budget__c: 'a226g000000gb35AAA',
          OCE__ChildrenAllocatedAmount__c: 10000,
          OCE__Meeting__c: 'a471s0000009RqfAAE',
          sObject: 'OCE__MeetingBudget2__c',
        },
      ]);
      expect(response).toEqual([
        'new_record_id',
        { isNotSupported: [], isTooLong: [] },
      ]);
    });

    test('should return new record id from API if object to save is correct and pass list of ignored workflow conditions', async () => {
      api.queryOffline.mockResolvedValueOnce([[{ Id: 'a00000001' }]]);
      api.queryOffline.mockResolvedValueOnce([
        [{ Id: 'a00000001', OCE__ControllingField__c: 'CurrencyIsoCode' }],
      ]);
      api.queryOffline.mockResolvedValueOnce([
        [{ Id: 'a00000001', OCE__ControllingFieldValue__c: 'USD' }],
      ]);
      api.queryOffline.mockResolvedValueOnce([
        [
          {
            Id: 'a00000001',
            OCE__Create__c: 1,
            OCE__Delete__c: 1,
            OCE__Edit__c: 1,
          },
        ],
      ]);
      api.queryOffline.mockResolvedValueOnce([
        [
          {
            OCE__Field__c: 'Name',
            OCE__Operator__c: 'NOT_EQUALS',
            OCE__Value__c: 'test',
          },
          {
            OCE__Field__c:
              'OCE__Budget__r.OCE__ParentBudget__r.OCE__ParentBudget__r.Name',
            OCE__Operator__c: 'NOT_EQUALS',
            OCE__Value__c: 'test',
          },
          {
            OCE__Field__c: 'CreatedBy.Name',
            OCE__Operator__c: 'NOT_EQUALS',
            OCE__Value__c: 'Test name',
          },
        ],
      ]);
      databaseManager.upsert.mockResolvedValueOnce('new_record_id');

      let response = await budgetsApi.saveBudget(
        {
          ...MAPPED_BUDGETS_DATA[1],
          actualAmount: null,
          estimatedAmount: '$10000',
          totalAmount: 'USD 0',
        },
        MAPPED_MEETING_DATA.id
      );

      expect(databaseManager.upsert).toHaveBeenCalled();
      expect(databaseManager.upsert).toHaveBeenCalledWith([
        {
          CurrencyIsoCode: 'USD',
          Name: 'Alex',
          OCE__BudgetActualAmount__c: null,
          OCE__BudgetEstimatedAmount__c: 10000,
          OCE__BudgetTotalAmount__c: 0,
          OCE__Budget__c: 'a226g000000gb35AAA',
          OCE__ChildrenAllocatedAmount__c: 10000,
          OCE__Meeting__c: 'a471s0000009RqfAAE',
          sObject: 'OCE__MeetingBudget2__c',
        },
      ]);
      expect(response).toEqual([
        'new_record_id',
        {
          isNotSupported: [
            {
              OCE__Field__c: 'CreatedBy.Name',
              OCE__Operator__c: 'NOT_EQUALS',
              OCE__Value__c: 'Test name',
            },
          ],
          isTooLong: [
            {
              OCE__Field__c:
                'OCE__Budget__r.OCE__ParentBudget__r.OCE__ParentBudget__r.Name',
              OCE__Operator__c: 'NOT_EQUALS',
              OCE__Value__c: 'test',
            },
          ],
        },
      ]);
    });

    test('should return new record id from API if object to save is correct if conditions list is empty', async () => {
      api.queryOffline.mockResolvedValueOnce([[{ Id: 'a00000001' }]]);
      api.queryOffline.mockResolvedValueOnce([
        [{ Id: 'a00000001', OCE__ControllingField__c: 'CurrencyIsoCode' }],
      ]);
      api.queryOffline.mockResolvedValueOnce([
        [{ Id: 'a00000001', OCE__ControllingFieldValue__c: 'USD' }],
      ]);
      api.queryOffline.mockResolvedValueOnce([
        [
          {
            Id: 'a00000001',
            OCE__Create__c: 1,
            OCE__Delete__c: 1,
            OCE__Edit__c: 1,
          },
        ],
      ]);
      api.queryOffline.mockResolvedValueOnce([[]]);
      databaseManager.upsert.mockResolvedValueOnce('new_record_id');

      let response = await budgetsApi.saveBudget(
        {
          ...MAPPED_BUDGETS_DATA[1],
          actualAmount: null,
          estimatedAmount: '$10000',
          totalAmount: 'USD 0',
        },
        MAPPED_MEETING_DATA.id
      );

      expect(databaseManager.upsert).toHaveBeenCalled();
      expect(databaseManager.upsert).toHaveBeenCalledWith([
        {
          CurrencyIsoCode: 'USD',
          Name: 'Alex',
          OCE__BudgetActualAmount__c: null,
          OCE__BudgetEstimatedAmount__c: 10000,
          OCE__BudgetTotalAmount__c: 0,
          OCE__Budget__c: 'a226g000000gb35AAA',
          OCE__ChildrenAllocatedAmount__c: 10000,
          OCE__Meeting__c: 'a471s0000009RqfAAE',
          sObject: 'OCE__MeetingBudget2__c',
        },
      ]);
      expect(response).toEqual([
        'new_record_id',
        { isNotSupported: [], isTooLong: [] },
      ]);
    });

    test('should return specific error if condition return false', async () => {
      api.queryOffline.mockResolvedValueOnce([[{ Id: 'a00000001' }]]);
      api.queryOffline.mockResolvedValueOnce([
        [{ Id: 'a00000001', OCE__ControllingField__c: 'CurrencyIsoCode' }],
      ]);
      api.queryOffline.mockResolvedValueOnce([
        [{ Id: 'a00000001', OCE__ControllingFieldValue__c: 'USD' }],
      ]);
      api.queryOffline.mockResolvedValueOnce([
        [
          {
            Id: 'a00000001',
            OCE__Create__c: 0,
            OCE__Delete__c: 1,
            OCE__Edit__c: 1,
          },
        ],
      ]);
      api.queryOffline.mockResolvedValueOnce([
        [
          {
            OCE__Field__c: 'OCE__Meeting__r.Name',
            OCE__Operator__c: 'EQUALS',
            OCE__Value__c: 'test',
          },
          {
            OCE__Field__c: 'Name',
            OCE__Operator__c: 'NOT_EQUALS',
            OCE__Value__c: 'test',
          },
        ],
      ]);
      api.queryOffline.mockResolvedValueOnce([[{ Name: 'meeting name' }]]);

      await expect(() =>
        budgetsApi.saveBudget(
          {
            ...MAPPED_BUDGETS_DATA[1],
            actualAmount: null,
            estimatedAmount: '$10000',
            totalAmount: 'USD 0',
          },
          MAPPED_MEETING_DATA.id
        )
      ).rejects.toThrow('Workflow validation error.');
    });

    test('should return specific error if user does not have permission to add', async () => {
      api.queryOffline.mockResolvedValueOnce([[{ Id: 'a00000001' }]]);
      api.queryOffline.mockResolvedValueOnce([
        [{ Id: 'a00000001', OCE__ControllingField__c: 'CurrencyIsoCode' }],
      ]);
      api.queryOffline.mockResolvedValueOnce([
        [{ Id: 'a00000001', OCE__ControllingFieldValue__c: 'USD' }],
      ]);
      api.queryOffline.mockResolvedValueOnce([
        [
          {
            Id: 'a00000001',
            OCE__Create__c: 0,
            OCE__Delete__c: 1,
            OCE__Edit__c: 1,
          },
        ],
      ]);
      api.queryOffline.mockResolvedValueOnce([
        [
          {
            OCE__Field__c: 'Name',
            OCE__Operator__c: 'NOT_EQUALS',
            OCE__Value__c: 'test',
          },
        ],
      ]);

      await expect(() =>
        budgetsApi.saveBudget(
          {
            ...MAPPED_BUDGETS_DATA[1],
            actualAmount: null,
            estimatedAmount: '$10000',
            totalAmount: 'USD 0',
          },
          MAPPED_MEETING_DATA.id
        )
      ).rejects.toThrow('Workflow validation error.');
    });

    test('should return specific error if fetching permissions return error', async () => {
      api.queryOffline.mockImplementationOnce(() => {
        throw 'Test error';
      });

      await expect(() =>
        budgetsApi.saveBudget(
          {
            ...MAPPED_BUDGETS_DATA[1],
            actualAmount: null,
            estimatedAmount: '$10000',
            totalAmount: 'USD 0',
          },
          MAPPED_MEETING_DATA.id
        )
      ).rejects.toEqual('Test error');
    });

    test('should return error if API returns error', async () => {
      api.queryOffline.mockResolvedValueOnce([[{ Id: 'a00000001' }]]);
      api.queryOffline.mockResolvedValueOnce([
        [{ Id: 'a00000001', OCE__ControllingField__c: 'CurrencyIsoCode' }],
      ]);
      api.queryOffline.mockResolvedValueOnce([
        [{ Id: 'a00000001', OCE__ControllingFieldValue__c: 'USD' }],
      ]);
      api.queryOffline.mockResolvedValueOnce([
        [
          {
            Id: 'a00000001',
            OCE__Create__c: 1,
            OCE__Delete__c: 1,
            OCE__Edit__c: 1,
          },
        ],
      ]);
      api.queryOffline.mockResolvedValueOnce([
        [
          {
            OCE__Field__c: 'Name',
            OCE__Operator__c: 'NOT_EQUALS',
            OCE__Value__c: 'test',
          },
        ],
      ]);
      databaseManager.upsert.mockImplementationOnce(() => {
        throw 'Test error';
      });

      await expect(() =>
        budgetsApi.saveBudget(
          {
            ...MAPPED_BUDGETS_DATA[1],
            actualAmount: 'test',
            estimatedAmount: 'text',
            totalAmount: 'rust',
          },
          MAPPED_MEETING_DATA.id
        )
      ).rejects.toEqual('Test error');
    });
  });
});
