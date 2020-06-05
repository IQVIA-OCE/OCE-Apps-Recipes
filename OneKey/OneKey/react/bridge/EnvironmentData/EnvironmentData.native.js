/*
* @Author: Oleg Gnidets
* @Date:   2019-05-03
* @Email:  oleg.oleksan@gmail.com
*
* @flow
*/

"use strict";

import { NativeModules } from "react-native";

const BridgeEnvData = NativeModules.EnvironmentDataBridge;

class EnvironmentData {
    userID(): string {
        return BridgeEnvData.userID;
    }

    timeZone(): string {
        return BridgeEnvData.timeZone;
    }

    locale(): string {
        return BridgeEnvData.locale;
    }

    language(): string {
        return BridgeEnvData.language;
    }

    currencyISOCode(): string {
        return BridgeEnvData.currencyISOCode;
    }

    sfInstanceURL(): string {
        return BridgeEnvData.sfInstanceURL;
    }

    sfApiVersion(): string {
        return BridgeEnvData.sfApiVersion;
    }

    territory() {
        return BridgeEnvData.territory;
    }
}

export const environment = new EnvironmentData();
