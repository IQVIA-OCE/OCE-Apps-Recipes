import { sfNetAPI } from '@oce-apps/oce-apps-bridges';

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
    describe: (objectType) =>
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
    describeLayout: (objtype, recordTypeId) =>
        new Promise((resolve, reject) => {
            sfNetAPI.describeLayout(
                objtype,
                recordTypeId,
                data => {
                    resolve([data]);
                },
                e => {
                    reject(e);
                }
            );
        }),

    retrieve: (objtype, param) =>
        new Promise((resolve, reject) => {
            sfNetAPI.retrieve(
                objtype,
                param,
                null,
                data => {
                    resolve([data]);
                },
                e => {
                    reject(e);
                }
            );
        }),
};
