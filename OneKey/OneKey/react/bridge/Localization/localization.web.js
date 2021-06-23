/*
* @Author: Oleg Gnidets
* @Date:   2019-04-25
* @Email:  oleg.oleksan@gmail.com
*
* @flow
*/

"use strict";

function allLocalizationKeys(): Array<string> {
    return ["sample", "sample_0", "sample_1", "sample_2", "sample_3"];
}

function localized(key: string, defaultValue: string): string {
    return defaultValue;
}

export { allLocalizationKeys, localized };
