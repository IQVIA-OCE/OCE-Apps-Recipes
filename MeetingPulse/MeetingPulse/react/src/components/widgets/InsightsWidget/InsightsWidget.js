import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Text, useTheme } from '@oce-apps/apollo-react-native';

import { fetchInsightsList } from '../../../store/insightsSlice/insightsSlice';
import {
  insightsCountSelector,
  insightsErrorSelector,
  accountsWithInsightsSelector,
  loadingStatusSelector,
} from '../../../store/insightsSlice/insightsSliceSelectors';
import Card from '../../Card/Card';
import { InsightListItem } from './components/InsightListItem/InsightListItem';
import { LOADING_STATUS } from '../../../constants/loadingStatus';

export const InsightsWidget = () => {
  const theme = useTheme();

  const loadingStatus = useSelector(loadingStatusSelector);
  const accountsWithInsights = useSelector(accountsWithInsightsSelector);
  const insightsCount = useSelector(insightsCountSelector);
  const error = useSelector(insightsErrorSelector);
  const dispatch = useDispatch();

  const isLoaded = loadingStatus === LOADING_STATUS.LOADED;
  const isFailed = loadingStatus === LOADING_STATUS.FAILED;

  useEffect(() => {
    dispatch(fetchInsightsList());
  }, []);

  const renderContent = () => {
    if (isFailed && error) {
      return (
        <View style={styles.error} testID="insights-error">
          <Text style={[styles.errorText, { color: theme.colors.error }]}>Error fetching insights: {error}</Text>
        </View>
      );
    }

    if (isLoaded) {
      if (Boolean(insightsCount)) {
        return (
          <ScrollView style={{ height: 300 }} testID="insights-list">
            {accountsWithInsights.map((a) => (
              <InsightListItem key={a.id} account={a} />
            ))}
          </ScrollView>
        );
      }

      return (
        <View style={styles.notFound} testID="insights-not-found">
          <Text style={[styles.notFoundText, { color: theme.colors.error }]}>There are no recent insights</Text>
        </View>
      );
    }
  };

  return (
    <Card icon="calendar-plus" title="Recent Insights" count={insightsCount} testID="insights-widget">
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
  },
});
