/*
* @Author: Oleg Gnidets
* @Date:   2019-05-03
* @Email:  oleg.oleksan@gmail.com
*
* @flow
*/

"use strict";

import { NativeEventEmitter, NativeModules } from "react-native";

const BridgeEnvData = NativeModules.EnvironmentDataBridge;

class EnvironmentData {

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
                () => this.getEnvironmentData()
            );

            this.getEnvironmentData()

        } catch(error) {
            //it's ok. We are on version 7.x
        }

    }

    getEnvironmentData() {
        BridgeEnvData.getEnvironmentData().then(function(environmentData) {
            this.data = environmentData
        }.bind(this))
    }

    namespace(): string {
        return this.data ? this.data.namespace : BridgeEnvData.namespace;
    }

    userID(): string {
        return this.data ? this.data.userID : BridgeEnvData.userID;
    }

    timeZone(): string {
        return this.data ? this.data.timeZone : BridgeEnvData.timeZone;
    }

    locale(): string {
        return this.data ? this.data.locale : BridgeEnvData.locale;
    }

    language(): string {
        return this.data ? this.data.language : BridgeEnvData.language;
    }

    currencyISOCode(): string {
        return this.data ? this.data.currencyISOCode : BridgeEnvData.currencyISOCode;
    }

    sfInstanceURL(): string {
        return this.data ? this.data.sfInstanceURL : BridgeEnvData.sfInstanceURL;
    }

    sfApiVersion(): string {
        return this.data ? this.data.sfApiVersion : BridgeEnvData.sfApiVersion;
    }

    territory() {
        return this.data ? this.data.territory : BridgeEnvData.territory;
    }
}

export const environment = new EnvironmentData();
