import React from "react";
import { NativeModules, Platform, ScrollView } from 'react-native';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as ApolloProvider } from "apollo-react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import store from './src/stores';
import MeetingAttendeeList from "./src/screens/MeetingsAttendeeList/MeetingAttendeeList";

Icon.loadFont();

export const isIphone = !Platform.isPad;

export default (props) => {

    let { instanceId, recordId } = props;
    if (instanceId) {
        const layout = NativeModules.LayoutBridge;
        layout.setHeight(500, instanceId);
    }
    return (
        <ReduxProvider store={store}>
            <ApolloProvider>
                <MeetingAttendeeList parentId={recordId} />
            </ApolloProvider>
        </ReduxProvider>
    )
};
