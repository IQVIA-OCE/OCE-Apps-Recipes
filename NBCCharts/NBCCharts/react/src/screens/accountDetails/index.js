import React from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";

import { localized } from "oce-apps-bridges";

import {
  ActivityIndicator,
  DonutChart,
  LineChart,
  Title,
  Text,
  withTheme
} from "apollo-react-native";
import { isMobilePhone } from "../../constants";
import { fetchNbcHistory } from "../../api/nbcApi";

const styles = StyleSheet.create({
  screen: {
    minHeight: 100 + "%"
  },
  header: {
    paddingVertical: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#dadada"
  },
  name: {
    marginBottom: 10
  },
  accountDetails: {
    flexDirection: "row"
  },
  accountDetailsColumn: {
    alignItems: "center",
    marginHorizontal: 5
  },
  columnTitleText: {
    color: "#999999"
  },
  columnContainer: {
    paddingHorizontal: 20,
    marginBottom: 5
  },
  columnText: {
    fontSize: 15
  },
  chartContainer: {
    borderTopWidth: 1,
    borderTopColor: "#dadada",
    width: 100 + "%",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 20,
    paddingHorizontal: 15,
  },
  chartTitle: {
    marginBottom: 40
  },
  separator: {
    backgroundColor: "#8E8E8E",
    flex: 0.001,
    height: StyleSheet.hairlineWidth
  }
});

const ordinalNumber = n =>
  ["st", "nd", "rd"][(((((n < 0 ? -n : n) + 90) % 100) - 10) % 10) - 1] || "th";
const colorScale = [
  "#32a2fb",
  "#91c9f6",
  "#6151f0",
  "#a9a0f1",
  "#fc1169",
  "#f77bab",
  "#b6b6b6"
];

class AccountDetailsScreen extends React.Component {
  constructor(props) {
    super(props);
    const { route } = props;
    const nbcAccountData = route.params?.nbcAccountData ?? {};
    const nbcScores = JSON.parse(nbcAccountData.OCE__NbcData__c);
    const initialScoreData = this.getScoreData(nbcScores, true);

    this.state = {
      nbcData: nbcAccountData,
      scoreData: initialScoreData,
      scoreHistoryData: [],
      scoreHistoryLoading: false
    };
  }

  componentDidMount() {
    this.fetchScoreHistory();
    this.setScoreData();
  }

  setScoreData() {
    const { nbcData } = this.state;
    const nbcScores = JSON.parse(nbcData.OCE__NbcData__c);

    setTimeout(() => {
      this.setState({
        scoreData: this.getScoreData(nbcScores)
      });
    }, 100);
  }

  getScoreData(nbcScores, isEmpty = false) {
    return Object.keys(nbcScores.metrics).map(key => {
      const value = !isEmpty ? nbcScores.scores[key] : 0;
      const metricName = nbcScores.customLabels[key]
        ? nbcScores.customLabels[key]
        : localized(`oce__ada_${key.toLowerCase()}`, key);
      const metricValueDesc = nbcScores.metrics[key]
        ? nbcScores.metrics[key]
        : "";

      return {
        name: `${metricName}  ${
          metricValueDesc.length ? "- " + metricValueDesc : ""
        }`,
        value,
        tooltip: String(value),
      };
    });
  }

  fetchScoreHistory() {
    this.setState({ scoreHistoryLoading: true });

    const { nbcData } = this.state;

    fetchNbcHistory(nbcData.Id)
      .then(data => {
        const scoreHistoryData = data.records.map(historyRow => {
          const createdDate = historyRow.CreatedDate.split(".");
          return {
            x: new Date(createdDate[0]),
            y: Number(historyRow.NewValue || 0),
            tooltip: Number(historyRow.NewValue || 0),
          };
        });

        this.setState(() => {
          return {
            scoreHistoryData: scoreHistoryData,
            scoreHistoryLoading: false
          };
        });
      })
      .catch(e => {
        this.setState(() => {
          return {
            scoreHistoryLoading: false,
            error: e.message
          };
        });
        console.log(e);
      });
  }

  render() {
    const {
      scoreData,
      scoreHistoryData,
      nbcData,
      scoreHistoryLoading
    } = this.state;
    const { theme } = this.props;

    const screenBgColor = theme.dark ? theme.colors.background : "#ffffff";
    const headerBgColor = theme.dark ? theme.colors.surface : "#f2f2f2";

    return (
      <ScrollView style={[styles.screen, { backgroundColor: screenBgColor }]}>
        <View style={[styles.header, { backgroundColor: headerBgColor }]}>
          <Title style={styles.name}>{nbcData.OCE__Account__r.Name}</Title>

          <View style={styles.accountDetails}>
            <View style={styles.accountDetailsColumn}>
              <View style={styles.columnContainer}>
                <Text style={styles.columnText}>
                  {nbcData.OCE__Account__r.OCE__Specialty__c
                    ? nbcData.OCE__Account__r.OCE__Specialty__c
                    : " - "}
                </Text>
              </View>
              <View>
                <Text style={styles.columnTitleText}>Specialty</Text>
              </View>
            </View>
            <View style={styles.accountDetailsColumn}>
              <View style={styles.columnContainer}>
                <Text style={styles.columnText}>
                  {nbcData.OCE__Account__r.OCE__ParentAccount__r
                    ? nbcData.OCE__Account__r.OCE__ParentAccount__r.Name
                    : " - "}
                </Text>
              </View>
              <View>
                <Text style={styles.columnTitleText}>Parent Account</Text>
              </View>
            </View>
          </View>
        </View>

        {scoreData || scoreHistoryData ? null : (
          <View
            style={{
              alignSelf: "center",
              paddingTop: 100,
              height: 100 + "%",
              alignItems: "center"
            }}
          >
            <Text>No Data Found</Text>
          </View>
        )}

        <View style={styles.chartContainer}>
          <Title style={styles.chartTitle}>Next Best Customer Score</Title>
          <DonutChart
            innerWidth={isMobilePhone ? 200 : 300}
            legendWidth={isMobilePhone ? 300 : 500}
            legendHeight={isMobilePhone ? undefined : 130}
            ringWidth={15}
            title="Score"
            subtitle={nbcData.OCE__TotalScore__c}
            content={
              "Ranked " +
              nbcData.OCE__Rank__c +
              ordinalNumber(nbcData.OCE__Rank__c) +
              " in Territory"
            }
            colorScale={[...colorScale, ...colorScale]}
            data={scoreData}
            animate={{ duration: 3000 }}
            showLegend={true}
          />
        </View>
        <View
          style={{
            ...styles.chartContainer,
            paddingHorizontal: 40,
            paddingBottom: 40
          }}
        >
          <Title style={styles.chartTitle}>
            Next Best Customer Score History
          </Title>
          {scoreHistoryData.length && scoreHistoryData.length > 1 ? (
            <LineChart
              height={400}
              width={isMobilePhone ? Dimensions.get("window").width : 600}
              scaleX="time"
              data={{
                data: scoreHistoryData
              }}
              fixLabelOverlap={true}
            />
          ) : scoreHistoryLoading ? (
            <View style={{ padding: 20 }}>
              <ActivityIndicator
                animating={true}
                color={theme.colors.primary}
                style={{ paddingVertical: 10 }}
              />
            </View>
          ) : (
            <View style={{ alignSelf: "center", paddingTop: 50 }}>
              <Text>No Data Found</Text>
            </View>
          )}
        </View>
      </ScrollView>
    );
  }
}

export default withTheme(AccountDetailsScreen);
