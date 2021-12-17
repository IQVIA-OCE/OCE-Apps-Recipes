/*
* @Author: Maksym Kondakov
* @Date:   2020-03-05
* @Email:  maksym.kondakov@avenga.com
*
* @flow
*/

"use strict";

import { NativeModules } from "react-native";

class ExternalNavigator {

    open(url: string): Promise<Object> {

        try {
          return NativeModules.ExternalNavigatorBridge.open(url);
        }
        catch(error) {
          return new Promise((resolve, reject) => {
                reject(error);
            })
        }


    }

}

export const externalNavigator = new ExternalNavigator();
