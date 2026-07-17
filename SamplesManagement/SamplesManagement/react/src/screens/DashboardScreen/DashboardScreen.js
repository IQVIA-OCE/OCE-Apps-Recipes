import React from 'react';
import { ScrollView, View, StyleSheet, Platform } from 'react-native';
import SamplesTimelineWidget from './SamplesTimelineWidget/SamplesTimelineWidget';
import ReceivedSamplesWidget from './ReceivedSamplesWidget/ReceivedSamplesWidget';
import InventoriesWidgetContainer from './InventoriesWidget/InventoriesWidgetContainer';
import { Grid, withTheme, Text } from '@oce-apps/apollo-react-native';
import StorageLocationWidget from './StorageLocationWidget/StorageLocationWidget';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DisbursementsWidgetContainer from './DisbursementsWidget/DisbursementsWidgetContainer';
import ManageLotsWidget from './ManageLotsWidget/ManageLotsWidget';
import BannerContext from './BannerContext';

class DashboardScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    const { theme } = this.props;

    return (
      <BannerContext>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ backgroundColor: theme.colors.background }}>
            <View style={styles.screenTitleContainer}>
              <View style={[styles.screenTitle, { backgroundColor: theme.colors.surface }]}>
                <View style={styles.screenTitleIconContainer}>
                  <Icon name="medical-bag" size={26} color="white" />
                </View>
                <Text style={styles.screenTitleText}>Samples Management</Text>
              </View>
            </View>
            <Grid>
              <Grid.Container spacing={20}>
                <Grid.Item size={6}>
                  <View style={styles.widgetContainer}>
                    <DisbursementsWidgetContainer />
                  </View>
                  <View style={styles.widgetContainer}>
                    <InventoriesWidgetContainer/>
                  </View>
                  <View style={styles.widgetContainer}>
                    <ReceivedSamplesWidget />
                  </View>
                </Grid.Item>
                <Grid.Item size={6}>
                  <View style={styles.widgetContainer}>
                    <ManageLotsWidget />
                  </View>
                  <View style={styles.widgetContainer}>
                    <StorageLocationWidget />
                  </View>
                  <View style={styles.widgetContainer}>
                    <SamplesTimelineWidget />
                  </View>
                </Grid.Item>
              </Grid.Container>
            </Grid>
          </ScrollView>
      </BannerContext>
    );
  }
}

export default withTheme(DashboardScreen);

const styles = StyleSheet.create({
  screenTitleContainer: {
    paddingHorizontal: 10,
    marginTop: 20,
    marginBottom: 10,
  },
  screenTitle: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 4,
  },
  screenTitleText: {
    fontSize: 20,
    fontWeight: '300',
  },
  screenTitleIconContainer: {
    backgroundColor: '#e260ab',
    borderRadius: 2,
    padding: 3,
    justifyContent: 'center',
    marginRight: 10,
  },
  widgetContainer: {
    marginBottom: 20,
  },
});
