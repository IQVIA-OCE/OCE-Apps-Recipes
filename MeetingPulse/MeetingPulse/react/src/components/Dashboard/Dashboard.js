import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import AttendeesWidget from '../widgets/AttendeesWidget/AttendeesWidget';
import { CountdownWidget } from '../widgets/CountdownWidget/CountdownWidget';
import EstimatedCostWidget from '../widgets/EstimatedCostWidget/EstimatedCostWidget';
import { isIphone } from '../../utils/helpers';
import { InsightsWidget } from '../widgets/InsightsWidget/InsightsWidget';
import OutstandingSampleRequestsWidget from '../widgets/OutstandingSampleRequestsWidget/OutstandingSampleRequestsWidget';
import { InquiriesWidget } from '../widgets/InquiriesWidget/InquiriesWidget';
import { Grid } from 'apollo-react-native';

const Dashboard = () => {
  return (
    <ScrollView>
      <Grid>
        <Grid.Container spacing={isIphone ? 10 : 15}>
          <Grid.Item size={isIphone ? 12 : 4}>
            <AttendeesWidget />
          </Grid.Item>
          <Grid.Item size={isIphone ? 12 : 4}>
            <CountdownWidget />
            <OutstandingSampleRequestsWidget />
          </Grid.Item>
          <Grid.Item size={isIphone ? 12 : 4}>
            <EstimatedCostWidget />
            <InquiriesWidget />
          </Grid.Item>
          <Grid.Item size={isIphone ? 12 : 4}>
            <InsightsWidget />
          </Grid.Item>
        </Grid.Container>
      </Grid>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
  },
});
export default Dashboard;
