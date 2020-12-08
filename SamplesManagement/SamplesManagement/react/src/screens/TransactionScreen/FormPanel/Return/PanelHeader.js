import React from 'react';
import { View, StyleSheet } from 'react-native';
import FormDetails from '../../../../components/FormDetails/FormDetails';
import moment from 'moment';
import Status from '../../../../components/Status/Status';
import { Paragraph, themeGrey } from 'apollo-react-native';
import { environment } from '../../../../../bridge/EnvironmentData/EnvironmentData.native';

const PanelHeader = () => {
  const territory = environment.territory();
  return (
    <View style={styles.container}>
      <FormDetails title="Transaction Date Time">
        <Paragraph style={{ fontSize: 16 }}>
          {moment().format('MMM D YYYY hh:mm a')}
        </Paragraph>
      </FormDetails>
      <FormDetails title="Status">
        <Status size="large" status={'In Progress'} />
      </FormDetails>
      <FormDetails title="Transaction Rep">
        <Paragraph style={{ fontSize: 16 }}>Salesrep</Paragraph>
      </FormDetails>
      <FormDetails title="Transaction Rep Territory">
        <Paragraph style={{ fontSize: 16 }}>{territory.name}</Paragraph>
      </FormDetails>
      <FormDetails title="Ship to" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: themeGrey[200],
  },
});

export default PanelHeader;
