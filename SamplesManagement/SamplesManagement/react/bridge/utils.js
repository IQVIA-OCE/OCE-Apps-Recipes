/*
* @Author: Oleg Gnidets
* @Date:   2019-05-14
* @Email:  oleg.oleksan@gmail.com
*
* @flow
*/

"use strict";

import { Platform } from "react-native";

export const isIOS = Platform.OS === "ios";
export const isAndroid = Platform.OS === "android";

export const forceExec = (
    moduleIOS: Object,
    moduleAndroid: Object,
    methodName: string,
    args: Array<mixed>,
) => {
    if (isIOS) {
        return moduleIOS[methodName](...args);
    } else if (isAndroid) {
        return moduleAndroid[methodName](...args);
    }
};
