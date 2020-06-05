import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {sfNetAPI} from "../../bridge/sf/sfnetapi";
import { ActivityIndicator, Colors, LineChart, Select, IconButton } from "apollo-react-native";
import { environment } from "../../bridge/EnvironmentData/EnvironmentData.native";

const colorScale = ["#32a2fb", "#91c9f6", "#6151f0", "#a9a0f1", "#fc1169", "#f77bab", "#b6b6b6"];

export default class LineChartTRXDetails extends React.Component {

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

    async componentDidMount() {
        try{
            const marketList = await this.fetchMarketsList();

            this.setState({
                marketList,
            });

            if ( marketList.length ) {
                this.handleMarketChange(marketList[0]);
            }

        }catch(error){
            console.log(error);
        }
    }

    fetchMarketsList = () => {
        const {territory} = this.state;
        const {recordId} = this.props;
        
        let filter = recordId ? `And OCE__Account__c = '${recordId}'` : `And OCE__Territory__c = '${territory.name}'`
        this.setState({loading: true});

        return new Promise((resolve, reject) => {
            sfNetAPI
                .query(`SELECT OCE__Market__c FROM OCE__XponentSalesData__c Where OCE__Measure1Total__c != null ${filter} Group By OCE__Market__c`,
                    data => {
                        let marketList = data.records.map((market, i) => {
                            return {
                                label: market.OCE__Market__c,
                                id: i,
                            }
                        });
                    this.setState({loading: false});
                    resolve(marketList);
                    },
                    error => {
                        this.setState({loading: false});
                        console.log(error);
                        reject(error);
                    });
        });
    }

    handleMarketChange = market => {
        this.setState({market}, async () => {
            try {
                if (market){
                    const marketData = await this.fetchMarketData();
                    this.setState({chartData: marketData});
                }  
            } catch (error) {
                console.log(error);
            }
        });
    }

    fetchMarketData = () => {
        const { territory, market } = this.state;
        const { recordId } = this.props;
        let filter = recordId ? `And OCE__Territory__c = '${territory.name}' And OCE__Account__c = '${recordId}'` : `And OCE__Territory__c = '${territory.name}'`
        this.setState({loading: true});
        
        return new Promise((resolve, reject) => {
            sfNetAPI
                .query(`SELECT\
                    OCE__Measure1Bucket01__c,\
                    OCE__Measure1Bucket02__c,\
                    OCE__Measure1Bucket03__c,\
                    OCE__Measure1Bucket04__c,\
                    OCE__Measure1Bucket05__c,\
                    OCE__Measure1Bucket06__c,\
                    OCE__Measure1Bucket07__c,\
                    OCE__Measure1Bucket08__c,\
                    OCE__Measure1Bucket09__c,\
                    OCE__Measure1Bucket10__c,\
                    OCE__Measure1Bucket11__c,\
                    OCE__Measure1Bucket12__c,\
                    OCE__Measure1Bucket13__c,\
                    OCE__Measure1Bucket14__c,\
                    OCE__Measure1Bucket15__c,\
                    OCE__Measure1Bucket16__c,\
                    OCE__Measure1Bucket17__c,\
                    OCE__Measure1Bucket18__c,\
                    OCE__Measure1Bucket19__c,\
                    OCE__Measure1Bucket20__c,\
                    OCE__Measure1Bucket21__c,\
                    OCE__Measure1Bucket22__c,\
                    OCE__Measure1Bucket23__c,\
                    OCE__Measure1Bucket24__c,\
                    OCE__Measure1Bucket25__c,\
                    OCE__Measure1Bucket26__c,\
                    OCE__PeriodLabelBucket01__c,\
                    OCE__PeriodLabelBucket02__c,\
                    OCE__PeriodLabelBucket03__c,\
                    OCE__PeriodLabelBucket04__c,\
                    OCE__PeriodLabelBucket05__c,\
                    OCE__PeriodLabelBucket06__c,\
                    OCE__PeriodLabelBucket07__c,\
                    OCE__PeriodLabelBucket08__c,\
                    OCE__PeriodLabelBucket09__c,\
                    OCE__PeriodLabelBucket10__c,\
                    OCE__PeriodLabelBucket11__c,\
                    OCE__PeriodLabelBucket12__c,\
                    OCE__PeriodLabelBucket13__c,\
                    OCE__PeriodLabelBucket14__c,\
                    OCE__PeriodLabelBucket15__c,\
                    OCE__PeriodLabelBucket16__c,\
                    OCE__PeriodLabelBucket17__c,\
                    OCE__PeriodLabelBucket18__c,\
                    OCE__PeriodLabelBucket19__c,\
                    OCE__PeriodLabelBucket20__c,\
                    OCE__PeriodLabelBucket21__c,\
                    OCE__PeriodLabelBucket22__c,\
                    OCE__PeriodLabelBucket23__c,\
                    OCE__PeriodLabelBucket24__c,\
                    OCE__PeriodLabelBucket25__c,\
                    OCE__PeriodLabelBucket26__c,\
                    OCE__Product__r.Name FROM OCE__XponentSalesData__c\
                    Where OCE__Market__c = '${market.label}' And OCE__Measure1Total__c != null ${filter}`,
                    data => {
                    let marketData = data.records.map((item, index) => {
                        return {
                            name: item.OCE__Product__r.Name,
                            data: [
                                // {x: item.OCE__PeriodLabelBucket26__c, y: item.OCE__Measure1Bucket26__c},
                                // {x: item.OCE__PeriodLabelBucket25__c, y: item.OCE__Measure1Bucket25__c},
                                {x: item.OCE__PeriodLabelBucket24__c, y: item.OCE__Measure1Bucket24__c},
                                {x: item.OCE__PeriodLabelBucket23__c, y: item.OCE__Measure1Bucket23__c},
                                {x: item.OCE__PeriodLabelBucket22__c, y: item.OCE__Measure1Bucket22__c},
                                {x: item.OCE__PeriodLabelBucket21__c, y: item.OCE__Measure1Bucket21__c},
                                {x: item.OCE__PeriodLabelBucket20__c, y: item.OCE__Measure1Bucket20__c},
                                {x: item.OCE__PeriodLabelBucket19__c, y: item.OCE__Measure1Bucket19__c},
                                {x: item.OCE__PeriodLabelBucket18__c, y: item.OCE__Measure1Bucket18__c},
                                {x: item.OCE__PeriodLabelBucket17__c, y: item.OCE__Measure1Bucket17__c},
                                {x: item.OCE__PeriodLabelBucket16__c, y: item.OCE__Measure1Bucket16__c},
                                // {x: item.OCE__PeriodLabelBucket15__c, y: item.OCE__Measure1Bucket15__c},
                                // {x: item.OCE__PeriodLabelBucket14__c, y: item.OCE__Measure1Bucket14__c},
                                // {x: item.OCE__PeriodLabelBucket13__c, y: item.OCE__Measure1Bucket13__c},
                                // {x: item.OCE__PeriodLabelBucket12__c, y: item.OCE__Measure1Bucket12__c},
                                // {x: item.OCE__PeriodLabelBucket11__c, y: item.OCE__Measure1Bucket11__c},
                                // {x: item.OCE__PeriodLabelBucket10__c, y: item.OCE__Measure1Bucket10__c},
                            ]
                        }
                    });
                    this.setState({loading: false});
                    resolve(marketData);
                },
                error => {
                    this.setState({loading: false});
                    console.log(error);
                    reject(error);
                });
        });
    }

    render() {
        const { chartData, loading, marketList, market } = this.state;
        const { connectionStatus } = this.props;

        return (
            <View>
                <View style={styles.topButtons}>
                    {connectionStatus != 'No Connection' ? <View style={styles.refreshButton}><IconButton
                        icon="refresh"
                        color="#2bb3fe"
                        size={30}
                        animated
                        onPress={() => this.fetchMarketData()}
                        disabled={loading || !market}
                    /></View> : null}
                    <Select
                        options={marketList}
                        value={market}
                        placeholder="Select market..."
                        onChange={this.handleMarketChange}
                        label="Market"
                        disabled={loading ? true : false}
                        canDeselect={false}
                    />
                </View>

                {
                    loading &&
                    <View style={{ padding: 20 }}>
                        <ActivityIndicator animating={true} color={Colors.blue700} style={{paddingVertical: 10}}/>
                    </View>
                }
                
                {chartData.length && !loading ?
                    <LineChart
                        height={250}
                        data={chartData}
                        colorScale={colorScale}
                        style={{
                            axis: {
                                stroke: "#dadada",
                                strokeWidth: 1
                            }
                        }}
                    /> : null}
                {!chartData.length && !loading ? 
                    <View style={{alignSelf: "center", paddingTop: 50}}>
                        <Text>No Data Found</Text>
                    </View> : null}
                
            </View>
        );
    }
}

const styles = StyleSheet.create({
    topButtons: {
        width: 250,
        position: "absolute",
        right: 0,
        top: -90,
        flexDirection: 'row',
        alignItems: 'center'
    },
    refreshButton: {
        paddingTop: 25,
        marginRight: 5
    }
});
