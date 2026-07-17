import React from "react";
import { Platform, useColorScheme } from 'react-native';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as ApolloProvider, DarkTheme, DefaultTheme } from "@oce-apps/apollo-react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import store from './src/stores';
import MeetingAttendeeList from "./src/screens/MeetingsAttendeeList/MeetingAttendeeList";
import { layoutBridge } from '@oce-apps/oce-apps-bridges';

Icon.loadFont();

export const isIphone = !Platform.isPad;

export default (props) => {

    let { instanceId, recordId } = props;
    if (instanceId) {
        layoutBridge.setHeight(500);
    }
    const colorScheme = useColorScheme();
    const dynamicTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
    const theme = Platform.OS === 'web' ? DefaultTheme : dynamicTheme;
    return (
        <ReduxProvider store={store}>
            <ApolloProvider theme={theme}>
                <MeetingAttendeeList parentId={recordId} />
            </ApolloProvider>
        </ReduxProvider>
    )
};
