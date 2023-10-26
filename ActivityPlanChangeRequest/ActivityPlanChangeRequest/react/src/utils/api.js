import { sfNetAPI } from 'oce-apps-bridges';

export default {
  query: (soql = '') =>
    sfNetAPI.query(soql).then((data) => {
      if (data && data.records) {
        const { records, ...metadata } = data;
        return [records, metadata];
      } else {
        return data;
      }
    }),
  describe: (objectType = '') =>
    sfNetAPI.describe(objectType).then((data) => [data]),
  create: (objectType = '', fields = {}) =>
    sfNetAPI.create(objectType, fields).then((data) => [data]),
  update: (objectType, id, fields) =>
    sfNetAPI.update(objectType, id, fields).then((data) => [data]),
  del: (objectType, id) => sfNetAPI.del(objectType, id).then((data) => [data]),
  apexRest: (method, endPoint, namespace, params) =>
    sfNetAPI
      .apexRest(method, endPoint, namespace, params)
      .then((data) => [data]),
};
