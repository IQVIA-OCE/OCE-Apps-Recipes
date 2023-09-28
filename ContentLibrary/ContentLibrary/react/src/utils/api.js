import { sfNetAPI } from 'oce-apps-bridges';

export default {
  query: async (soql = '') => {
    try {
      const data = await sfNetAPI.query(soql);

      if (data && data.records) {
        const { records, ...metadata } = data;
        return [records, metadata];
      } else {
        return data;
      }
    } catch (err) {
      throw err;
    }
  },
  describe: async (objectType = '') => {
    try {
      const data = await sfNetAPI.describe(objectType);

      return [data];
    } catch (err) {
      throw err;
    }
  },
  create: async (objectType = '', fields = {}) => {
    try {
      const data = await sfNetAPI.create(objectType, fields);

      return [data]
    } catch (err) {
      throw err;
    }
  },
  update: async (objectType, id, fields) => {
    try {
      const data = await sfNetAPI.update(objectType, id, fields);

      return [data];
    } catch (err) {
      throw err;
    }
  },
  del: async (objectType, id) => {
    try {
      const data = await sfNetAPI.del(objectType, id);

      return [data]
    } catch (err) {
      throw err;
    }
  },
  apexRest: async (method, endPoint, namespace, params) => {
    try {
      const data = await sfNetAPI.apexRest(method, endPoint, namespace, params);

      return [data];
    } catch (err) {
      throw err;
    }
  }
};
