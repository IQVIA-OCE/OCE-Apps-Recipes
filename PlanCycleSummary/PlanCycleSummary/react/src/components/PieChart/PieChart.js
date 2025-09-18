import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@oce-apps/apollo-react-native';
import { VictoryPie } from './victory';
import { useSelector } from 'react-redux';
import {
  daysToCloseSelector,
  holidayHoursSelector,
  hoursInWorkDaySelector,
  planCycleSelector,
  totDaysSelector,
  weekendsSelector,
  workedDaysSelector,
  workingDaysSelector,
} from '../../utils/selectors';
import { getDaysBetween, isIphone, isWeb, truncateToOneDecimal } from '../../utils';

const PieChart = () => {
  const workedDays = useSelector(workedDaysSelector);
  const daysToClose = useSelector(daysToCloseSelector);
  const totDays = useSelector(totDaysSelector);
  const workingDays = useSelector(workingDaysSelector);
  const planCycle = useSelector(planCycleSelector);
  const hoursInWorkDay = useSelector(hoursInWorkDaySelector);
  const holidayHours = useSelector(holidayHoursSelector);
  const holidayDays = truncateToOneDecimal(holidayHours / hoursInWorkDay);
  const weekendsCount = useSelector(weekendsSelector);
  const planCycleLength = getDaysBetween(planCycle.startDate, planCycle.endDate);

  const data = [
    { x: 'Worked Days', y: truncateToOneDecimal(workedDays), color: '#224389' },
    { x: 'Working Days Remaining', y: truncateToOneDecimal(daysToClose), color: '#9B59B6' },
    { x: 'Holidays', y: holidayDays, color: '#FFD633' },
    { x: 'TOT Days', y: truncateToOneDecimal(totDays), color: '#FF5733' },
    { x: 'Weekends', y: weekendsCount, color: '#3a921f' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <Text style={styles.chartText}>
          {planCycleLength} {'\n'} Days
        </Text>
        <View style={{ position: 'absolute' }}>
          <VictoryPie
            data={data}
            width={320}
            height={320}
            labelComponent={null}
            innerRadius={isIphone ? 95 : 90}
            colorScale={data.map((el) => el.color)}
            style={{
              parent: {
                margin: isWeb ? 0 : -50,
              },
            }}
          />
        </View>
      </View>
      <View>
        <Text style={styles.totalWorkingDaysText}>
          Total Working Days <Text style={{ fontWeight: 'bold' }}>{truncateToOneDecimal(workingDays)}</Text>
        </Text>
        <View>
          {data.map((el) => (
            <View style={styles.legendItem} key={el.x}>
              <View style={[styles.legendItemColor, { backgroundColor: el.color }]} />
              <Text style={styles.legendItemText}>
                <Text style={{ fontWeight: 'bold', fontSize: isIphone ? 16 : 18 }}>{el.y}</Text> {el.x}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: isIphone ? 'column' : 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: isIphone || isWeb ? 0 : 30,
  },
  chartContainer: {
    width: isWeb ? 300 : 230,
    height: isWeb ? 300 : 230,
    marginRight: isIphone ? 0 : (isWeb ? 20 : 50),
    marginBottom: isIphone ? 20 : 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartText: {
    textAlign: 'center',
    fontSize: isIphone ? 16 : 22,
    fontWeight: 'bold',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  legendItemColor: {
    width: isIphone ? 15 : 20,
    height: isIphone ? 15 : 20,
    borderRadius: isIphone ? 7.5 : 10,
    overflow: 'hidden',
    marginRight: 10,
  },
  legendItemText: {
    fontSize: isIphone ? 14 : 16,
  },
  totalWorkingDaysText: {
    fontSize: isIphone ? 16 : 19,
    marginBottom: isIphone ? 10 : 20,
  },
});

export default PieChart;
