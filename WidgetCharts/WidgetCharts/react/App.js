/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { useState, useEffect } from 'react';
import LineChartTRXDetails from './src/LineChartTRXDetails';
import StackedBarChartCallDetails from './src/StackedBarChartCallDetails';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Provider, SegmentedControl, DarkTheme, DefaultTheme, Card } from 'apollo-react-native';
import { NativeModules, StyleSheet, NativeEventEmitter, ScrollView, useColorScheme } from 'react-native';

import { isIphone } from './src/constants';
import { layoutBridge } from 'oce-apps-bridges';

Icon.loadFont();

export default (props) => {
  const { instanceId, recordId } = props;
  const [ selectedChart, setSelectedChart ] = useState('Sales');
  const [ connectionStatus, setConnectionStatus ] = useState();
  const colorScheme = useColorScheme();
  const [preferredTheme, setPreferredTheme] = useState(DefaultTheme);

  const { ReachabilityBridge } = NativeModules;
  const reachabilityBridgeEmitter = new NativeEventEmitter(
    ReachabilityBridge
  );

  if (instanceId) {
    layoutBridge.setHeight(375);
  }

  useEffect(() => {
    setPreferredTheme(colorScheme === 'dark' ? DarkTheme : DefaultTheme);

    //Ask bridge directly about status
    NativeModules.ReachabilityBridge.networkReachabilityStatus()
      .then(networkStatusString => {
        setConnectionStatus(networkStatusString);
      })
      .catch(reason => {
        console.log(reason);
      });

    // Connection status subscription
    this.connectionStatusSubscription = reachabilityBridgeEmitter.addListener(
      'NetworkReachabilityStatus',
      networkStatusString => {
        if (
          networkStatusString.prevStatus !== networkStatusString.currentStatus
        ) {
          this.setState({ connectionStatus: networkStatusString });
        }
      });
  }, [colorScheme]);

  useEffect(() => {
    this.connectionStatusSubscription.remove();
  });

  const innerComponent = (
    <Card
      style={{
        paddingHorizontal: isIphone ? 15 : 10,
        paddingTop: isIphone ? 10 : 40,
        paddingBottom: isIphone ? 10 : 20,
        borderRadius: 0,
        height: '100%'
      }}
    >
      <SegmentedControl.Row
        onValueChange={value => setSelectedChart(value)}
        value={selectedChart}
        style={styles.toggleButtons}
      >
        <SegmentedControl value="Sales">Sales Chart</SegmentedControl>
        <SegmentedControl value="Call">Calls Per Month</SegmentedControl>
      </SegmentedControl.Row>

      {selectedChart === 'Sales' && (
        <LineChartTRXDetails
          recordId={recordId}
          connectionStatus={connectionStatus}
        />
      )}
      {selectedChart === 'Call' && (
        <StackedBarChartCallDetails
          instanceId={instanceId}
          recordId={recordId}
          connectionStatus={connectionStatus}
        />
      )}
    </Card>
  );

  if (isIphone) {
    return (
      <Provider theme={preferredTheme}>
        <ScrollView>
          {innerComponent}
        </ScrollView>
      </Provider>
    )
  } else {
    return (
      <Provider theme={preferredTheme}>
        {innerComponent}
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  toggleButtons: {
    justifyContent: isIphone ? 'center' : 'flex-start',
    marginBottom: isIphone ? 5 : 20,
  },
});

