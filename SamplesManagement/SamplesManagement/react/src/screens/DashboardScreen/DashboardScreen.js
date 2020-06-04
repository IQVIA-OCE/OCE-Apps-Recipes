import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import SamplesTimelineWidget from './SamplesTimelineWidget/SamplesTimelineWidget';
import InventoriesWidgetContainer from './InventoriesWidget/InventoriesWidgetContainer';
import { Grid } from 'apollo-react-native';
import StorageLocationWidget from './StorageLocationWidget/StorageLocationWidget';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class DashboardScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    return (
      <ScrollView>
        <View style={styles.screenTitleContainer}>
          <View style={styles.screenTitle}>
            <View style={styles.screenTitleIconContainer}>
              <Icon name="medical-bag" size={26} color="white" />
            </View>
            <Text style={styles.screenTitleText}>Samples Management</Text>
          </View>
        </View>
        <Grid>
          <Grid.Container spacing={20}>
            <Grid.Item size={6}>
              <InventoriesWidgetContainer navigation={this.props.navigation} />
            </Grid.Item>
            <Grid.Item size={6}>
              <View style={styles.widgetContainer}>
                <StorageLocationWidget navigation={this.props.navigation} />
              </View>
              <View style={styles.widgetContainer}>
                <SamplesTimelineWidget navigation={this.props.navigation}/>
              </View>
            </Grid.Item>
          </Grid.Container>
        </Grid>
      </ScrollView>
    );
  }
}

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
    backgroundColor: '#f3f2f2',
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
