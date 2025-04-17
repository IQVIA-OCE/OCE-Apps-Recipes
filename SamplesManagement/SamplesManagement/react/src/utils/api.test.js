import api from './api';
import { sfNetAPI } from '@oce-apps/oce-apps-bridges';

jest.unmock('./api');

let spy = jest.fn();

describe('api utility', () => {
  beforeEach(() => {
    spy.mockClear();
  });

  describe('query', () => {
    beforeAll(() => {
      spy = jest.spyOn(sfNetAPI, 'query');
    });

    it('query should return value', () => {
      sfNetAPI.query.mockResolvedValueOnce({ records: [1, 2], page: 1 });

      expect(api.query('select id from Table')).resolves.toStrictEqual([[1, 2], { page: 1 }]);
      expect(spy).toHaveBeenCalledWith('select id from Table');
    });

    it('query should return empty value', () => {
      sfNetAPI.query.mockResolvedValueOnce(null);

      expect(api.query()).resolves.toStrictEqual(null);
      expect(spy).toHaveBeenCalledWith('');
    });

    it('query should return error', async () => {
      sfNetAPI.query.mockRejectedValueOnce(new Error('Error'));

      await expect(api.query('')).rejects.toThrow('Error');
      expect(spy).toHaveBeenCalledWith('');
    });
  });

  describe('describe', () => {
    beforeAll(() => {
      spy = jest.spyOn(sfNetAPI, 'describe');
    });

    it('describe should return value', () => {
      sfNetAPI.describe.mockResolvedValueOnce({objectType: 'Account'});
      expect(api.describe('Account')).resolves.toStrictEqual([{ objectType: 'Account' }]);
      expect(spy).toHaveBeenCalledWith('Account');
    });

    it('describe should return error', async () => {
      sfNetAPI.describe.mockRejectedValueOnce(new Error('Error'));

      await expect(api.describe()).rejects.toThrow('Error');
      expect(spy).toHaveBeenCalledWith('');
    });
  });

  describe('create', () => {
    beforeAll(() => {
      spy = jest.spyOn(sfNetAPI, 'create');
    });

    it('create should return value', () => {
      const fields = {
        Name: 'Account_name',
        Age__c: 30
      }
      sfNetAPI.create.mockResolvedValueOnce({objectType: 'Account'});

      expect(api.create('Account', fields)).resolves.toStrictEqual([{ objectType: 'Account' }]);
      expect(spy).toHaveBeenCalledWith('Account', fields);
    });

    it('create should return error', async () => {
      sfNetAPI.create.mockRejectedValueOnce(new Error('Error'));

      await expect(api.create()).rejects.toThrow('Error');
      expect(spy).toHaveBeenCalledWith('', {});
    });
  });

  describe('update', () => {
    beforeAll(() => {
      spy = jest.spyOn(sfNetAPI, 'update');
    });

    it('update should return value', () => {
      const fields = {
        Name: 'Account_name',
        Age__c: 30
      };
      sfNetAPI.update.mockResolvedValueOnce({objectType: 'Account'});

      expect(api.update('Account', "0050k000004CineAAC", fields)).resolves.toStrictEqual([{ objectType: 'Account' }]);
      expect(spy).toHaveBeenCalledWith('Account', "0050k000004CineAAC", fields);
    });

    it('update should return error', async () => {
      sfNetAPI.update.mockRejectedValueOnce(new Error('Error'));

      await expect(api.update()).rejects.toThrow('Error');
      expect(spy).toHaveBeenCalledWith(undefined, undefined, undefined);
    });
  });

  describe('del', () => {
    beforeAll(() => {
      spy = jest.spyOn(sfNetAPI, 'del');
    });

    it('del should return value', () => {
      sfNetAPI.del.mockResolvedValueOnce({objectType: 'Account'});

      expect(api.del('Account', "0050k000004CineAAC")).resolves.toStrictEqual([{ objectType: 'Account' }]);
      expect(spy).toHaveBeenCalledWith('Account', "0050k000004CineAAC");
    });

    it('del should return error', async () => {
      sfNetAPI.del.mockRejectedValueOnce(new Error('Error'));

      await expect(api.del()).rejects.toThrow('Error');
      expect(spy).toHaveBeenCalledWith(undefined, undefined);
    });
  });

  describe('apexRest', () => {
    beforeAll(() => {
      spy = jest.spyOn(sfNetAPI, 'apexRest');
    });

    it('del should return value', () => {
      const payload = {
        Name: 'Account_name',
        Age__c: 30
      };
      sfNetAPI.apexRest.mockResolvedValueOnce({objectType: 'Account'});

      expect(api.apexRest('POST', 'sampleinventorysave', 'OCE', payload)).resolves.toStrictEqual([{ objectType: 'Account' }]);
      expect(spy).toHaveBeenCalledWith('post', 'sampleinventorysave', 'OCE', payload);
    });

    it('apexRest should return error', async () => {
      sfNetAPI.apexRest.mockRejectedValueOnce(new Error('Error'));

      await expect(api.apexRest('')).rejects.toThrow('Error');
      expect(spy).toHaveBeenCalledWith('', undefined, undefined, undefined);
    });
  });
});
