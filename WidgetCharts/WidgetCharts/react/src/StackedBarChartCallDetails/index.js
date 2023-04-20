import React from 'react';
import {View, Text, StyleSheet, ScrollView, Dimensions, Platform} from 'react-native';

import {environment, externalNavigator, navigator} from 'oce-apps-bridges';

import {
  ActivityIndicator,
  BarChart,
  Button,
  IconButton,
  withTheme,
} from 'apollo-react-native';
import { NavigationActions } from '../../bridge/Navigation/NavigationActions';
import { NEW_MODE } from '../../bridge/Navigation/NavigationModes';
import moment from 'moment';
import { isIphone } from '../constants';
import { generateColors } from '../helpers';
import color from 'color';
import { fetchCall } from "../api/api";

class StackedBarChartCallDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chartData: [],
      loading: false,
      market: null,
      territory: environment.territory(),
      userId: environment.userID(),
    };
  }

  componentDidMount() {
    this.handleCall();
  }

  handleCall = async () => {
    try {
      const { chartData, minDate, maxDate } = await this.fetchCalldata();

      this.setState({
        chartData,
        minDate,
        maxDate,
      });
    } catch (error) {
      console.log(error);
    }
  }

  fetchCalldata = async () => {
    const { territory } = this.state;
    const { recordId } = this.props;
    this.setState({ loading: true });

    try {
      const data = await fetchCall(recordId, territory.name);

      let chartData = [];
      let callDataByType = groupBy(data.records, 'OCE__CallType__c');
      let minDate;
      let maxDate;
      if (data.records.length) {
        minDate = `${data.records[0].OCE__CallDateTime__c.substring(
            0,
            8
        )}01`;
        maxDate = `${data.records[
        data.records.length - 1
            ].OCE__CallDateTime__c.substring(0, 8)}01`;
      }
      Object.keys(callDataByType).map(callType => {
        let groupedByDate = callDataByType[callType].reduce(
            (r, { OCE__CallDateTime__c }) => {
              if (OCE__CallDateTime__c) {
                let formatedCallDateTime = `${OCE__CallDateTime__c.substring(
                    0,
                    8
                )}01`;

                if (!r[formatedCallDateTime])
                  r[formatedCallDateTime] = {
                    x: new Date(formatedCallDateTime),
                    y: 1,
                    tooltip: callType
                  };
                else r[formatedCallDateTime].y++;
              }
              return r;
            },
            {}
        );
        const callValues = Object.keys(groupedByDate).map(
            key => groupedByDate[key]
        );

        chartData = [...chartData, { name: callType, data: callValues }];
      });

      this.setState({ loading: false });
      return { chartData, minDate, maxDate };
    } catch (error) {
      this.setState({ loading: false });
      console.log(error);
      throw error
    }
  };

  logACall = async () => {
    try {
      if (Platform.OS === "web") {
        externalNavigator.open(`{EndPoint}&retURL=/lightning/o/OCE__Call__c/new`);
      } else {
        navigator.navigate({}, 'OCE__Call__c', null, 'present', 'new');
      }
    } catch (e) {
      console.warn(e);
    }
  }

  render() {
    const { chartData, minDate, loading } = this.state;
    const { connectionStatus, theme } = this.props;
    const chartColors = generateColors(chartData.length || 10);

    let zoomDomain;

    if (minDate) {
      const zoomDomainMin = moment(new Date(minDate))
        .subtract(1, 'M');

      const zoomDomainMax = moment(new Date(minDate))
        .add(1, 'Y')
        .subtract(1, 'M');

      zoomDomain = { x: [new Date(zoomDomainMin), new Date(zoomDomainMax)] };
    }

    let tickNumber = chartData.reduce((prev, item) => prev + item.data.length, 0);
    const ticksWidth = tickNumber * 10;
    const windowWidth = Dimensions.get('window').width;
    const chartWidth = ticksWidth < windowWidth ? windowWidth : ticksWidth;

    const colorScale = [
      color(theme.colors.primary).lighten(0.165).hex(),
      color(theme.colors.accent).lighten(0.805).hex(),
      color(theme.colors.primary).red(97).green(81).lighten(0.1).hex(),
      color(theme.colors.primary).red(169).green(160).lighten(0.01).hex(),
      color(theme.colors.error).blue(105).lighten(0.125).hex(),
      color(theme.colors.error).green(123).blue(171).hex(),
      color(theme.colors.tertiary).lighten(0.1).hex(),
    ];

    const labelColor = theme.dark
      ? color(theme.colors.text)
        .darken(0.4)
        .hex()
      : theme.colors.text

    return (
      <View>
        <View
          style={[
            styles.topButtons,
            {
              position: isIphone ? 'relative' : 'absolute',
              top: isIphone ? 0 : -65,
              width: isIphone ? '100%' : 250,
              right: isIphone ? 20 : 0,
            },
          ]}
        >
          {connectionStatus !== 'No Connection' && (
            <View style={styles.refreshButton}>
              <IconButton
                icon="refresh"
                color={ theme.colors.primary }
                size={30}
                animated
                onPress={() => this.fetchCalldata()}
                disabled={loading}
              />
            </View>
          )}
          <Button
            style={[styles.buttonText, { color: theme.colors.primary }]}
            icon="phone"
            mode="outlined"
            onPress={this.logACall}
            testID="Create-Call"
          >
            Call
          </Button>
        </View>

        {loading && (
          <View style={{ padding: 20 }}>
            <ActivityIndicator
              animating={true}
              color={ theme.colors.primary }
              style={{ paddingVertical: 10 }}
            />
          </View>
        )}

        {chartData.length && !loading ? (
          <React.Fragment>
            <ScrollView horizontal testID="chart-container">
              <BarChart
                data={
                  isIphone
                    ? chartData.map(el => ({ ...el, name: null }))
                    : chartData
                }
                colorScale={isIphone ? chartColors : colorScale}
                height={250}
                allowZoom={false}
                allowPan={true}
                zoomDimension="x"
                zoomDomain={zoomDomain}
                scaleX={'time'}
                width={chartWidth}
                tickFormatX={x =>
                  moment(x)
                    .format('MMM, YY')
                }
                tickCount={isIphone ? null : 12}
                hasAxis={true}
                fixLabelOverlap
              />
            </ScrollView>
            {isIphone && (
              <View>
                {chartData.map((el, i) => {
                  return (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 5,
                        paddingHorizontal: 35
                      }}
                      key={`${i}`}
                    >
                      <View
                        style={{
                          width: 15,
                          height: 15,
                          backgroundColor: chartColors[i],
                          marginRight: 5,
                        }}
                      />
                      <Text style={{ color: labelColor }} >{el.name}</Text>
                    </View>
                  );
                })}
              </View>
            )}
          </React.Fragment>
        ) : null}

        {!chartData.length && !loading ? (
          <View style={{ alignSelf: 'center', paddingTop: 50 }}>
            <Text style={{ color: theme.colors.text}} testID='no-data'>No Data Found</Text>
          </View>
        ) : null}
      </View>
    );
  }
}

export default withTheme(StackedBarChartCallDetails);

const groupBy = (items, key) =>
  items.reduce(
    (result, item) => ({
      ...result,
      [item[key]]: [...(result[item[key]] || []), item],
    }),
    {}
  );

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 16,
  },
  topButtons: {
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  refreshButton: {
    marginRight: 5,
  },
});
