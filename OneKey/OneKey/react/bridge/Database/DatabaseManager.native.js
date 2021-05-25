/*
* @Author: Oleg Gnidets
* @Date:   2019-05-20
* @Email:  oleg.oleksan@gmail.com
* 
* @flow
*/

"use strict";

import { NativeModules } from "react-native";

export interface DatabaseManagable {
    fetch(sql: string): Promise<Object>,
}

const NativeDBManager = NativeModules.DatabaseManager;

class DatabaseManager implements DatabaseManagable {
    fetch(sql: string): Promise<Object> {
        return NativeDBManager.fetch(sql);
    }
}

export const databaseManager = new DatabaseManager();
