import React, { useCallback } from 'react';
import { View } from 'react-native';
import {
  Card,
  IconMenuButton,
  Tabs,
  ActivityIndicator,
  useTheme,
} from '@oce-apps/apollo-react-native';
import TimelineComponent from './timeline/Timeline';
import moment from 'moment';
import ViewAll from '../../../components/ViewAll/ViewAll';
import {
  fetchOrdersData,
  fetchOrdersListId,
  fetchTransactionsData,
  fetchTransactionsListId,
} from '../../../api/SamplesTimeline';
import { mapOrders, mapTransactions } from './utils';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { NAMESPACE } from '../../../constants/constants';

function FetchData({ route, navigation, onUpdate }) {
  useFocusEffect(
    useCallback(() => {
      if (route.params && route.params.refreshSamplesTimelineWidget) {
        onUpdate();
      }
      return () => {
        navigation.setParams({
          refreshSamplesTimelineWidget: false,
        });
      };
    }, [route.params?.refreshSamplesTimelineWidget])
  );
  return null;
}

class SamplesTimelineWidget extends React.Component {
  state = {
    transactionsList: [],
    ordersList: [],
    allItemsList: [],
    transactionsListId: null,
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
      const transactionsData = await fetchTransactionsData(limit);
      const ordersData = await fetchOrdersData(limit);
      const transactionsList = mapTransactions(transactionsData[0]);
      const transactionsListId = await fetchTransactionsListId();
      const ordersListId = await fetchOrdersListId();
      const ordersList = mapOrders(ordersData[0]);
      const allItemsList = [...transactionsList, ...ordersList].sort(
        (a, b) =>
          moment(b.lastModifiedDate).valueOf() -
          moment(a.lastModifiedDate).valueOf()
      );

      this.setState({
        transactionsList,
        transactionsListId: transactionsListId[0][0].Id,
        ordersListId: ordersListId[0][0].Id,
        ordersList,
        allItemsList: allItemsList.slice(0, 6),
        isLoading: false,
        syncDateLabel: moment().format('dddd MMM D, YYYY hh:mm A'),
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
      transactionsList,
      ordersList,
      allItemsList,
      syncDateLabel,
      transactionsListId,
      ordersListId,
      isLoading,
    } = this.state;

    const {route, navigation, theme} = this.props;

    const menuItems = [
      {
        text: 'Transaction',
        onPress: () => this.props.navigation.navigate('RecordTypeSelector'),
      },
      {
        text: 'Order',
        onPress: () => this.props.navigation.navigate('SampleOrder'),
      },
    ];

    const subtitle = syncDateLabel ? `As of ${syncDateLabel}` : '';

    return (
      <>
        <FetchData navigation={navigation} route={route} onUpdate={() => this.getTimeLineData(6)} />
        <Card>
          <Card.Title
            title="Samples Timeline"
            subtitle={subtitle}
            right={() => <IconMenuButton size="small" menuItems={menuItems} />}
          />
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
                  <Tabs.Button text="Transactions" />
                  <Tabs.Button text="Orders" />
                </Tabs.ButtonsContainer>
                <Tabs.Container>
                  <Tabs.Item>
                    <TimelineComponent
                      items={allItemsList}
                      navigation={this.props.navigation}
                    />
                  </Tabs.Item>
                  <Tabs.Item>
                    <TimelineComponent
                      items={transactionsList}
                      navigation={this.props.navigation}
                    />
                    {transactionsListId && transactionsList.length ? (
                      <ViewAll
                        url={`{EndPoint}&retURL=%2Flightning%2Fo%2F${NAMESPACE}SampleTransaction__c%2Flist%3FfilterName%3D${transactionsListId}`}
                      />
                    ) : null}
                  </Tabs.Item>
                  <Tabs.Item>
                    <TimelineComponent
                      items={ordersList}
                      navigation={this.props.navigation}
                    />
                    {ordersListId && ordersList.length ? (
                      <ViewAll
                        url={`{EndPoint}&retURL=%2Flightning%2Fo%2F${NAMESPACE}SampleOrder__c%2Flist%3FfilterName%3D${ordersListId}`}
                      />
                    ) : null}
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

export default () => {
  const navigation = useNavigation();
  const route = useRoute();
  const theme = useTheme();

  return <SamplesTimelineWidget navigation={navigation} route={route} theme={theme} />;
};
