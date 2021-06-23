/*
* @Author: Oleg Gnidets
* @Date:   2019-05-21
* @Email:  oleg.oleksan@gmail.com
* 
* @flow
*/

"use strict";

import { NativeModules } from "react-native";

interface LogACallManagable {
    showForm(userID: string): Promise<Object>,
}

const NativeLogManager = NativeModules.LogACallManager;

export class LogACallManager implements LogACallManagable {
    showForm(userID: string): Promise<Object> {
        return NativeLogManager.showLogACallForm(userID);
    }
}
