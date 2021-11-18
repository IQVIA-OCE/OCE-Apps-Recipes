/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { useEffect } from "react";
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { ATTACHMENTS_LIST } from "./src/constants/routes";
import AttachmentsList from "./src/screens/AttachmentsList/AttachmentsList";
import SearchAttachments from "./src/screens/SearchAttachments/SearchAttachments";
import AttachmentsHeader from "./src/screens/AttachmentsList/AttachmentsHeader";
import SearchAttachmentsHeader from "./src/screens/SearchAttachments/SearchAttachmentsHeader";
import { useDispatch } from "react-redux";
import { setConnectionStatus, setRecordId } from "./src/store/AttachmentsListReducers";
import { NativeModules, NativeEventEmitter } from 'react-native';

Icon.loadFont();
const { ReachabilityBridge } = NativeModules;
const reachabilityBridgeEmitter = new NativeEventEmitter(
    ReachabilityBridge
);

const MainNavigator = createStackNavigator({
    AttachmentsList: {
        screen: AttachmentsList,
        navigationOptions: {
            header: <AttachmentsHeader />,
        }
    },
    SearchAttachments: {
        screen: SearchAttachments,
        navigationOptions: {
            header: <SearchAttachmentsHeader />,
        }
    },
}, {
    initialRouteName: ATTACHMENTS_LIST,
});

const Navigation = createAppContainer(MainNavigator);
let connectionStatusSubscription;

const App = ({ recordId }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (recordId) dispatch(setRecordId(recordId))
    }, [recordId]);

    useEffect(() => {
        connectionStatusSubscription = reachabilityBridgeEmitter.addListener(
            'NetworkReachabilityStatus',
            networkStatusString => {
                if (networkStatusString.prevStatus !== networkStatusString.currentStatus) {
                    dispatch(setConnectionStatus(networkStatusString));
                }
            }
        );

        return () => {
            connectionStatusSubscription.remove();
        }
    }, []);

    return <Navigation />;
}

export default App;