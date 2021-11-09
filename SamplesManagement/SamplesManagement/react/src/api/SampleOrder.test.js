import api from '../utils/api';
import {
  fetchOrgId,
  fetchProductTerritoryAllocationRecords,
  fetchSampleOrderConfig,
  fetchSampleProducts,
  fetchUserLocations,
  fetchUserProfile,
  saveSampleOrder,
  saveSampleOrderProduct,
  updateFormDetailsStatus,
} from './SampleOrder';

describe('SampleOrder', () => {
  it('fetchUserLocations', () => {
    const spy = jest.spyOn(api, 'query').mockImplementation();
    fetchUserLocations();
    expect(spy).toHaveBeenCalled();
  });

  it('fetchSampleProducts', () => {
    const spy = jest.spyOn(api, 'query').mockImplementation();
    fetchSampleProducts();
    expect(spy).toHaveBeenCalled();
  });

  it('fetchSampleOrderConfig', () => {
    const spy = jest.spyOn(api, 'query').mockImplementation();
    fetchSampleOrderConfig();
    expect(spy).toHaveBeenCalled();
  });

  it('fetchUserProfile', () => {
    const spy = jest.spyOn(api, 'query').mockImplementation();
    fetchUserProfile();
    expect(spy).toHaveBeenCalled();
  });

  it('fetchOrgId', () => {
    const spy = jest.spyOn(api, 'query').mockImplementation();
    fetchOrgId();
    expect(spy).toHaveBeenCalled();
  });

  it('fetchProductTerritoryAllocationRecords', () => {
    const spy = jest.spyOn(api, 'query').mockImplementation();
    fetchProductTerritoryAllocationRecords();
    expect(spy).toHaveBeenCalled();
  });

  it('saveSampleOrder', () => {
    const spy = jest.spyOn(api, 'create').mockImplementation();
    saveSampleOrder({
      fields: {
        status: 'status',
        user: { Id: '1' },
        territory: {},
        shipTo: {},
      },
    });
    expect(spy).toHaveBeenCalled();
  });

  it('updateFormDetailsStatus', () => {
    const spy = jest.spyOn(api, 'update').mockImplementation();
    updateFormDetailsStatus('1', { fields: { user: {}, territory: {} } });
    expect(spy).toHaveBeenCalled();
  });

  it('saveSampleOrderProduct', () => {
    const spy = jest.spyOn(api, 'create').mockImplementation();
    saveSampleOrderProduct({ quantity: '', comments: '' }, '1');
    expect(spy).toHaveBeenCalled();
  });
});
