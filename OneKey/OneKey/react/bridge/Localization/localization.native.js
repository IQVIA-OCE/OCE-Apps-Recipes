/*
* @Author: Oleg Gnidets
* @Date:   2019-04-25
* @Email:  oleg.oleksan@gmail.com
*
* @flow
*/

"use strict";

import { NativeModules } from "react-native";

const LocalizationBridge = NativeModules.LocalizationBridge;

function allLocalizationKeys(): Array<string> {
    let items = [];

    for (const key in LocalizationBridge) {
        items.push(key);
    }

    return items;
}

function localized(key: string, defaultValue: string): string {
    const formattedKey = key.toLowerCase();

    if (key in LocalizationBridge) {
        return LocalizationBridge[key];
    }

    const namespace = NativeModules.EnvironmentDataBridge.namespace;
    const keyWithNamespace = namespace + formattedKey;

    if (keyWithNamespace in LocalizationBridge) {
        return LocalizationBridge[keyWithNamespace];
    }

    const keyWithLowercaseNamespace = namespace.toLowerCase() + formattedKey;

    if (keyWithLowercaseNamespace in LocalizationBridge) {
        return LocalizationBridge[keyWithLowercaseNamespace];
    }

    return defaultValue;
}

export { allLocalizationKeys, localized };
