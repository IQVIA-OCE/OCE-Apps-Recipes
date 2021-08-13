/*
* @Author: Oleg Gnidets
* @Date:   2019-05-14
* @Email:  oleg.oleksan@gmail.com
*
* @flow
*/

"use strict";

import { Logging } from "./Logger/logging";
import { iosLogger } from "./Logger/logger";
import { DatabaseManagable, databaseManager } from "./Database/DatabaseManager";

export const logger: Logging = iosLogger;
export const dbManager: DatabaseManagable = databaseManager;
