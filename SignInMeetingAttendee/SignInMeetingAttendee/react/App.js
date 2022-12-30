import React from "react";
import { Platform, ScrollView } from 'react-native';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as ApolloProvider } from "apollo-react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import store from './src/stores';
import MeetingAttendeeList from "./src/screens/MeetingsAttendeeList/MeetingAttendeeList";
import { layoutBridge } from 'oce-apps-bridges';

Icon.loadFont();

export const isIphone = !Platform.isPad;

export default (props) => {

    let { instanceId, recordId } = props;
    if (instanceId) {
      layoutBridge.setHeight(500);
    }
    return (
        <ReduxProvider store={store}>
            <ApolloProvider>
                <MeetingAttendeeList parentId={recordId} />
            </ApolloProvider>
        </ReduxProvider>
    )
};
