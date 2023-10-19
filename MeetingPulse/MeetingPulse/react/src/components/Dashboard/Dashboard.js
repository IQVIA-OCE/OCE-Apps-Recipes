import React from 'react';
import { ScrollView } from 'react-native';
import AttendeesWidget from '../widgets/AttendeesWidget/AttendeesWidget';
import { CountdownWidget } from '../widgets/CountdownWidget/CountdownWidget';
import EstimatedCostWidget from '../widgets/EstimatedCostWidget/EstimatedCostWidget';
import { isIphone } from '../../utils/helpers';
import { InsightsWidget } from '../widgets/InsightsWidget/InsightsWidget';
import OutstandingSampleRequestsWidget from '../widgets/OutstandingSampleRequestsWidget/OutstandingSampleRequestsWidget';
import { InquiriesWidget } from '../widgets/InquiriesWidget/InquiriesWidget';
import { Grid, useTheme } from 'apollo-react-native';

const Dashboard = () => {
  const theme = useTheme();

  return (
    <ScrollView style={{ backgroundColor: theme.colors.background}}>
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

export default Dashboard;
