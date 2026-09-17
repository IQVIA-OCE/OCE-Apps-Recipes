import api from '../utils/api';
import * as productApi from './productApi';
import {
  FETCH_PRODUCTS_RESPONSE,
  FETCH_MEETING_PRODUCT,
} from '../constants/testData';
import { databaseManager } from '@oce-apps/oce-apps-bridges';

jest.mock('../utils/api');

describe('productApi', () => {
  it('fetchTopicsProducts should return error', async () => {
    api.queryOffline.mockImplementation(() => {
      throw 'Test error';
    });

    await expect(() => {
      productApi.fetchTopicsProducts('test_error');
    }).toThrow('Test error');
  });

  it('fetchTopicsProducts', async () => {
    api.queryOffline.mockResolvedValue(FETCH_PRODUCTS_RESPONSE);

    const response = await productApi.fetchTopicsProducts('a5T6g0000009JFDEA2');
    expect(api.queryOffline).toHaveBeenCalled();
    expect(response).toStrictEqual(FETCH_PRODUCTS_RESPONSE);
  });

  it('createMeetingProducts', async () => {
    const products = [ { Id: '1' } ];
    await productApi.createMeetingProducts(products);

    expect(databaseManager.upsert).toHaveBeenCalledWith([
      {
        Id: '1',
        sobject: 'OCE__MeetingProduct__c',
      },
    ]);
  });

  it('createMeetingProducts should return error', async () => {
    databaseManager.upsert.mockImplementation(() => {
      throw 'Test error';
    });

    await expect(() => {
      productApi.createMeetingProducts([ { Id: '1' } ]);
    }).toThrow('Test error');
  });

  it('deleteMeetingProducts', async () => {
    const ids = ['1'];
    await productApi.deleteMeetingProducts(ids);

    expect(databaseManager.delete).toHaveBeenCalledWith(ids);
  });

  it('fetchMeetingProduct should return error', async () => {
    api.queryOffline.mockImplementation(() => {
      throw 'Test error';
    });

    await expect(() => {
      productApi.fetchMeetingProduct('test', 'error');
    }).toThrow('Test error');
  });

  it('fetchMeetingProduct', async () => {
    api.queryOffline.mockResolvedValue(FETCH_MEETING_PRODUCT);

    const response = await productApi.fetchMeetingProduct('test', 'success');
    expect(api.queryOffline).toHaveBeenCalled();
    expect(response).toStrictEqual(FETCH_MEETING_PRODUCT);
  });
});
