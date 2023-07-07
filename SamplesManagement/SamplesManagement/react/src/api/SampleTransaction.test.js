import api from '../utils/api';
import {
  fetchAllUsers,
  fetchSampleProducts,
  fetchTransactionRecordTypes,
  fetchUserLocations,
  fetchUserTerritory,
  saveFormDetails,
  saveTransactionProduct,
  saveTransferInDetails,
} from './SampleTransaction';
import {
  mapFormDetails,
  mapFormProducts,
} from '../screens/TransactionScreen/utils';

jest.mock('../screens/TransactionScreen/utils');
jest.mock('moment', () => () => ({ format: () => 'May 3, 2020 06:19 pm' }));

describe('SampleTransaction', () => {
  beforeAll(() => {
    mapFormDetails.mockReturnValue('');
    mapFormProducts.mockReturnValue('');
  });

  it('fetchTransactionRecordTypes', () => {
    const spy = jest.spyOn(api, 'query').mockImplementation();
    fetchTransactionRecordTypes();
    expect(spy).toHaveBeenCalled();
  });

  it('fetchSampleProducts: TransferOut', () => {
    const spy = jest.spyOn(api, 'query').mockImplementation();
    fetchSampleProducts('TransferOut');
    expect(spy).toHaveBeenCalled();
  });

  it('fetchSampleProducts: Adjustment', () => {
    const spy = jest.spyOn(api, 'query').mockImplementation();
    fetchSampleProducts('Adjustment');
    expect(spy).toHaveBeenCalled();
  });
  it('fetchSampleProducts: Return', () => {
    const spy = jest.spyOn(api, 'query').mockImplementation();
    fetchSampleProducts('Return');
    expect(spy).toHaveBeenCalled();
  });
  it('fetchSampleProducts', () => {
    const spy = jest.spyOn(api, 'query').mockImplementation();
    fetchSampleProducts();
    expect(spy).toHaveBeenCalled();
  });

  it('fetchAllUsers', () => {
    const spy = jest.spyOn(api, 'query').mockImplementation();
    fetchAllUsers();
    expect(spy).toHaveBeenCalled();
  });

  it('fetchUserLocations', async () => {
    const spy = jest.spyOn(api, 'query').mockImplementation();
    fetchUserLocations('1');
    expect(spy).toHaveBeenCalled();

    const data = await fetchUserLocations();

    expect(data).toStrictEqual([]);
  });

  it('fetchUserTerritory', async () => {
    const spy = jest.spyOn(api, 'query').mockImplementation();
    fetchUserTerritory('1');
    expect(spy).toHaveBeenCalled();

    const data = await fetchUserTerritory();

    expect(data).toStrictEqual([]);
  });

  it('saveFormDetails', () => {
    const spy = jest.spyOn(api, 'create').mockImplementation();
    saveFormDetails({Id: 1}, 'save');
    expect(spy).toHaveBeenCalled();

    const fields = { OCE__Status__c: 'Submitted' };
    saveFormDetails({Id: 1}, 'submit');
    expect(fields.OCE__Status__c).toBe('Submitted');
  });

  it('saveFormDetails with id', () => {
    const spy = jest.spyOn(api, 'create').mockImplementation();
    saveFormDetails({Id: 1}, 'save', 'id');
    expect(spy).toHaveBeenCalled();

    const fields = { OCE__Status__c: 'Submitted' };
    saveFormDetails({Id: 1}, 'submit', 'id');
    expect(fields.OCE__Status__c).toBe('Submitted');
  });

  it('saveTransferInDetails', () => {
    const spy = jest.spyOn(api, 'create').mockImplementation();
    saveTransferInDetails({ value: '1' });
    expect(spy).toHaveBeenCalled();
  });

  it('saveTransactionProduct', () => {
    const spy = jest.spyOn(api, 'create').mockImplementation();
    saveTransactionProduct({ Id: '1' });
    expect(spy).toHaveBeenCalled();
  });

  it('saveTransactionProduct with id', () => {
    const spy = jest.spyOn(api, 'create').mockImplementation();
    saveTransactionProduct({ Id: '1' }, 'id');
    expect(spy).toHaveBeenCalled();
  });
});
