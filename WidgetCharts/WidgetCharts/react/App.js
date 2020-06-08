/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import { View } from "react-native";
import LineChartTRXDetails from "./src/LineChartTRXDetails";
import StackedBarChartCallDetails from "./src/StackedBarChartCallDetails";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Provider, SegmentedControl } from "apollo-react-native";
import { NativeModules, StyleSheet, NativeEventEmitter } from "react-native";


Icon.loadFont();

export default class App extends Component {
    state = {
        selectedChart: 'Sales'
    };

    componentDidMount() {
        const { ReachabilityBridge } = NativeModules;
        const reachabilityBridgeEmitter = new NativeEventEmitter(ReachabilityBridge);
    
        //Ask bridge directly about status
        NativeModules.ReachabilityBridge.networkReachabilityStatus()
          .then(
            (networkStatusString) => {
              this.setState({connectionStatus: networkStatusString})
            }
          )
          .catch(
            (reason) => { console.log(reason); }
          );
    
        // Connection status subscription 
        this.connectionStatusSubscription = reachabilityBridgeEmitter.addListener(
            'NetworkReachabilityStatus',
            (networkStatusString) => {
              if (networkStatusString.prevStatus !== networkStatusString.currentStatus){
                this.setState({connectionStatus: networkStatusString})
              }
            }
        );
    }

    componentWillUnmount() {
        this.connectionStatusSubscription.remove();
    }

    render() {
        const { instanceId, recordId } = this.props;
        const { selectedChart, connectionStatus } = this.state;

        if (instanceId) {
            const layout = NativeModules.LayoutBridge;
            layout.setHeight(375, instanceId);
        }

        return (
            <Provider>
                <View style={styles.container}>
                    <SegmentedControl.Row
                        onValueChange={value => this.setState({selectedChart: value})}
                        value={selectedChart}
                        style={styles.toggleButtons}
                        >
                        <SegmentedControl value="Sales">Sales Chart</SegmentedControl>
                        <SegmentedControl value="Call">Calls Per Month</SegmentedControl>
                    </SegmentedControl.Row>

                    { selectedChart === "Sales" && <LineChartTRXDetails recordId={recordId} connectionStatus={connectionStatus}/> }
                    { selectedChart === "Call" && <StackedBarChartCallDetails instanceId={instanceId} recordId={recordId} connectionStatus={connectionStatus}/>}
                </View>
            </Provider>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 30,
        paddingTop: 40,
        paddingBottom: 20
    },
    toggleButtons: {
        marginBottom: 20
    },
});
