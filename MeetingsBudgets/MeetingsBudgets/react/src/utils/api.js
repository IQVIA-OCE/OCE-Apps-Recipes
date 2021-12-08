import { sfNetAPI } from '../../bridge/sf/sfnetapi';
import { databaseManager} from '../../bridge/Database/DatabaseManager.native';

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
        data => {
          resolve([data]);
        },
        e => {
          reject(e);
        }
      );
    }),
  create: (objectType = '', fields = {}) =>
    new Promise((resolve, reject) => {
      sfNetAPI.create(
        objectType,
        fields,
        data => {
          resolve([data]);
        },
        e => {
          reject(e);
        }
      );
    }),
  update: (objectType, id, fields) =>
    new Promise((resolve, reject) => {
      sfNetAPI.update(
        objectType,
        id,
        fields,
        data => {
          resolve([data]);
        },
        e => {
          reject(e);
        }
      );
    }),
  del: (objectType, id) =>
    new Promise((resolve, reject) => {
      sfNetAPI.del(
        objectType,
        id,
        data => {
          resolve([data]);
        },
        e => {
          reject(e);
        }
      );
    }),
  apexRest: (method, endPoint, namespace, params) =>
    new Promise((resolve, reject) => {
      sfNetAPI.apexRest(
        method,
        endPoint,
        namespace,
        params,
        data => {
          resolve([data]);
        },
        e => {
          reject(e);
        }
      );
    }),
};
