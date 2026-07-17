import React, { useEffect, useRef, useState } from 'react';
import { Card, LineChart, Text } from '@oce-apps/apollo-react-native';
import { View, StyleSheet, Animated } from 'react-native';
import { useBoolean, useFetcher, useHandleData } from '../../../hooks';
import { fetchDisbursements } from '../../../api/Disbursements';
import { handleFilterData, normalizeDisbursements } from './utils';
import moment from 'moment';
import HeaderControls from './HeaderControls';

const items = [
  { label: 'Last 3 Months', id: '2' },
  { label: 'Last 6 Months', id: '5' },
  { label: 'Last 12 Months', id: '11' },
];

const maxTickCount = 5;

const DisbursementsWidgetContainer = () => {
  const [chartVisible, setChartVisibleAction] = useBoolean(false);
  const [period, setPeriod] = useState(items[0]);
  const [filtered, setFilter] = useState({ colors: [], ids: [] });
  const timeout = useRef();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const date = moment()
    .startOf('month')
    .subtract(period.id, 'months')
    .format('YYYY-MM-DD');
  const [disbursements] = useFetcher(
    async () => fetchDisbursements(date),
    normalizeDisbursements(period.id),
    [period.id]
  );

  const hideChart = () => {
    setChartVisibleAction.setFalse();
    fadeAnim.resetAnimation();
  };

  useEffect(() => {
    if (disbursements.data && disbursements.data.allIds) {
      setFilter({
        ids: disbursements.data.allIds,
        colors: disbursements.data.colors,
      });
    }
  }, [disbursements.data && disbursements.data.allIds]);

  useEffect(() => {
    if (filtered.ids.length) {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
      timeout.current = setTimeout(setChartVisibleAction.setTrue, 700);
    } else {
      hideChart();
    }
  }, [filtered.ids]);

  useEffect(() => {
    hideChart();
  }, [period.id]);

  useEffect(() => {
    if (chartVisible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [chartVisible]);

  const handleFilter = id => {
    hideChart();

    setFilter(() => handleFilterData(id, filtered, disbursements));
  };

  return (
    <Card>
      <Card.Title
        title="Disbursements"
        rightStyle={styles.filterContainer}
        right={() => (
          <HeaderControls
            items={items}
            period={period}
            setPeriod={setPeriod}
            disbursements={disbursements}
            filtered={filtered.ids}
            setFilter={handleFilter}
          />
        )}
      />
      <Card.Content>
        <View>
          {useHandleData(disbursements)(data => (
            <>
              {filtered.ids.length ? (
                chartVisible ? (
                  <Animated.View style={{ opacity: fadeAnim }}>
                    <LineChart
                      scaleX="time"
                      data={filtered.ids.map(id => data.byId[id])}
                      colorScale={filtered.colors}
                      tickCount={
                        period.id > maxTickCount
                          ? maxTickCount
                          : Number(period.id)
                      }
                      tickFormatX={x => {
                        return moment(x).format('MMM YY');
                      }}
                      formatTooltipText={labels => {
                        return labels.length < 5
                          ? labels
                          : labels.slice(0, 5).concat('...');
                      }}
                    />
                  </Animated.View>
                ) : (
                  <Text>Calculating data.</Text>
                )
              ) : (
                <Text>No available Disbursements.</Text>
              )}
            </>
          ))}
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    flex: 3,
  },
});

export default DisbursementsWidgetContainer;
