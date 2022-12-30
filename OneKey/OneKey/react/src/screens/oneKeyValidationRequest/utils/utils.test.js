import { groupBy, mapCountries, mapPicklist, mapWorkplaceFormValues, mapActivityFormValues, mapWorkplaces } from './utils';


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

  it('mapCountries: should match countries with labels with no countryPicklistItem.label', () => {
    const parsed = mapCountries(
      { records: [{ QIDC__OK_Available_Countries_ims__c: 'US;FR' }] },
      [
        { defaultValue: false, active: true, value: 'US', validFor: null },
        { defaultValue: false, active: true, value: 'FR', validFor: null }
      ]);
    expect(parsed).toEqual([{ label: 'US', value: 'US' }, { label: 'FR', value: 'FR' }])
  });

  it('mapCountries: should match countries with labels with no countriesValues', () => {
    const parsed = mapCountries({ records: [] });
    expect(parsed).toEqual([])
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

  it('mapPicklist: should match Picklist with labels', () => {
    const parsed = mapPicklist();
    expect(parsed).toBeFalsy()
  });

  it('mapWorkplaces: should match Workplaces with labels', () => {
    const parsed = mapWorkplaces({
      records: [
        {
          Id: '1234',
          Name: 'Name 1'
        }, {
          Id: '123',
          Name: 'Name 2'
        }
      ]
    })
    expect(parsed).toEqual([{ label: 'Name 1', value: '1234' }, { label: 'Name 2', value: '123' }])
  });

  it('should call mapWorkplaceFormValues with speciality1 and regionCode', () => {
    const result = mapWorkplaceFormValues({
      entityType: 'Workplace',
      workplace: {
        telephone: '000000000000',
        activityLocationCode: '0000',
        usualName: 'Test',
        parentUsualName: 'Test',
        speciality1: 'speciality1',
      },
      address: {
        longLabel: 'Address',
        city: 'TEST',
        longPostalCode: '0000',
        countryCode: '0000',
        regionCode: 'regionCode'
      }
    }, '1');

    expect(result["workplace.speciality1"]).toEqual('speciality1');
    expect(result["address.regionCode"]).toEqual('regionCode');
  })

  it('should call mapWorkplaceFormValues without speciality1 and regionCode', () => {
    const result = mapWorkplaceFormValues({
      entityType: 'Workplace',
      workplace: {
        telephone: '000000000000',
        activityLocationCode: '0000',
        usualName: 'Test',
        parentUsualName: 'Test',
        speciality1: null,
      },
      address: {
        longLabel: 'Address',
        city: 'TEST',
        longPostalCode: '0000',
        countryCode: '0000',
        regionCode: null
      }
    }, '1');

    expect(result["workplace.speciality1"]).toEqual('');
    expect(result["address.regionCode"]).toEqual('');
  })

  it('should call mapActivityFormValues with speciality1 and regionCode', () => {
    const result = mapActivityFormValues({
      individual: {
        firstName: 'TEST',
        lastName: 'TEST',
        typeCode: 'TEST',
        speciality1: 'TEST',
      },
      activity: {
        activityEid: 'TEST',
        statusCode: '000',
        telephone: '0000000000',
        role: 'TEST',
      },
      entityType: 'Activity',
      workplace: {
        telephone: '000000000000',
        activityLocationCode: '0000',
        usualName: 'Test',
        parentUsualName: 'Test',
        speciality1: 'speciality1',
      },
      address: {
        longLabel: 'Address',
        city: 'TEST',
        longPostalCode: '0000',
        countryCode: '0000',
        regionCode: 'regionCode'
      }
    }, '1');

    expect(result["workplace.speciality1"]).toEqual('speciality1');
    expect(result["address.regionCode"]).toEqual('regionCode');
  })

  it('should call mapActivityFormValues without speciality1 and regionCode', () => {
    const result = mapActivityFormValues({
      individual: {
        firstName: 'TEST',
        lastName: 'TEST',
        typeCode: 'TEST',
      },
      activity: {
        activityEid: 'TEST',
      },
      entityType: 'Activity',
      workplace: {
        telephone: '000000000000',
      },
      address: {
        longLabel: 'Address',
        city: 'TEST',
        regionCode: null
      }
    }, '1');

    expect(result["workplace.speciality1"]).toEqual('');
    expect(result["address.regionCode"]).toEqual('');
  })
});
