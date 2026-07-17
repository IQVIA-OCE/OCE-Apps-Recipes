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
import { Card, Avatar, Chip, IconButton, useTheme } from '@oce-apps/apollo-react-native';
import { ListHeader } from '../../components/ListHeader/ListHeader';
import { LOADING_STATUS } from '../../constants';
import { selectActivityData } from '../../utils';
import { ActivityListItem } from '../../components/ActivityListItem/ActivityListItem';
import { ListEmptyComponent } from '../../components/ListEmptyComponent/ListEmptyComponent';
import color from 'color';

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
  const theme = useTheme();

  return (
    <Card style={styles.generalContainer}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <IconButton
            icon="chevron-left"
            color={theme.colors.primary}
            size={16}
            style={styles.backIcon}
          />
          <Text style={[styles.backText, {color: theme.colors.primary}]}>Go back</Text>
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

      <Text style={[styles.message, {
        backgroundColor: color(theme.colors.warning).lighten(0.88).hex(),
        borderColor: theme.colors.surface,
      }]}>{route.params.account.errorMessage}</Text>

      <FlatList
        data={selectActivityData(callActivityRecords)}
        renderItem={({ item }) => <ActivityListItem data={item} />}
        ListHeaderComponent={ callActivityRecords && isFailed && <ListHeader titles={activitiesHeaderTitles} />}
        keyExtractor={(item, index) => index}
        stickyHeaderIndices={[0]}
        ListEmptyComponent={
          <ListEmptyComponent
            loadingStatus={loadingStatus}
            text="No data found"
          />
        }
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  generalContainer: {
    padding: 15,
    flex: 1,
    borderRadius: 0,
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
    borderWidth: 2,
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
    fontSize: 18,
  },
});
