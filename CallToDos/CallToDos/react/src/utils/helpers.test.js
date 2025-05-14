import { formatDate, userId, queryWithSOQL } from './helpers';
import { environment, databaseManager } from '@oce-apps/oce-apps-bridges';

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

describe('formatDate', () => {
  it("should format empty date as datetime", () => {

    const result = formatDate('2021-05-12T19:00:00.000Z'); // 2019-10-30T00:00Z0 (GMT)
    expect(result).toBe('5/12/2021');
  });

  it("should return empty field", () => {

    const result = formatDate('2021-6368879202.000Z');
    expect(result).toBeNull();
  });
});

describe('userId', () => {
  it('userId should return the user Id', () => {
    const user = 'User_Z1';
    const spy = jest.spyOn(environment, "userId").mockImplementationOnce(() => Promise.resolve('User_Z1'));
    const myUser = userId();
    expect(spy).toHaveBeenCalled();
  });
});

describe('queryWithSOQL', () => {
  beforeAll(() => {
    jest.mock('./helpers', () => ({
      queryWithSOQL: jest.fn(),
    }));
    databaseManager.fetch = jest
      .fn()
      .mockResolvedValue({ records: [
        { id: 1, name: 'record 1' },
        { id: 2, name: 'record 2' },
      ], done: true });
  })
  it("queryWithSOQL with queryLocator", async () => {
    const records = [
      { id: 1, name: 'record 1' },
      { id: 2, name: 'record 2' },
    ];
    const spy = jest.spyOn(databaseManager, "fetch").mockImplementationOnce(() => Promise.resolve({ 
      records, queryLocator: '123' 
    }));
    const data = await queryWithSOQL('SELECT Id, Name FROM Object__c', '123');
    expect(spy).toHaveBeenCalled();
  });
});