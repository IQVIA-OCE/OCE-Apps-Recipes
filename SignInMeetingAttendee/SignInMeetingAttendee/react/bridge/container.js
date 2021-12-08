// @flow

import { Logging } from "./Logger/logging";
import { iosLogger } from "./Logger/logger";
import { DatabaseManagable, databaseManager } from "./Database/DatabaseManager.native";

export const logger: Logging = iosLogger;
export const dbManager: DatabaseManagable = databaseManager;
