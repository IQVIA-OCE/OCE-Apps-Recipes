// @flow

import { NativeModules } from 'react-native';

export interface DatabaseManagable {
  fetch(sql: string): Promise<Object>;
  upsert(entities: Array<Object>): Promise<Object>;
}

const NativeDBManager = NativeModules.DatabaseManager;

class DatabaseManager implements DatabaseManagable {
  fetch(sql: string): Promise<Object> {
    return NativeDBManager.fetch(sql);
  }

  upsert(entities: Array<Object>): Promise<Object> {
    try {
      return NativeDBManager.upsert(entities);
    } catch (error) {
      return new Promise((resolve, reject) => {
        reject(error);
      });
    }
  }

  delete(ids: Array<String>): Promise<Object> {
    try {
      return NativeDBManager.delete(ids);
    } catch (error) {
      return new Promise((resolve, reject) => {
        reject(error);
      });
    }
  }
}

export const databaseManager: DatabaseManagable = new DatabaseManager();
