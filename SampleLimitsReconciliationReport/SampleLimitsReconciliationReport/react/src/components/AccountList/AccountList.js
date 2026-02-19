import React, { useEffect, useRef } from 'react';
import { FlatList, StyleSheet, View, Platform } from 'react-native';
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
import { ApolloProgress, useTheme } from '@oce-apps/apollo-react-native';
import color from 'color';

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

  const theme = useTheme();

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
    <View style={[styles.listContainer, { paddingBottom: Platform.OS === 'web' ? 60 : 120}]}>
      { isFetchingMore && <ApolloProgress style={[ styles.loader, { backgroundColor: color(theme.colors.surface).alpha(0.8).rgb().string() }]} />}

      <FlatList
        testID="reports-list"
        data={selectAccountData(accountRecords)}
        renderItem={({ item }) => (
          <AccountListItem data={item} navigation={navigation} />
        )}
        ListHeaderComponent={ !isIphone && limitErrorRecords && !isFailed && <ListHeader titles={accountTitles} />}
        keyExtractor={(item, index) => index}
        stickyHeaderIndices={[0]}
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
  );
};

const styles = StyleSheet.create({
  listContainer: {
    height: '100vh',
    paddingTop: 10
  },
  loader: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});
