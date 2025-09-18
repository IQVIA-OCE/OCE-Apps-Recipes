import api from '../utils/api';
import { changeLotStatus, fetchLots, fetchLotsOffset } from './ManageLots';

jest.unmock('./ManageLots');

const spy = jest.spyOn(api, 'query');

describe('ManageLots', () => {
  beforeEach(() => {
    spy.mockClear();
  });

  it('fetchLots', () => {
    // without params
    fetchLots();
    expect(spy).toHaveBeenCalledWith("SELECT Id, Name, CreatedDate, LastModifiedDate, OCE__IsActive__c, OCE__Lot__c, OCE__Lot__r.OCE__Product__c, OCE__Lot__r.OCE__Product__r.Name, OCE__LotExpirationDate__c, OCE__Lot__r.Name FROM OCE__SampleLotAllocation__c WHERE OCE__Lot__c != null AND OCE__IsActive__c = true ORDER BY OCE__LotExpirationDate__c Asc LIMIT 4");

    // with params
    fetchLots(8);
    expect(spy).toHaveBeenCalledWith("SELECT Id, Name, CreatedDate, LastModifiedDate, OCE__IsActive__c, OCE__Lot__c, OCE__Lot__r.OCE__Product__c, OCE__Lot__r.OCE__Product__r.Name, OCE__LotExpirationDate__c, OCE__Lot__r.Name FROM OCE__SampleLotAllocation__c WHERE OCE__Lot__c != null AND OCE__IsActive__c = true ORDER BY OCE__LotExpirationDate__c Asc LIMIT 8");
  });

  it('fetchLotsOffset', () => {
    // without params
    fetchLotsOffset();
    expect(spy).toHaveBeenCalledWith("SELECT Id, Name, CreatedDate, LastModifiedDate, OCE__IsActive__c, OCE__Lot__c, OCE__Lot__r.OCE__Product__c, OCE__Lot__r.OCE__Product__r.Name, OCE__LotExpirationDate__c, OCE__Lot__r.Name FROM OCE__SampleLotAllocation__c WHERE OCE__Lot__c != null  ORDER BY OCE__LotExpirationDate__c, Name Asc LIMIT undefined OFFSET 0");

    // with params
    fetchLotsOffset(1, 'Submitted', 5);
    expect(spy).toHaveBeenCalledWith("SELECT Id, Name, CreatedDate, LastModifiedDate, OCE__IsActive__c, OCE__Lot__c, OCE__Lot__r.OCE__Product__c, OCE__Lot__r.OCE__Product__r.Name, OCE__LotExpirationDate__c, OCE__Lot__r.Name FROM OCE__SampleLotAllocation__c WHERE OCE__Lot__c != null AND OCE__IsActive__c = true ORDER BY OCE__LotExpirationDate__c, Name Asc LIMIT 1 OFFSET 5");
  });

  it('changeLotStatus', () => {
    const spy = jest.spyOn(api, 'update');

    // without params
    changeLotStatus();
    expect(spy).toHaveBeenCalledWith("OCE__SampleLotAllocation__c", undefined, { 'OCE__IsActive__c': undefined });

    // with params
    changeLotStatus('Submitted', "a5dF7000000lvxxIAA");
    expect(spy).toHaveBeenCalledWith("OCE__SampleLotAllocation__c", "a5dF7000000lvxxIAA", { 'OCE__IsActive__c': 'Submitted' });
  });
});
