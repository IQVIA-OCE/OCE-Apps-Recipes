import { queryWithSOQL } from './helpers';
import { databaseManager } from '@oce-apps/oce-apps-bridges';

jest.mock('@oce-apps/oce-apps-bridges', () => ({
  databaseManager: {
      upsert: jest.fn(),
      fetch: jest.fn(),
      delete: jest.fn(),
  }
}));

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