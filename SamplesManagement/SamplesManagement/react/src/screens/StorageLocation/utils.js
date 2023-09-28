import { base64toBitIndex, normalizer } from '../../utils/utils';
import moment from 'moment';

export const normalizeStates = data => {
  let countries = [],
    states = [];

  if (data && !data.fields) return countries;
  data.fields.map(el => {
    if (el.name === 'OCE__Country__c') countries = el.picklistValues;
    if (el.name === 'OCE__State__c') states = el.picklistValues;
  });

  if (!countries.length || !states.length) return countries;

  countries.map(country => {
    country.id = country.value;
    return country;
  });

  states.map(state => {
    if (!state.validFor) return;

    const validIndexes = base64toBitIndex(state.validFor);

    validIndexes.map(index => {
      const country = countries[index];
      if (!country.states) {
        country.states = [];
      }
      state.id = state.value;
      country.states.push(state);
    });
  });

  return countries;
};

const locationKeys = {
  Id: 'id',
  Name: 'address1',
  OCE__AddressLine2__c: 'address2',
  OCE__City__c: 'city',
  OCE__Country__c: 'country',
  OCE__State__c: 'state',
  OCE__IsDefaultStorageLocation__c: 'default',
  OCE__ZipCode__c: 'zip',
  CreatedDate: 'createdDate',
  LastModifiedDate: 'modifiedDate',
  CreatedById: 'createdById',
  LastModifiedById: 'modifiedById',
};

export const normalizeLocation = data => {
  const normalized = normalizer(locationKeys)(data);
  normalized.map(item => {
    item.createdDate = moment(item.createdDate).format('D/M/YYYY h:mm a');
    item.modifiedDate = moment(item.modifiedDate).format('D/M/YYYY h:mm a');
    return item;
  });
  return normalized;
};

export const normalizeUsers = (data) => {
  return data.reduce((acc, item) => {
    acc[item.Id] = item.Name;
    return acc;
  }, {});
};
