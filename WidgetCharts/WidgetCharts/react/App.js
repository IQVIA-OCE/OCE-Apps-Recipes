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
import { StyleSheet, ScrollView, useColorScheme, Platform, Text } from 'react-native';

import { isMobilePhone } from './src/constants';
import { layoutBridge, reachability } from 'oce-apps-bridges';

Icon.loadFont();

export default (props) => {
  const { instanceId, recordId } = props;
  const [ selectedChart, setSelectedChart ] = useState('Sales');
  const [ connectionStatus, setConnectionStatus ] = useState('WiFi');
  const colorScheme = useColorScheme();
  const [ preferredTheme, setPreferredTheme ] = useState(DefaultTheme);

  if (instanceId) {
    layoutBridge.setHeight(375);
  }

  useEffect(() => {
    if (Platform.OS !== 'web') {
      setPreferredTheme(colorScheme === 'dark' ? DarkTheme : DefaultTheme);
    }

    //Ask bridge directly about status
      reachability.networkReachabilityStatus()
      .then(networkStatusString => {
        setConnectionStatus(networkStatusString);
      })
      .catch(reason => {
        console.log(reason);
      });

    // Connection status subscription
    const connectionStatusSubscription = reachability.addListener(
      ({prevStatus, currentStatus}) => {
        if (prevStatus !== currentStatus) {
            setConnectionStatus(currentStatus)
        }
      });

      return () => connectionStatusSubscription.remove();
  }, [colorScheme]);

  const innerComponent = (
    <Card
      style={{
        paddingHorizontal: isMobilePhone ? 15 : 10,
        paddingTop: isMobilePhone ? 10 : 40,
        paddingBottom: isMobilePhone ? 10 : 20,
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

  if (isMobilePhone) {
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
    justifyContent: isMobilePhone ? 'center' : 'flex-start',
    marginBottom: isMobilePhone ? 5 : 20,
  },
});

