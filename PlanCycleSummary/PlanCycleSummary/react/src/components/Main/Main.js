import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getData, setSelectedPlanCycle } from '../../store/applicationSlice/applicationSlice';
import { Select, ApolloProgress, Text } from '@oce-apps/apollo-react-native';
import ProgressBar from '../ProgressBar/ProgressBar';
import {
  errorNotificationsSelector,
  errorSelector,
  isLoadingSelector,
  planCycleSelector,
  planCyclesSelector,
  workedDaysSelector,
  workingDaysSelector,
} from '../../utils/selectors';
import { calculateCycleConcluded, isIphone } from '../../utils';
import PieChart from '../PieChart/PieChart';
import { layoutBridge, logger } from '@oce-apps/oce-apps-bridges';

const Main = () => {
  const isLoading = useSelector(isLoadingSelector);
  const error = useSelector(errorSelector);
  const errorsNotifications = useSelector(errorNotificationsSelector);
  const workingDays = useSelector(workingDaysSelector);
  const workedDays = useSelector(workedDaysSelector);
  const planCycle = useSelector(planCycleSelector);
  const planCycles = useSelector(planCyclesSelector);
  const cycleConcluded = calculateCycleConcluded(workingDays, workedDays);
  const dispatch = useDispatch();

  const handleSelectOnChange = (el) => {
    if (el) {
      dispatch(setSelectedPlanCycle(el.value));
    }
  };

  useEffect(() => {
    dispatch(getData());
  }, [planCycle]);

  useEffect(() => {
    if (error) {
      layoutBridge.setHeight(150).catch((error) => {
        logger.error('layoutBridge.setHeight error: ' + error);
      });
    }
  }, [error]);

  if (error || errorsNotifications.length) {
    return (
      <View style={[styles.container, { flex: 1 }]}>
        <Text style={styles.title}>Plan Cycle Summary</Text>
        <View style={styles.errorWrapper}>
          <Text style={{ fontSize: 16 }}>{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} testID="main" scrollEnabled={isIphone}>
      <Text style={styles.title}>Plan Cycle Summary</Text>
      <Select
        placeholder="Select plan cycle"
        value={{ label: planCycle.type, value: planCycle.id }}
        disabled={isLoading || planCycles.length === 1}
        options={planCycles.map((el) => ({ label: el.type, value: el.id }))}
        onChange={handleSelectOnChange}
        style={{ marginBottom: 30 }}
        size={isIphone ? 'small' : 'medium'}
      />

      {isLoading && (
        <View style={styles.loader}>
          <ApolloProgress />
        </View>
      )}

      {!isLoading && (
        <>
          <ProgressBar value={cycleConcluded} style={{ marginBottom: 20 }} />
          <PieChart />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loader: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  title: {
    marginBottom: 15,
    fontWeight: 'bold',
    fontSize: 18,
  },
  errorWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default Main;
