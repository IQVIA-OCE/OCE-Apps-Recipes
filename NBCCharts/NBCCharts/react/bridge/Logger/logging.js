/*
* @Author: Oleg Gnidets
* @Date:   2019-05-20
* @Email:  oleg.oleksan@gmail.com
* 
* @flow
*/

"use strict";

export interface Logging {
    debug(msg: string): void,
    error(msg: string): void,
    warning(msg: string): void,
    info(msg: string): void,

    debug(msg: string, file: string): void,
    error(msg: string, file: string): void,
    warning(msg: string, file: string): void,
    info(msg: string, file: string): void,
}
