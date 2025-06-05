import api from '../utils/api';
import { fetchUser } from './AppContext';

jest.unmock('./AppContext');

describe('AppContext', () => {
  it('fetchUser', () => {
    const spy = jest.spyOn(api, 'query');
    fetchUser('0050k000004CineAAC');
    expect(spy).toHaveBeenCalledWith("SELECT Id, Name, OCE__ProfileId__c FROM User WHERE Id = '0050k000004CineAAC'");
  });
});
