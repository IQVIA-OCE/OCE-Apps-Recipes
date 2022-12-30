import React, { useEffect, useRef } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  accountRecordsSelector,
  limitErrorRecordsSelector,
  loadingStatusSelector,
  searchAccountQuerySelector,
  sortFieldSelector,
  sortOrderSelector,
  templateFilterSelector,
} from '../../store/ReconciliationReport/ReconciliationReportSelectors';
import {
  fetchReportData,
  fetchMoreReportData,
  setAccountData,
} from '../../store/ReconciliationReport/ReconciliationReportSlice';
import { LOADING_STATUS, isIphone } from '../../constants';
import { selectAccountData } from '../../utils';
import { AccountListItem } from './AccountListItem/AccountListItem';
import { ListEmptyComponent } from '../ListEmptyComponent/ListEmptyComponent';
import { ListHeader } from '../ListHeader/ListHeader';
import { ApolloProgress } from 'apollo-react-native';

export const AccountList = ({ navigation }) => {
  const dispatch = useDispatch();
  const limitErrorRecords = useSelector(limitErrorRecordsSelector);
  const accountRecords = useSelector(accountRecordsSelector);
  const searchQuery = useSelector(searchAccountQuerySelector);
  const templateFilter = useSelector(templateFilterSelector);
  const sortField = useSelector(sortFieldSelector);
  const sortOrder = useSelector(sortOrderSelector);

  const loadingStatus = useSelector(loadingStatusSelector);
  const isLoading = loadingStatus === LOADING_STATUS.PENDING;
  const isFailed = loadingStatus === LOADING_STATUS.FAILED;
  const isFetchingMore = loadingStatus === LOADING_STATUS.FETCHING_MORE;
  const stopFetchMore = useRef(true);

  const accountTitles = [
    'Account Name',
    'Account Specialty',
    'Sample Product',
    'Limit Template',
    'Period',
    'Quota',
    'Remaining',
  ];

  useEffect(() => {
    handleFetch();
  }, [searchQuery, templateFilter, sortField, sortOrder]);

  const handleFetch = () => {
    dispatch(fetchReportData());
    dispatch(setAccountData());
  };

  const handleFetchMore = () => {
    if (!stopFetchMore.current) {
      dispatch(fetchMoreReportData());
      stopFetchMore.current = true;
    }
  };

  return (
    <View style={styles.listWrapper}>
      {isFetchingMore && <ApolloProgress style={styles.loader} />}

      <View style={styles.listContainer}>
        {!isIphone && limitErrorRecords && !isFailed && (
          <ListHeader titles={accountTitles} />
        )}

        <FlatList
          testID="reports-list"
          data={selectAccountData(accountRecords)}
          renderItem={({ item }) => (
            <AccountListItem data={item} navigation={navigation} />
          )}
          keyExtractor={(item, index) => index}
          onEndReached={handleFetchMore}
          onEndReachedThreshold={0.5}
          refreshing={isLoading}
          onRefresh={handleFetch}
          onScroll={() => {
            stopFetchMore.current = false;
          }}
          ListEmptyComponent={
            <ListEmptyComponent
              loadingStatus={loadingStatus}
              text="No data found"
            />
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  generalContainer: {
    padding: 15,
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingTop: 10,
    marginRight: 20,
  },
  selectInput: {
    marginRight: 10,
  },
  listWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  listContainer: {
    flex: 1,
    position: 'absolute',
    width: '100%',
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
});
