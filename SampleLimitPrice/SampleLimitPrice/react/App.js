import React from "react";
import { ScrollView } from 'react-native';
import SampleLimitWidget from "./src/screens/SampleLimitWidget/SampleLimitWidget";
import { Provider } from "apollo-react-native";
import { isIphone } from './src/constants';
import { layoutBridge } from "oce-apps-bridges";

export default (props) => {
    const { instanceId, recordId } = props;
    if (instanceId) {
        layoutBridge.setHeight(600);
    }
    if (isIphone) {
        return (
            <Provider>
                <ScrollView>
                    <SampleLimitWidget accountId={recordId} />
                </ScrollView>
            </Provider>
        )
    } else {
        return (
            <Provider>
                <SampleLimitWidget accountId={recordId} />
            </Provider>
        )
    }
};
