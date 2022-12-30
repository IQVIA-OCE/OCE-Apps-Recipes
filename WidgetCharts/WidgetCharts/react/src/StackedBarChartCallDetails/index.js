import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';

import { sfNetAPI, environment, navigator } from 'oce-apps-bridges';

import {
  ActivityIndicator,
  Colors,
  BarChart,
  Button,
  IconButton,
} from 'apollo-react-native';
import { NavigationActions } from '../../bridge/Navigation/NavigationActions';
import { NEW_MODE } from '../../bridge/Navigation/NavigationModes';
import moment from 'moment';
import { isIphone } from '../constants';
import { generateColors } from '../helpers';

const colorScale = [
  '#32a2fb',
  '#91c9f6',
  '#6151f0',
  '#a9a0f1',
  '#fc1169',
  '#f77bab',
  '#b6b6b6',
];

export default class StackedBarChartCallDetails extends React.Component {
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

  async componentDidMount() {
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

  fetchCalldata = () => {
    const { territory } = this.state;
    const { recordId } = this.props;

    let filter = recordId
      ? `And OCE__Territory__c = '${territory.name}' And OCE__Account__c = '${recordId}'`
      : `And OCE__Territory__c = '${territory.name}'`;
    this.setState({ loading: true });

    return new Promise((resolve, reject) => {
      sfNetAPI.query(
        `SELECT OCE__CallType__c, OCE__CallDateTime__c FROM OCE__Call__c WHERE OCE__CallDateTime__c != null ${filter} ORDER BY OCE__CallDateTime__c`,
        data => {
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

          resolve({ chartData, minDate, maxDate });
        },
        error => {
          this.setState({ loading: false });
          console.log(error);
          reject(error);
        }
      );
    });
  };

  logACall(id) {
    const actions = NavigationActions.new({
      entity: 'OCE__Call__c',
      mode: NEW_MODE,
      parentID: id,
    });

    navigator.dispatch(actions).then(
      r => console.log(r),
      e => console.log(e)
    );
  }

  render() {
    const { chartData, minDate, maxDate, loading } = this.state;
    const { recordTypeId, connectionStatus } = this.props;
    const chartColors = generateColors(chartData.length || 10);

    let zoomDomain;

    if (minDate) {
      const zoomDomainMin = moment(new Date(minDate))
        .subtract(1, 'M');

      const zoomDomainMax = moment(new Date(minDate))
        .add(1, 'Y')
        .subtract(1, 'M');

      zoomDomain = { x: [new Date(zoomDomainMin), new Date(zoomDomainMax)] };

      console.log(zoomDomain);
    }

    let tickNumber = chartData.reduce((prev, item) => prev + item.data.length, 0); 
    const ticksWidth = tickNumber * 10;
    const windowWidth = Dimensions.get('window').width;
    const chartWidth = ticksWidth < windowWidth ? windowWidth : ticksWidth;

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
          {connectionStatus != 'No Connection' ? (
            <View style={styles.refreshButton}>
              <IconButton
                icon="refresh"
                color="#2bb3fe"
                size={30}
                animated
                onPress={() => this.fetchCalldata()}
                disabled={loading}
              />
            </View>
          ) : null}
          <Button
            style={styles.buttonText}
            icon="phone"
            mode="outlined"
            onPress={() => this.logACall(recordTypeId)}
          >
            Call
          </Button>
        </View>

        {loading && (
          <View style={{ padding: 20 }}>
            <ActivityIndicator
              animating={true}
              color={Colors.blue700}
              style={{ paddingVertical: 10 }}
            />
          </View>
        )}

        {chartData.length && !loading ? (
          <React.Fragment>
            <ScrollView horizontal>
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
                maxDomain={{ x: new Date('2022-01-01') }}
                minDomain={{
                  x: moment(new Date(minDate))
                    .subtract(1, 'M'),
                }}
                tickFormatX={x =>
                  moment(x)
                    .format('MMM, YY')
                }
                tickCount={isIphone ? null : 12}
                hasAxis={true}
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
                      <Text>{el.name}</Text>
                    </View>
                  );
                })}
              </View>
            )}
          </React.Fragment>
        ) : null}

        {!chartData.length && !loading ? (
          <View style={{ alignSelf: 'center', paddingTop: 50 }}>
            <Text>No Data Found</Text>
          </View>
        ) : null}
      </View>
    );
  }
}

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
    color: '#2bb3fe',
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
