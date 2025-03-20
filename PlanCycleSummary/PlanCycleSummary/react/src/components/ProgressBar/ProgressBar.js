import React, { useState } from 'react';
import { DateTime } from 'luxon';
import { View, StyleSheet } from 'react-native';
import { LinearProgress, Text, useTheme } from '@oce-apps/apollo-react-native';
import { useSelector } from 'react-redux';
import { planCycleSelector } from '../../utils/selectors';
import { getFormattedDate, isIphone } from '../../utils';
import useHintPosition from '../../hooks/useHintPosition';

const ProgressBar = ({ value, style }) => {
  const [hintWidth, setHintWidth] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);
  const planCycle = useSelector(planCycleSelector);
  const theme = useTheme();

  const hintPosition = useHintPosition(value, hintWidth, progressWidth);

  return (
    <View style={[styles.container, style]} testID="progress-bar">
      <View
        testID="hint-container"
        style={[styles.hintContainer, { left: hintPosition }]}
        onLayout={(e) => setHintWidth(e.nativeEvent.layout.width)}
      >
        <Text style={[styles.text, { backgroundColor: theme.colors.primary, fontSize: isIphone ? 12 : 14 }]}>
          {getFormattedDate(DateTime.now().toISO())}
        </Text>
      </View>
      <LinearProgress
        value={value}
        variant="determinate"
        style={{ marginBottom: 15 }}
        onLayout={(e) => setProgressWidth(e.nativeEvent.layout.width)}
      />
      <View style={styles.bottomTextContainer}>
        <Text style={styles.bottomText}>
          {getFormattedDate(planCycle.startDate)}
        </Text>
        <Text style={styles.cycleConcludedText}>
          <Text style={{ fontWeight: 'bold' }}>{value}%</Text> of Cycle Concluded
        </Text>
        <Text style={styles.bottomText}>{getFormattedDate(planCycle.endDate)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
  },
  hintContainer: {
    position: 'absolute',
    top: -10,
    flexDirection: 'row',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    padding: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  bottomTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  bottomText: {
    fontWeight: 'bold',
    fontSize: isIphone ? 14 : 16
  },
  cycleConcludedText: {
    fontSize: isIphone ? 12 : 16
  }
});
export default ProgressBar;
