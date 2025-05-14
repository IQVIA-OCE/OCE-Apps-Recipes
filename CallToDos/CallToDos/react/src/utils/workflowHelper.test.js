import { fetchContextType, fetchWorkflowConfiguration, fetchWorkflowNodes, fetchContextWithChildObject, fetchContext, fetchContextConditions } from './workflowHelper';
import * as api from "./workflowHelper";

jest.mock('../utils/helpers', () => ({
  queryWithSOQL: jest.fn(),
}));

const queryWithSOQL = require('../utils/helpers').queryWithSOQL;

describe("getPermissionsByWorkflow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return correct permissions if everything is successful", async () => {
    //fetchContextType
    queryWithSOQL.mockResolvedValueOnce([{ Id: "1" }]);
    //fetchWorkflowConfiguration
    queryWithSOQL.mockResolvedValueOnce([{
      Id: "2",
      OCE__ControllingField__c: "field",
      OCE__RecordTypeName__c: "recordType"
    }]);
    //fetchWorkflowNodes
    queryWithSOQL.mockResolvedValueOnce([{
      Id: "3",
      OCE__ControllingFieldValue__c: "value"
    }]);
    //fetchContext
    queryWithSOQL.mockResolvedValueOnce([{
      Id: "4",
      OCE__Create__c: true,
      OCE__Delete__c: true,
      OCE__Edit__c: true
    },
    {
      Id: "5",
      OCE__Create__c: true,
      OCE__Delete__c: true,
      OCE__Edit__c: true
    }]);
    //fetchContextConditions
    queryWithSOQL.mockResolvedValueOnce([{
      Id: "6",
      OCE__Field__c: "field",
      OCE__Operator__c: "NOT_EQUALS",
      OCE__Value__c: "value1",
      OCE__Context__c: "4"
    },
    {
      Id: "7",
      OCE__Field__c: "field",
      OCE__Operator__c: "IN",
      OCE__Value__c: "value;A",
      OCE__Context__c: "4"
    },
    {
      Id: "8",
      OCE__Field__c: "field",
      OCE__Operator__c: "NOT_IN",
      OCE__Value__c: "A;B",
      OCE__Context__c: "4"
    },
    {
      Id: "9",
      OCE__Field__c: "field",
      OCE__Operator__c: "EQUALS_NULL",
      OCE__Value__c: null,
      OCE__Context__c: "4"
    },
    {
      Id: "10",
      OCE__Field__c: "field",
      OCE__Operator__c: "EQUALS",
      OCE__Value__c: "value",
      OCE__Context__c: "4"
    }]);
    //fetchContextWithChildObject
    queryWithSOQL.mockResolvedValueOnce([{
      Id: "4",
      OCE__Create__c: true,
      OCE__Delete__c: true,
      OCE__Edit__c: true
    }]);

    const result = await api.getPermissionsByWorkflow(
      { field: "value" },
      "mainObjectName",
      "childObjectName",
      {field: "value"}
    );

  });
});

describe("getPermissionsByWorkflow 2", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("condition checkers not equals null", async () => {
    //fetchContextType
    queryWithSOQL.mockResolvedValueOnce([{ Id: "1" }]);
    //fetchWorkflowConfiguration
    queryWithSOQL.mockResolvedValueOnce([{
      Id: "2",
      OCE__ControllingField__c: "field",
      OCE__RecordTypeName__c: "recordType"
    }]);
    //fetchWorkflowNodes
    queryWithSOQL.mockResolvedValueOnce([{
      Id: "3",
      OCE__ControllingFieldValue__c: null
    }]);
    //fetchContext
    queryWithSOQL.mockResolvedValueOnce([{
      Id: "4",
      OCE__Create__c: true,
      OCE__Delete__c: true,
      OCE__Edit__c: true
    },
    {
      Id: "5",
      OCE__Create__c: true,
      OCE__Delete__c: true,
      OCE__Edit__c: true
    }]);
    //fetchContextConditions
    queryWithSOQL.mockResolvedValueOnce([
    {
      Id: "8",
      OCE__Field__c: "field",
      OCE__Operator__c: "NOT_EQUALS_NULL",
      OCE__Value__c: "value1",
      OCE__Context__c: "4"
    }]);
    //fetchContextWithChildObject
    queryWithSOQL.mockResolvedValueOnce([{
      Id: "4",
      OCE__Create__c: true,
      OCE__Delete__c: true,
      OCE__Edit__c: true
    }]);

    const result = await api.getPermissionsByWorkflow(
      { field: null },
      "mainObjectName",
      "childObjectName",
      {field: "value"}
    );
  });
});

describe("getPermissionsByWorkflow 3", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("no workflow context", async () => {
    //fetchContextType
    queryWithSOQL.mockResolvedValueOnce([{ Id: "1" }]);
    //fetchWorkflowConfiguration
    queryWithSOQL.mockResolvedValueOnce([{
      Id: false,
      OCE__ControllingField__c: "field",
      OCE__RecordTypeName__c: "recordType"
    }]);

    const result = await api.getPermissionsByWorkflow(
      { field: "value" },
      "mainObjectName",
      "childObjectName",
      {field: "value"}
    );

  });
});

describe("getPermissionsByWorkflow 4", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("conditions not passed", async () => {
    //fetchContextType
    queryWithSOQL.mockResolvedValueOnce([{ Id: "1" }]);
    //fetchWorkflowConfiguration
    queryWithSOQL.mockResolvedValueOnce([{
      Id: "2",
      OCE__ControllingField__c: "field",
      OCE__RecordTypeName__c: "recordType"
    }]);
    //fetchWorkflowNodes
    queryWithSOQL.mockResolvedValueOnce([{
      Id: "3",
      OCE__ControllingFieldValue__c: "value"
    }]);
    //fetchContext
    queryWithSOQL.mockResolvedValueOnce([{
      Id: "4",
      OCE__Create__c: true,
      OCE__Delete__c: true,
      OCE__Edit__c: true
    },
    {
      Id: "5",
      OCE__Create__c: true,
      OCE__Delete__c: true,
      OCE__Edit__c: true
    }]);
    //fetchContextConditions
    queryWithSOQL.mockResolvedValueOnce([{
      Id: "6",
      OCE__Field__c: "field",
      OCE__Operator__c: "EQUALS",
      OCE__Value__c: "value1",
      OCE__Context__c: "4"
    }]);
    //fetchContextWithChildObject
    queryWithSOQL.mockResolvedValueOnce([{
      Id: "4",
      OCE__Create__c: true,
      OCE__Delete__c: true,
      OCE__Edit__c: true
    }]);

    const result = await api.getPermissionsByWorkflow(
      { field: "value" },
      "mainObjectName",
      "childObjectName",
      {field: "value"}
    );

  });
});

describe("getPermissionsByWorkflow 5", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("child object, no child record", async () => {
    //fetchContextType
    queryWithSOQL.mockResolvedValueOnce([{ Id: "1" }]);
    //fetchWorkflowConfiguration
    queryWithSOQL.mockResolvedValueOnce([{
      Id: "2",
      OCE__ControllingField__c: "field",
      OCE__RecordTypeName__c: "recordType"
    }]);
    //fetchWorkflowNodes
    queryWithSOQL.mockResolvedValueOnce([{
      Id: "3",
      OCE__ControllingFieldValue__c: "value"
    }]);
    //fetchContext
    queryWithSOQL.mockResolvedValueOnce([{
      Id: "4",
      OCE__Create__c: true,
      OCE__Delete__c: true,
      OCE__Edit__c: true
    },
    {
      Id: "5",
      OCE__Create__c: true,
      OCE__Delete__c: true,
      OCE__Edit__c: true
    }]);
    //fetchContextConditions
    queryWithSOQL.mockResolvedValueOnce([{
      Id: "6",
      OCE__Field__c: "field",
      OCE__Operator__c: "EQUALS",
      OCE__Value__c: "value1",
      OCE__Context__c: "4"
    }]);
    //fetchContextWithChildObject
    queryWithSOQL.mockResolvedValueOnce([{
      Id: "4",
      OCE__Create__c: true,
      OCE__Delete__c: true,
      OCE__Edit__c: true
    }]);

    const result = await api.getPermissionsByWorkflow(
      { field: "value" },
      "mainObjectName",
      "childObjectName",
      false
    );

  });
});

describe("getPermissionsByWorkflow 6", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("no child object", async () => {
    //fetchContextType
    queryWithSOQL.mockResolvedValueOnce([{ Id: "1" }]);
    //fetchWorkflowConfiguration
    queryWithSOQL.mockResolvedValueOnce([{
      Id: "2",
      OCE__ControllingField__c: "field",
      OCE__RecordTypeName__c: "recordType"
    }]);
    //fetchWorkflowNodes
    queryWithSOQL.mockResolvedValueOnce([{
      Id: "3",
      OCE__ControllingFieldValue__c: "value"
    }]);
    //fetchContext
    queryWithSOQL.mockResolvedValueOnce([{
      Id: "4",
      OCE__Create__c: true,
      OCE__Delete__c: true,
      OCE__Edit__c: true
    },
    {
      Id: "5",
      OCE__Create__c: true,
      OCE__Delete__c: true,
      OCE__Edit__c: true
    }]);
    //fetchContextConditions
    queryWithSOQL.mockResolvedValueOnce([{
      Id: "6",
      OCE__Field__c: "field",
      OCE__Operator__c: "EQUALS",
      OCE__Value__c: "value1",
      OCE__Context__c: "4"
    }]);
    //fetchContextWithChildObject
    queryWithSOQL.mockResolvedValueOnce([{
      Id: "4",
      OCE__Create__c: true,
      OCE__Delete__c: true,
      OCE__Edit__c: true
    }]);

    const result = await api.getPermissionsByWorkflow(
      { field: "value" },
      "mainObjectName",
      "",
      false
    );

  });
});

/*
import { getPermissionsByWorkflow } from './workflowHelper';
import * as workflowHelper from './workflowHelper';
import { databaseManager } from '@oce-apps/oce-apps-bridges';
import { queryWithSOQL } from './helpers';

jest.mock("./helpers", () => ({
  queryWithSOQL: jest.fn()
}));

jest.mock('@oce-apps/oce-apps-bridges', () => ({
  databaseManager: {
      upsert: jest.fn(),
      fetch: jest.fn(),
      delete: jest.fn(),
  },
  environment: {
    locale: () => 'en_US',
    userId: () => 'User_Z1'
  },
}));

//jest.mock('./workflowHelper');

describe('getPermissionsByWorkflow', () => {
  let record, mainObjectName, childObjectName, childRecord;
  beforeEach(() => {
    record = {};
    mainObjectName = 'main object';
    childObjectName = 'child object';
    childRecord = {};
  });

  it('should return default permissions when no workflow configurations are found', async () => {
    const spy = jest.spyOn(workflowHelper, 'fetchContextType').mockReturnValue([{Id: 1}]);
    //workflowHelper.fetchContextType.mockResolvedValueOnce([{Id: 1}]);

    const result = await getPermissionsByWorkflow(record, mainObjectName, childObjectName, childRecord);

    expect(spy).toHaveBeenCalledWith(mainObjectName);
    expect(result).toEqual({
      canAddMain: true,
      canEditMain: true,
      canDeleteMain: true,
      mainObjectContextFound: false,
      canAddChild: true,
      canEditChild: true,
      canDeleteChild: true,
      childObjectContextFound: false,
    });
  });

  it('should return permissions when a workflow configuration is found', async () => {
    const spy1 = jest.spyOn(workflowHelper, 'fetchContextType')
      .mockResolvedValue([{ Id: '1' }]);
    const spy2 = jest.spyOn(workflowHelper, 'fetchWorkflowConfiguration')
      .mockResolvedValue([{ Id: '2', OCE__ControllingField__c: 'field', OCE__RecordTypeName__c: 'record type' }]);
    const spy3 = jest.spyOn(workflowHelper, 'fetchWorkflowNodes')
      .mockResolvedValue([{ Id: '3', OCE__ControllingFieldValue__c: 'field value' }]);
    const spy4 = jest.spyOn(workflowHelper, 'fetchContext')
      .mockResolvedValue([{ Id: '4', OCE__Create__c: true, OCE__Edit__c: true, OCE__Delete__c: false }]);

    record.field = 'field value';
    const result = await workflowHelper.getPermissionsByWorkflow(record, mainObjectName, childObjectName, childRecord);

    expect(spy1).toHaveBeenCalledWith(mainObjectName);
    expect(spy2).toHaveBeenCalledWith('1');
    expect(spy3).toHaveBeenCalledWith('2');
    expect(spy4).toHaveBeenCalledWith('3');
    expect(result).toEqual({
      canAddMain: true,
      canEditMain: true,
      canDeleteMain: false,
      mainObjectContextFound: true,
      canAddChild: true,
      canEditChild: true,
      canDeleteChild: true,
      childObjectContextFound: false,
    });
  });
});

import { queryWithSOQL } from './helpers';
import {
  fetchContextType,
  fetchWorkflowConfiguration, 
  fetchWorkflowNodes, 
  fetchContextWithChildObject, 
  fetchContext,
  fetchContextConditions,
  getPermissionsByWorkflow
} from "./workflowHelper";
import { environment, databaseManager } from '@oce-apps/oce-apps-bridges';

jest.mock('@oce-apps/oce-apps-bridges', () => ({
  databaseManager: {
      upsert: jest.fn(),
      fetch: jest.fn(),
      delete: jest.fn(),
  },
  environment: {
    locale: () => 'en_US',
    userID: () => 'User_Z1'
  },
}));


jest.mock("./helpers", () => ({
  queryWithSOQL: jest.fn()
}));

jest.mock("./workflowHelper", () => ({
  fetchContextType: jest.fn()
}));

describe("workflowHelper with no data", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });
  it("should call queryWithSOQL function with the correct parameters", async () => {
    fetchContextType.mockResolvedValueOnce([{Id: 1}]);
    //const contextType = await fetchContextType("MainObject");
    //console.log(contextType);
    //queryWithSOQL.mockResolvedValueOnce([{Id: 1}]);
    //await fetchWorkflowConfiguration(contextType[0].Id);
    await getPermissionsByWorkflow([], "MainObject", "ChildObject", []);
  });
});

describe("workflowHelper", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const records = [
      { id: 1, name: 'record 1' },
      { id: 2, name: 'record 2' },
    ];
    const spy = jest.spyOn(databaseManager, "fetch").mockImplementationOnce(() => Promise.resolve({ 
      records
    }));
  });
  it("should call queryWithSOQL function with the correct parameters", async () => {
    queryWithSOQL.mockResolvedValueOnce([]);
    await fetchContextType("Account");
    expect(queryWithSOQL).toHaveBeenCalledWith(
      `SELECT Id, OCE__Object__c, OCE__isControlledByWorkflowPath__c FROM OCE__WorkflowContextType__c WHERE OCE__Object__c = 'Account' AND OCE__Relationship__c = null AND OCE__isControlledByWorkflowPath__c = true`
    );
  });
});

  describe("fetchContextType", () => {
    it("should call queryWithSOQL function with the correct parameters", async () => {
      queryWithSOQL.mockResolvedValueOnce([]);
      await fetchContextType("Account");
      expect(queryWithSOQL).toHaveBeenCalledWith(
        `SELECT Id, OCE__Object__c, OCE__isControlledByWorkflowPath__c FROM OCE__WorkflowContextType__c WHERE OCE__Object__c = 'Account' AND OCE__Relationship__c = null AND OCE__isControlledByWorkflowPath__c = true`
      );
    });
  });
  
  describe("fetchWorkflowConfiguration", () => {
    it("should call queryWithSOQL function with the correct parameters", async () => {
      queryWithSOQL.mockResolvedValueOnce([]);
      await fetchContextType("Account");
      expect(queryWithSOQL).toHaveBeenCalledWith(
        `SELECT Id, OCE__Object__c, OCE__isControlledByWorkflowPath__c FROM OCE__WorkflowContextType__c WHERE OCE__Object__c = 'Account' AND OCE__Relationship__c = null AND OCE__isControlledByWorkflowPath__c = true`
      );
    });
  });
*/
