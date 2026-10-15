import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { themeGrey, Text } from '@oce-apps/apollo-react-native';

import { useInterval } from '../../../../../hooks/useInterval';
import { computeTimeDiff } from '../../../../../utils/computeTimeDiff';
import { SECOND } from '../../../../../constants/time';

export const Countdown = ({ endDate }) => {
  const [countdown, setCountdown] = useState(() => {
    const now = Date.now();
    const endDiffInMs = endDate - now;

    return {
      ...computeTimeDiff(endDiffInMs),
      completed: false,
    };
  });

  const tick = () => {
    const now = Date.now();
    const endDiffInMs = endDate - now;

    if (endDiffInMs > 0) {
      setCountdown(c => ({
        ...c,
        ...computeTimeDiff(endDiffInMs),
      }));
    } else {
      setCountdown(c => ({
        ...c,
        completed: true,
      }));
    }
  };

  useInterval(
    () => {
      tick();
    },
    !countdown.completed ? SECOND : 0
  );

  return (
    <View style={styles.container}>
      <View style={styles.timeItem}>
        <Text style={styles.timeItemValue} testID="countdown-days">
          {countdown.days}
        </Text>
        <Text style={styles.timeItemText}>days</Text>
      </View>
      <View style={styles.timeItem}>
        <Text style={styles.timeItemValue} testID="countdown-hours">
          {countdown.hours}
        </Text>
        <Text style={styles.timeItemText}>hours</Text>
      </View>
      <View style={styles.timeItem}>
        <Text style={styles.timeItemValue} testID="countdown-mins">
          {countdown.minutes}
        </Text>
        <Text style={styles.timeItemText}>mins</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  timeItem: {
    marginRight: 'auto',
  },
  timeItemValue: {
    fontSize: 28,
    marginBottom: 8,
  },
  timeItemText: {
    textTransform: 'uppercase',
    fontSize: 16,
    fontWeight: 'bold',
    color: themeGrey[900],
  },
});
