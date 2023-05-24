import React, { useCallback } from 'react';
import { View } from 'react-native';
import { Card, Tabs, ActivityIndicator, withTheme } from 'apollo-react-native';
import TimelineComponent from './Timeline/Timeline';
import moment from 'moment';
import ViewAll from '../../../components/ViewAll/ViewAll';
import {
  fetchReceivedSamplesData,
  fetchReceivedSamplesListId,
} from '../../../api/ReceivedSamples';
import { mapReceivedSamples } from './utils';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { NAMESPACE } from '../../../constants/constants';

function FetchData({ route, navigation, onUpdate }) {
  useFocusEffect(
    useCallback(() => {
      if (route.params && route.params.refreshReceivedTimelineWidget) {
        onUpdate();
      }
      return () => {
        navigation.setParams({
          refreshReceivedTimelineWidget: false,
        });
      };
    }, [route.params?.refreshReceivedTimelineWidget])
  );
  return null;
}

class ReceivedSamplesWidget extends React.Component {
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
  }

  getTimeLineData = async limit => {
    try {
      this.setState({ isLoading: true });
      const transferInData = await fetchReceivedSamplesData(
        limit,
        'TransferIn'
      );
      const transferInList = mapReceivedSamples(transferInData[0]);
      const acknowledgementOfShipmentData = await fetchReceivedSamplesData(
        limit,
        'AcknowledgementOfShipment'
      );
      const acknowledgementOfShipmentList = mapReceivedSamples(
        acknowledgementOfShipmentData[0]
      );
      const allReceivedSamplesList = [
        ...transferInList,
        ...acknowledgementOfShipmentList,
      ].sort(
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
    const { theme, navigation, route } = this.props;

    return (
      <>
        <FetchData
          navigation={navigation}
          route={route}
          onUpdate={() => this.getTimeLineData(6)}
        />

        <Card testID="ReceivedSamplesWidget">
          <Card.Title title="Received Samples" />
          <Card.Content>
            {isLoading ? (
              <View style={{ padding: 20 }}>
                <ActivityIndicator
                  animating={true}
                  color={theme.colors.primary}
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
                    <TimelineComponent
                      items={allReceivedSamplesList}
                      navigation={navigation}
                    />
                    {receivedSamplesListId && allReceivedSamplesList.length ? (
                      <ViewAll
                        url={`{EndPoint}&retURL=%2Flightning%2Fo%2F${NAMESPACE}SampleTransaction__c%2Flist%3FfilterName%3D${receivedSamplesListId}`}
                      />
                    ) : null}
                  </Tabs.Item>
                  <Tabs.Item>
                    <TimelineComponent
                      items={acknowledgementOfShipmentList}
                      navigation={navigation}
                    />
                  </Tabs.Item>
                  <Tabs.Item>
                    <TimelineComponent
                      items={transferInList}
                      navigation={navigation}
                    />
                  </Tabs.Item>
                </Tabs.Container>
              </Tabs>
            )}
          </Card.Content>
        </Card>
      </>
    );
  }
}

const Wrapped = ({ theme }) => {
  const navigation = useNavigation();
  const route = useRoute();

  return <ReceivedSamplesWidget navigation={navigation} theme={theme} route={route} />;
};

export default withTheme(Wrapped);
