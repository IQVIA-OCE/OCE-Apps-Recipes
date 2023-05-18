import { dataUpdatesBridge } from 'oce-apps-bridges';
import { ENTITY } from '../constants';
import { INQUIRIES_QUERY, ORDERS_QUERY, STORE_CHECK_QUERY } from './callApi';
import { CALLS_QUERY } from './meetingApi';

const QUERIES = {
  [ENTITY.ORDER]: ORDERS_QUERY,
  [ENTITY.INQUIRY]: INQUIRIES_QUERY,
  [ENTITY.STORE_CHECK]: STORE_CHECK_QUERY,
  [ENTITY.CALL]: CALLS_QUERY,
};

export const startObservingDB = async (entities, callback, callbackError) => {
  try {
    const listener = await dataUpdatesBridge.addDataChangesForSoqlListener(
      (soql) => {
        const entity = Object.keys(QUERIES).find(
          (key) => QUERIES[key] === soql
        );
        callback(entity);
      }
    );

    for (let entity of entities) {
      await dataUpdatesBridge.startObservingDataChangeForSoql(QUERIES[entity]);
    }

    return listener;
  } catch (error) {
    callbackError(error);
  }
};

export const stopObservingDB = async (entities, listener, callbackError) => {
  try {
    for (let entity of entities) {
      await dataUpdatesBridge.stopObservingDataChangeForSoql(QUERIES[entity]);
    }

    await dataUpdatesBridge.removeDataChangesForSoqlListener(listener);
  } catch (error) {
    callbackError(error);
  }
};
