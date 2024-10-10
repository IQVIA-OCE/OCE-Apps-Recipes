import { databaseManager } from '@oce-apps/oce-apps-bridges';
import {
  CALL_ATTENDEES_ORIG_DATA,
  CALL_MAPPED_DATA,
  CALL_ORIG_DATA,
  INQUIRIES_ORIG_DATA,
  INQUIRY_TO_SAVE,
  ORDERS_ORIG_DATA,
  STORE_CHECK_ORIG_DATA,
} from '../mocks/callTestData';
import * as callApi from './callApi';

describe('callApi', () => {
  beforeEach(() => {
    databaseManager.fetch.mockReset();
    databaseManager.fetchWithParams.mockReset();
    databaseManager.upsert.mockReset();
  });

  test('fetchCall() should return data', async () => {
    databaseManager.fetch.mockResolvedValueOnce(CALL_ORIG_DATA);

    const response = await callApi.fetchCall(CALL_MAPPED_DATA.id);

    expect(databaseManager.fetch).toHaveBeenCalled();
    expect(response).toStrictEqual(CALL_ORIG_DATA);
  });

  test('fetchCallAttendees() should return data', async () => {
    databaseManager.fetchWithParams.mockResolvedValueOnce(
      CALL_ATTENDEES_ORIG_DATA
    );

    const response = await callApi.fetchCallAttendees(CALL_MAPPED_DATA.id);

    expect(databaseManager.fetchWithParams).toHaveBeenCalled();
    expect(response).toStrictEqual(CALL_ATTENDEES_ORIG_DATA);
  });

  test('checkIfUserIsOwnerOfCall() should return data', async () => {
    const responseMock = { total: 1 };

    databaseManager.fetch.mockResolvedValueOnce(responseMock);

    const response = await callApi.checkIfUserIsOwnerOfCall(
      CALL_MAPPED_DATA.id,
      1
    );

    expect(databaseManager.fetch).toHaveBeenCalled();
    expect(response).toStrictEqual(responseMock);
  });

  test('fetchOrders() should return data', async () => {
    databaseManager.fetchWithParams.mockResolvedValueOnce(ORDERS_ORIG_DATA);

    const response = await callApi.fetchOrders(CALL_MAPPED_DATA.id);

    expect(databaseManager.fetchWithParams).toHaveBeenCalled();
    expect(response).toStrictEqual(ORDERS_ORIG_DATA);
  });

  test('fetchInquiries() should return data', async () => {
    databaseManager.fetchWithParams.mockResolvedValueOnce(INQUIRIES_ORIG_DATA);

    const response = await callApi.fetchInquiries(CALL_MAPPED_DATA.id);

    expect(databaseManager.fetchWithParams).toHaveBeenCalled();
    expect(response).toStrictEqual(INQUIRIES_ORIG_DATA);
  });

  test('fetchStoreCheck() should return data', async () => {
    databaseManager.fetchWithParams.mockResolvedValueOnce(
      STORE_CHECK_ORIG_DATA
    );

    const response = await callApi.fetchStoreCheck(CALL_MAPPED_DATA.id);

    expect(databaseManager.fetchWithParams).toHaveBeenCalled();
    expect(response).toStrictEqual(STORE_CHECK_ORIG_DATA);
  });

  test('createNewInquiry() should return data', async () => {
    databaseManager.upsert.mockResolvedValueOnce('1');

    const response = await callApi.createNewInquiry(INQUIRY_TO_SAVE);

    expect(databaseManager.upsert).toHaveBeenCalled();
    expect(databaseManager.upsert).toHaveBeenCalledWith([
      {
        ...INQUIRY_TO_SAVE,
        sObject: 'Inquiry__c',
      },
    ]);
    expect(response).toEqual('1');
  });
});
