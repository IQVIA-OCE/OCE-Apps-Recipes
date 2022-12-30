import React from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useSelector } from 'react-redux';
import {
  callActivitySelector,
  loadingStatusSelector,
} from '../../store/ReconciliationReport/ReconciliationReportSelectors';
import { Card, Avatar, Chip, IconButton, secondaryOrange} from 'apollo-react-native';
import { ListHeader } from '../../components/ListHeader/ListHeader';
import { LOADING_STATUS } from '../../constants';
import { selectActivityData } from '../../utils';
import { ActivityListItem } from '../../components/ActivityListItem/ActivityListItem';
import { ListEmptyComponent } from '../../components/ListEmptyComponent/ListEmptyComponent';

export const ReportActivitiesScreen = ({ route, navigation }) => {
  const callActivityRecords = useSelector(callActivitySelector);
  const loadingStatus = useSelector(loadingStatusSelector);
  const isFailed = loadingStatus !== LOADING_STATUS.FAILED;
  const activitiesHeaderTitles = [
    'Call',
    'Call Status',
    'Call Location',
    'Call Territory',
    'Call DateTime',
    'Sample Name',
    'Sample Quantity',
    'Sample DTP Product',
    'DTP Product Quantity',
    'Signature Date',
    'Submitted Date',
  ];

  return (
    <Card style={styles.generalContainer}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <IconButton
            icon="chevron-left"
            color={'#0768fd'}
            size={24}
            style={styles.backIcon}
          />
          <Text style={styles.backText}>Go back</Text>
        </TouchableOpacity>

        <Card.Title
          style={styles.titles}
          title={`Account Name: ${route.params.account.accountName}`}
          subtitle={`Account Specialty: ${route.params.account.accountSpecialty}`}
          left={(props) => <Avatar.Icon {...props} icon="account-details" />}
        />
        <Chip color={'primary'} mode={'outlined'}>
          {route.params.account.limitTemplateName}
        </Chip>
      </View>

      <Text style={styles.message}>{route.params.account.errorMessage}</Text>

      <View style={styles.listWrapper}>
        <View style={styles.listContainer}>
          {callActivityRecords && isFailed && (
            <ListHeader titles={activitiesHeaderTitles} />
          )}

          <FlatList
            data={selectActivityData(callActivityRecords)}
            renderItem={({ item }) => <ActivityListItem data={item} />}
            keyExtractor={(item, index) => index}
            ListEmptyComponent={
              <ListEmptyComponent
                loadingStatus={loadingStatus}
                text="No data found"
              />
            }
          />
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  generalContainer: {
    padding: 15,
    flex: 1,
  },
  listWrapper: {
    flex: 1,
  },
  listContainer: {
    height: '100%',
  },
  loader: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  titles: {
    flex: 1,
  },
  message: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: secondaryOrange[50],
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 90,
    height: 30,
  },
  backIcon: {
    width: 10,
  },
  backText: {
    color: '#0768fd',
    fontSize: 18,
  },
});
