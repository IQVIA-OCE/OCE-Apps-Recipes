import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, utilityNegative, useTheme } from '@oce-apps/apollo-react-native';
import { useDispatch, useSelector } from 'react-redux';
import Card from '../../Card/Card';
import { attendeesListSelector } from '../../../store/attendeesSlice/attendeesSelectors';
import { fetchOutstandingSampleRequestsList } from '../../../store/outstandingSampleRequestsSlice/outstandingSampleRequestsSlice';
import {
  outstandingSampleRequestsCountSelector,
  outstandingSampleRequestsErrorSelector,
  outstandingSampleRequestsLoadingStatusSelector,
  outstandingSampleRequestsSelector,
} from '../../../store/outstandingSampleRequestsSlice/outstandingSampleRequestsSelectors';
import OutstandingSampleRequestListItem from './components/components/OutstandingSampleRequestListItem';
import { isMobilePhone } from '../../../utils/helpers';
import { LOADING_STATUS } from '../../../constants/loadingStatus';

const OutstandingSampleRequestsWidget = ({ testID = "OutstandingSR_widget" }) => {
  const theme = useTheme();

  const attendeesList = useSelector(attendeesListSelector);
  const outstandingSampleRequestsCount = useSelector(outstandingSampleRequestsCountSelector);
  const outstandingSampleRequestsList = useSelector(outstandingSampleRequestsSelector);
  const loadingStatus = useSelector(outstandingSampleRequestsLoadingStatusSelector);
  const error = useSelector(outstandingSampleRequestsErrorSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    if (attendeesList) {
      dispatch(fetchOutstandingSampleRequestsList());
    }
  }, [attendeesList]);

  const isLoaded = loadingStatus === LOADING_STATUS.LOADED;
  const isFailed = loadingStatus === LOADING_STATUS.FAILED;

  const renderContent = () => {
    if (isFailed && error) {
      return (
        <View style={styles.error} testID="outstandingSR-error">
          <Text style={[styles.errorText, { color: theme.colors.error }]}>Error fetching outstanding samples requests: {error}</Text>
        </View>
      );
    }
    if (isLoaded) {
      return (
        <ScrollView style={{ height: 300, paddingTop: 15 }} nestedScrollEnabled={true}>
        {outstandingSampleRequestsCount > 0 ? (
          outstandingSampleRequestsList.map((item) => (
            <OutstandingSampleRequestListItem name={item.Name} samples={item.samples} key={item.Id} callId={item.callId}/>
          ))
        ) : (
          <Text>There are no outstanding sample requests from your meeting participants</Text>
        )}
      </ScrollView>
      )
    }
  }

  return (
    <Card
      icon="pill"
      title="Outstanding sample requests"
      count={outstandingSampleRequestsCount}
      testID={testID}
      style={{ height: isMobilePhone ? 'auto' : 345 }}
    >
      {renderContent()}
    </Card>
  );
};

const styles = StyleSheet.create({
  notFound: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
  },
  notFoundText: {
    fontSize: 17,
  },
  error: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
  },
  errorText: {
    fontSize: 17,
    color: utilityNegative[500],
  },
});

export default OutstandingSampleRequestsWidget;
