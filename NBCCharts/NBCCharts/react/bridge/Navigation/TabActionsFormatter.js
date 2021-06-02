/*
* @Author: Oleg Gnidets
* @Date:   2019-06-25
* @Email:  oleg.oleksan@gmail.com
* 
* @flow
*/

"use strict";

import { TabActions, QueryParameters } from "./TabActions";

class TabActionsFormatter {
    navigationPath(actions: TabActions, parameters: QueryParameters): string {
        let components = [];

        let host = "oce://reactlink/";

        const tabName = this.makeComponent("tab", actions.tabName);

        if (actions.isModal || tabName == "") {
            host += "modal/";
        } else {
            components.push(this.makeComponent("tab", actions.tabName));
        }

        components.push(
            this.makeComponent("sobject-name", actions.sObjectName),
        );
        components.push(this.makeComponent("record-id", actions.recordID));
        components.push(this.makeComponent("action", actions.action));
        components.push(
            this.makeComponent("quick-action", actions.quickAction),
        );
        components = components.filter(Boolean);

        let path = host + components.join("/");

        var queryParameters = this.makeParameters(parameters);

        if (queryParameters) {
            path = path + "?" + queryParameters;
        }

        return path;
    }

    makeParameters(parameters: QueryParameters): string {
        let queries = [this.makeParameter("uid", parameters.uid)];

        parameters.productIDs.forEach(productID => {
            queries.push(this.makeParameter("product-id", productID));
        });

        var fullQuery = queries.filter(Boolean).join("&");

        return fullQuery;
    }

    makeComponent(key: string, value: string) {
        if (value == null || value == "") {
            return "";
        }

        return key + "/" + value;
    }

    makeParameter(key: string, value: string) {
        if (value == null || value == "") {
            return "";
        }

        return key + "=" + value;
    }
}

export const tabFormatter = new TabActionsFormatter();
