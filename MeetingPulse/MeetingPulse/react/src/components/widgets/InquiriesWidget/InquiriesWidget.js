import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Text, utilityNegative, useTheme } from 'apollo-react-native';

import Card from '../../Card/Card';
import {
  accountsWithInquiriesSelector,
  loadingStatusSelector,
  inquiriesCountSelector,
  inquiriesErrorSelector,
} from '../../../store/inquiriesSlice/inquiriesSliceSelectors';
import { fetchAccountsWithInquiryQuestions } from '../../../store/inquiriesSlice/inquiriesSlice';
import { InquiryListItem } from './components/InquiryListItem/InquiryListItem';
import { LOADING_STATUS } from '../../../constants/loadingStatus';
import { isIphone } from '../../../utils/helpers';

export const InquiriesWidget = () => {
  const theme = useTheme();

  const loadingStatus = useSelector(loadingStatusSelector);
  const accountsWithInquiries = useSelector(accountsWithInquiriesSelector);
  const inquiriesCount = useSelector(inquiriesCountSelector);
  const error = useSelector(inquiriesErrorSelector);
  const dispatch = useDispatch();

  const isLoaded = loadingStatus === LOADING_STATUS.LOADED;
  const isFailed = loadingStatus === LOADING_STATUS.FAILED;

  useEffect(() => {
    dispatch(fetchAccountsWithInquiryQuestions());
  }, []);

  const renderContent = () => {
    if (isFailed && error) {
      return (
        <View style={styles.error} testID="inquiries-error">
          <Text style={[styles.errorText, { color: theme.colors.error }]}>Error fetching inquiries: {error}</Text>
        </View>
      );
    }

    if (isLoaded) {
      if (Boolean(inquiriesCount)) {
        return (
          <ScrollView style={{ height: 300 }} testID="inquiries-list">
            {accountsWithInquiries.map((a) => (
              <InquiryListItem key={a.id} account={a} />
            ))}
          </ScrollView>
        );
      }

      return (
        <View style={styles.notFound} testID="inquiries-not-found">
          <Text style={[styles.notFoundText, { color: theme.colors.error }]}>
            There are no recent inquiries from your meeting participants
          </Text>
        </View>
      );
    }
  };

  return (
    <Card
      icon="calendar-plus"
      title="Recent Inquiries"
      count={inquiriesCount}
      testID="inquiries-widget"
      style={{ height: isIphone ? 'auto' : 413 }}
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
