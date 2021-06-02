import React from 'react';
import { View } from 'react-native';
import {
  Card,
  Tabs,
  ActivityIndicator,
  Colors,
} from 'apollo-react-native';
import TimelineComponent from './Timeline/Timeline';
import moment from 'moment';
import ViewAll from '../../../components/ViewAll/ViewAll';
import {
  fetchReceivedSamplesData,
  fetchReceivedSamplesListId,
} from '../../../api/ReceivedSamples';
import { mapReceivedSamples } from './utils';

export default class ReceivedSamplesWidget extends React.Component {
  state = {
    allReceivedSamplesList: [],
    acknowledgementOfShipmentList: [],
    transferInList: [],
    receivedSamplesListId: null,
    isLoading: false,
    syncDateLabel: '',
  };

  focusListener = null;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.getTimeLineData(6);
    this.focusListener = this.props.navigation.addListener('willFocus', () =>
      this.getTimeLineData(6)
    );
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  getTimeLineData = async limit => {
    try {
      this.setState({ isLoading: true });
      const transferInData = await fetchReceivedSamplesData(limit, "TransferIn");
      const transferInList = mapReceivedSamples(transferInData[0]);
      const acknowledgementOfShipmentData = await fetchReceivedSamplesData(limit, "AcknowledgementOfShipment");
      const acknowledgementOfShipmentList = mapReceivedSamples(acknowledgementOfShipmentData[0]);

      const allReceivedSamplesList = [...transferInList, ...acknowledgementOfShipmentList].sort(
        (a, b) =>
          moment(b.lastModifiedDate).valueOf() -
          moment(a.lastModifiedDate).valueOf()
      );
      
      const receivedSamplesListId = await fetchReceivedSamplesListId();
      
      this.setState({
        transferInList,
        acknowledgementOfShipmentList,
        receivedSamplesListId: receivedSamplesListId[0][0].Id,
        allReceivedSamplesList: allReceivedSamplesList.slice(0, 4),
        isLoading: false,
      });
    } catch (error) {
      console.log(error);
      this.setState({
        isLoading: false,
      });
    }
  };

  render() {
    const {
      transferInList,
      acknowledgementOfShipmentList,
      allReceivedSamplesList,
      receivedSamplesListId,
      isLoading,
    } = this.state;

    const {navigation} = this.props;

    return (
      <Card>
        <Card.Title
          title="Received Samples"
        />
        <Card.Content>
          {isLoading ? (
            <View style={{ padding: 20 }}>
              <ActivityIndicator
                animating={true}
                color={Colors.blue}
                style={{ paddingVertical: 10 }}
              />
            </View>
          ) : (
            <Tabs defaultActiveIndex={1}>
              <Tabs.ButtonsContainer>
                <Tabs.Button text="All" />
                <Tabs.Button text="Acknowledgement of Shipment" />
                <Tabs.Button text="Transfer In" />
              </Tabs.ButtonsContainer>
              <Tabs.Container>
                <Tabs.Item>
                  <TimelineComponent items={allReceivedSamplesList} navigation={this.props.navigation}/>
                  {receivedSamplesListId && allReceivedSamplesList.length ? (
                    <ViewAll
                      url={`{EndPoint}&retURL=%2Flightning%2Fo%2FOCE__SampleTransaction__c%2Flist%3FfilterName%3D${receivedSamplesListId}`}
                    />
                  ) :  null}
                </Tabs.Item>
                <Tabs.Item>
                  <TimelineComponent items={acknowledgementOfShipmentList} navigation={this.props.navigation}/>
                </Tabs.Item>
                <Tabs.Item>
                  <TimelineComponent items={transferInList} navigation={this.props.navigation}/>
                </Tabs.Item>
              </Tabs.Container>
            </Tabs>
          )}
        </Card.Content>
      </Card>
    );
  }
}
