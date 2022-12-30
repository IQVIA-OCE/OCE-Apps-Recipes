import { LinearProgress } from 'apollo-react-native';
import React from 'react';
import { useSelector } from 'react-redux';
import { View, Text, StyleSheet } from 'react-native';
import { accountSelector } from '../../store/applicationSlice/applicationSelectors';

const ThresholdValueTooltip = ({ extended }) => {
  const {
    activityPlan: { allowedThreshold, apcrApproved, relatedGoalsSize },
  } = useSelector(accountSelector);

  const changesDonePercent = Math.round(
    (apcrApproved * 100) / relatedGoalsSize
  );
  if (extended) {
    return (
      <View style={styles.containerExtended}>
        <Text style={styles.titleExtended}>Threshold Value</Text>
        <View style={styles.rowExtended}>
          <Text style={styles.text}>Overall Account Activity</Text>
        </View>
        <View style={styles.rowExtended}>
          <Text style={styles.text}>Changes Done: {changesDonePercent}%</Text>
        </View>
        <View style={styles.rowExtended}>
          <LinearProgress value={changesDonePercent} />
        </View>
        <View style={styles.rowExtended}>
          <Text style={styles.text}>
            Allowed Threshold: {allowedThreshold}%
          </Text>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Threshold Value</Text>
      <View style={styles.row}>
        <Text style={styles.text}>Overall Account Activity</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>Changes Done: {changesDonePercent}%</Text>
      </View>
      <View style={styles.row}>
        <LinearProgress value={changesDonePercent} />
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>Allowed Threshold: {allowedThreshold}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 10,
  },
  titleExtended: {
    paddingVertical: 0,
    paddingBottom: 20
  },
  container: {
    width: 215,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  containerExtended: {
    width: '100%',
    paddingHorizontal: 5,
  },
  row: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 5,
  },
  rowExtended: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 20,
  },
  text: {
    color: '#b1b1b1',
  },
});

export default ThresholdValueTooltip;
