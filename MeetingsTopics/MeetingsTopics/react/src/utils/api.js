import { sfNetAPI, databaseManager } from 'oce-apps-bridges';

export default {
  query: async (soql = '') =>
    new Promise((resolve, reject) => {
      sfNetAPI.query(
        soql,
        data => {
          if (data && data.records) {
            const { records, ...metadata } = data;
            resolve([records, metadata]);
          } else {
            resolve(data);
          }
        },
        e => {
          reject(e);
        }
      );
    }),
  queryOffline: async (soql = '') =>
    databaseManager.fetch(soql).then(data => {
      if (data && data.records) {
        const { records, ...metadata } = data;
        return [records, metadata];
      }

      return data;
    }),
  describe: async (objectType = '') =>
    new Promise((resolve, reject) => {
      sfNetAPI.describe(
        objectType,
        (data) => {
          resolve([data]);
        },
        (e) => {
          reject(e);
        }
      );
    }),
  create: (objectType = '', fields = {}) =>
    new Promise((resolve, reject) => {
      sfNetAPI.create(
        objectType,
        fields,
        (data) => {
          resolve([data]);
        },
        (e) => {
          reject(e);
        }
      );
    }),
};
