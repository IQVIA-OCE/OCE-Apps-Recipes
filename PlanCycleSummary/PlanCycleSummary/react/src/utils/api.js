import { databaseManager } from '@oce-apps/oce-apps-bridges';

export default {
  query: async (soql = '') =>
    databaseManager.fetch(soql).then((data) => {
      if (data && data.records) {
        const { records, ...metadata } = data;
        return [records, metadata];
      }

      return data;
    }),
};
