/*
* @Author: Maksym Kondakov
* @Date:   2020-03-05
* @Email:  maksym.kondakov@avenga.com
*
* @flow
*/

"use strict";

import { NativeEventEmitter, NativeModules } from "react-native";

class DataUpdatesBridge {

    dataBridgeEmitter = undefined

    addDataChangesForSoqlListener(callback: function): Promise<Object> {

        try {

            if (!this.dataBridgeEmitter) {
                this.dataBridgeEmitter = new NativeEventEmitter(NativeModules.DataUpdatesBridge);
            }

            const listener = this.dataBridgeEmitter.addListener(
                //event name
                'DataChangedForSoqlEvent',
                (body) => callback(body.soql)
            );
            return new Promise((resolve, reject) => {
                resolve(listener);
            })


        } catch(error) {
          return new Promise((resolve, reject) => {
                reject(error);
            })
        }
    }

    removeDataChangesForSoqlListener(listener): Promise<Object> {

        try {
                //workaround
                //listener.remove() does not handled properly with try-catch because it falls in native code
                const subscriptionsForType = listener.subscriber._subscriptionsForType[listener.eventType];
                if (subscriptionsForType) {
                    if (subscriptionsForType[listener.key]) {
                        listener.remove()
                    } else {
                        throw "Listener already removed"
                    }
                } else {
                    throw "There are no subscriptions for event " + listener.eventType
                }


            return new Promise((resolve, reject) => {
                resolve(true);
            })
        } catch(error) {
            return new Promise((resolve, reject) => {
                reject(error);
            })
        }
    }

    startObservingDataChangeForSoql(soql: string): Promise<Object> {

        try {
          return NativeModules.DataUpdatesBridge.startObservingDataChangeForSoql(soql);
        }
        catch(error) {
          return new Promise((resolve, reject) => {
                reject(error);
            })
        }


    }

    stopObservingDataChangeForSoql(soql: string): Promise<Object> {

        try {
          return NativeModules.DataUpdatesBridge.stopObservingDataChangeForSoql(soql);
        }
        catch(error) {
          return new Promise((resolve, reject) => {
                reject(error);
            })
        }


    }

}

export const dataUpdatesBridge = new DataUpdatesBridge();
