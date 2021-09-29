/*
* @Author: Oleg Gnidets
* @Date:   2019-04-25
* @Email:  oleg.oleksan@gmail.com
*
* @flow
*/

"use strict";

import { NativeEventEmitter, NativeModules } from "react-native";
import { environment } from "../EnvironmentData/EnvironmentData";


class LocalizationData {

    metadataBridgeEmitter = undefined
    data = undefined

    constructor() {

        try {

            if (!this.metadataBridgeEmitter) {
                this.metadataBridgeEmitter = new NativeEventEmitter(NativeModules.MetadataUpdatesBridge);
            }

            const listener = this.metadataBridgeEmitter.addListener(
                //event name
                'MetadataChangedEvent',
                () => this.getLocalizationData()
            );

            this.getLocalizationData()

        } catch(error) {
            //it's ok. We are on version 7.x
        }

    }

    getLocalizationData() {
        NativeModules.LocalizationBridge.getLocalizationData().then(function(localizationData) {
            this.data = localizationData
        }.bind(this))
    }

}


const localizationData = new LocalizationData();

function allLocalizationKeys(): Array<string> {
    var dataObject = NativeModules.LocalizationBridge
    if (localizationData.data) {
        dataObject = localizationData.data
    }
    let keys = [];

    for (const key in dataObject) {
        keys.push(key);
    }

    return keys;
}

function localized(key: string, defaultValue: string): string {
    var dataObject = NativeModules.LocalizationBridge
    if (localizationData.data) {
        dataObject = localizationData.data
    }

    const formattedKey = key.toLowerCase();

    if (key in dataObject) {
        return dataObject[key];
    }

    const namespace = environment.namespace();
    const keyWithNamespace = namespace + formattedKey;

    if (keyWithNamespace in dataObject) {
        return dataObject[keyWithNamespace];
    }

    const keyWithLowercaseNamespace = namespace.toLowerCase() + formattedKey;

    if (keyWithLowercaseNamespace in dataObject) {
        return dataObject[keyWithLowercaseNamespace];
    }

    return defaultValue;
}

export { allLocalizationKeys, localized };
