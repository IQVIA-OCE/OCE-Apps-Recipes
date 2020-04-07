import { groupBy, mapCountries, mapPicklist } from './utils';


describe('utils', () => {
  it('groupBy: should parse array to obj grouped by certain key', () => {
    const obj1 = {
      Id: '1',
      Name: 'COV',
      QIDC__LIS_Code_ims__c: 'TET',
      QIDC__Label_ims__c: 'Board of Veterinarians',
    };
    const obj2 = {
      Id: '1',
      Name: 'COV',
      QIDC__LIS_Code_ims__c: 'SP',
      QIDC__Label_ims__c: 'Board of Veterinarians',
    };
    const parsed = groupBy('QIDC__LIS_Code_ims__c')([obj1, obj2]);

    expect(parsed).toEqual({ TET: [obj1], SP: [obj2] })
  });

  it('mapCountries: should match countries with labels', () => {
    const parsed = mapCountries(
      { records: [{ QIDC__OK_Available_Countries_ims__c: 'US;FR' }] },
      [
        { defaultValue: false, label: 'UNITED STATES', active: true, value: 'US', validFor: null },
        { defaultValue: false, label: 'FRANCE', active: true, value: 'FR', validFor: null }
      ]);
    expect(parsed).toEqual([{ label: 'UNITED STATES', value: 'US' }, { label: 'FRANCE', value: 'FR' }])
  });

  it('mapPicklist: should match Picklist with labels', () => {
    const parsed = mapPicklist([{
      Name: '79',
      QIDC__Label_ims__c: 'Non-health Delivery'
    }, {
      Name: '74',
      QIDC__Label_ims__c: 'Manufacturer'
    }]);
    expect(parsed).toEqual([{ label: 'Non-health Delivery', value: '79' }, { label: 'Manufacturer', value: '74' }])
  });

  it('mapWorkplaces: should match Workplaces with labels', () => {
    const parsed = mapPicklist([{
      Name: '79',
      QIDC__Label_ims__c: 'Non-health Delivery'
    }, {
      Name: '74',
      QIDC__Label_ims__c: 'Manufacturer'
    }]);
    expect(parsed).toEqual([{ label: 'Non-health Delivery', value: '79' }, { label: 'Manufacturer', value: '74' }])
  });
});
