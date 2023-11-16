import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'apollo-react-native';

import { useInterval } from '../../../../../hooks/useInterval';
import { computeTimeDiff } from '../../../../../utils/computeTimeDiff';
import { SECOND } from '../../../../../constants/time';

export const TimeAgo = ({ title, getSubtitle, startDate, endDate }) => {
  const [countdown, setCountdown] = useState(() => {
    const now = Date.now();
    const startDiffInMs = now - startDate;
    const endDiffInMs = endDate - now;
    const _timer = computeTimeDiff(endDate ? endDiffInMs : startDiffInMs);

    return {
      ..._timer,
      completed: false,
    };
  });

  const tick = () => {
    const now = Date.now();
    const startDiffInMs = now - startDate;
    const endDiffInMs = endDate - now;

    if (!endDate) {
      setCountdown(c => ({
        ...c,
        ...computeTimeDiff(startDiffInMs),
      }));

      return;
    }

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

  const timer = (
    <>
      <Text testID="timeago-days">{countdown.days}</Text> Days <Text testID="timeago-hours">{countdown.hours}</Text>{' '}
      Hours <Text testID="timeago-mins">{countdown.minutes}</Text> Mins
    </>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.timerTitle}>{title}</Text>
      <View style={styles.timerSubtitle}>
        <Text style={styles.timerSubtitleText}>{getSubtitle({ timer })}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  timerTitle: {
    fontSize: 36,
    marginBottom: 12,
  },
  timerSubtitle: {
    flexDirection: 'row',
    fontSize: 22,
  },
  timerSubtitleText: {
    fontSize: 22,
  },
});
