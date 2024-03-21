import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { environment } from '@oce-apps/oce-apps-bridges';
import { fetchMarkets, fetchMarketData } from '../api/api'
import {
  ActivityIndicator,
  LineChart,
  Select,
  IconButton,
  Card,
  withTheme,
} from '@oce-apps/apollo-react-native';
import { isMobilePhone } from '../constants';
import color from 'color';

class LineChartTRXDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chartData: [],
      loading: false,
      market: null,
      marketList: [],
      territory: environment.territory(),
      userId: environment.userID(),
    };
  }

  componentDidMount() {
    this.fetchMarketsList();
  }

  fetchMarketsList = async () => {
    const { territory } = this.state;
    const { recordId } = this.props;
    try {
      const data = await fetchMarkets(recordId, territory.name);
      const marketList = data.records.map((market, i) => {
        return {
          label: market.OCE__Market__c,
          id: i,
        };
      });

      this.setState({ loading: false, marketList });
      if (marketList.length) {
        this.handleMarketChange(marketList[0]);
      }
    } catch (error) {
      this.setState({ loading: false });
      console.log(error);
    }
  };

  handleMarketChange = market => {
    this.setState({ market }, async () => {
      try {
        if (market) {
          const marketData = await this.handleMarketData();
          this.setState({ chartData: marketData });
        }
      } catch (error) {
        console.log(error);
      }
    });
  };

  handleMarketData = async () => {
    const { territory, market } = this.state;
    const { recordId } = this.props;
    this.setState({ loading: true });

    try {
      const data = await fetchMarketData(recordId, market.label, territory.name);
      this.setState({ loading: false });
      if (data.records) {
        return data.records.map((item) => {
          return {
            name: item.OCE__Product__r ? item.OCE__Product__r.Name : '',
            data: [
              {
                x: item.OCE__PeriodLabelBucket24__c,
                y: item.OCE__Measure1Bucket24__c,
              },
              {
                x: item.OCE__PeriodLabelBucket23__c,
                y: item.OCE__Measure1Bucket23__c,
              },
              {
                x: item.OCE__PeriodLabelBucket22__c,
                y: item.OCE__Measure1Bucket22__c,
              },
              {
                x: item.OCE__PeriodLabelBucket21__c,
                y: item.OCE__Measure1Bucket21__c,
              },
              {
                x: item.OCE__PeriodLabelBucket20__c,
                y: item.OCE__Measure1Bucket20__c,
              },
              {
                x: item.OCE__PeriodLabelBucket19__c,
                y: item.OCE__Measure1Bucket19__c,
              },
              {
                x: item.OCE__PeriodLabelBucket18__c,
                y: item.OCE__Measure1Bucket18__c,
              },
              {
                x: item.OCE__PeriodLabelBucket17__c,
                y: item.OCE__Measure1Bucket17__c,
              },
              {
                x: item.OCE__PeriodLabelBucket16__c,
                y: item.OCE__Measure1Bucket16__c,
              },
            ],
          };
        });
      }

      return [];
    } catch (error) {
      this.setState({ loading: false });
      console.log(error);
      throw error;
    }
  };

  render() {
    const { chartData, loading, marketList, market } = this.state;
    const { connectionStatus, theme } = this.props;

    const topButtonStyles = {
      width: isMobilePhone ? '100%' : 250,
      position: isMobilePhone ? 'relative' : 'absolute',
      right: isMobilePhone ? 0 : 15,
      top: isMobilePhone ? 0 : -90,
      flexDirection: isMobilePhone ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: isMobilePhone ? 'center' : 'flex-start',
    };

    const colorScale = [
      color(theme.colors.primary).lighten(0.165).hex(),
      color(theme.colors.accent).lighten(0.805).hex(),
      color(theme.colors.primary).red(97).green(81).lighten(0.1).hex(),
      color(theme.colors.primary).red(169).green(160).lighten(0.01).hex(),
      color(theme.colors.error).blue(105).lighten(0.125).hex(),
      color(theme.colors.error).green(123).blue(171).hex(),
      color(theme.colors.tertiary).lighten(0.1).hex(),
    ];

    const gridColor = theme.dark
      ? color(theme.colors.surface)
        .lighten(0.5)
        .hex()
      : color(theme.colors.surface)
        .darken(0.1)
        .hex();

    return (
      <View>
        <View style={topButtonStyles}>
          {connectionStatus !== 'No Connection' && (
            <View
              style={[styles.refreshButton, { marginRight: isMobilePhone ? 0 : 5 }]}
            >
              <IconButton
                icon="refresh"
                color={ theme.colors.primary }
                size={30}
                animated
                onPress={this.handleMarketData}
                disabled={loading || !market}
              />
            </View>
          )}
          <Select
            options={marketList}
            value={market}
            placeholder="Select market..."
            onChange={this.handleMarketChange}
            label="Market"
            disabled={!!loading}
            canDeselect={false}
            style={{ width: isMobilePhone ? '71%' : '80%' }}
          />
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

        {Boolean(chartData.length) && !loading && (
          <LineChart
            height={250}
            data={chartData}
            colorScale={colorScale}
            style={{
              axis: {
                stroke: gridColor,
                strokeWidth: 1,
              },
            }}
          />
        )}
        {!chartData.length && !loading && (
          <View style={styles.noDataMessage}>
            <Text style={{ color: theme.colors.text}}>No Data Found</Text>
          </View>
        )}
      </View>
    );
  }
}

export default withTheme(LineChartTRXDetails);

const styles = StyleSheet.create({
  refreshButton: {
    paddingTop: 25,
  },
  noDataMessage: {
    alignSelf: 'center',
    paddingTop: 50
  }
});
