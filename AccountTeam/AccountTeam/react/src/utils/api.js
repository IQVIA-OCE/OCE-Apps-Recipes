import { sfNetAPI } from 'oce-apps-bridges';

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
  describe: async (objectType = '') =>
    new Promise((resolve, reject) => {
      sfNetAPI.describe(
        objectType,
        data => {
          resolve([data]);
        },
        e => {
          reject(e);
        }
      );
    })
};
