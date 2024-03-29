import React from 'react';
import { View, StyleSheet } from 'react-native';
import FormDetails from '../../../../components/FormDetails/FormDetails';
import moment from 'moment';
import Status from '../../../../components/Status/Status';
import { Paragraph, themeGrey, useTheme } from '@oce-apps/apollo-react-native';
import { useFormikContext } from 'formik';

const PanelHeader = () => {
  const context = useFormikContext();
  const { values } = context;
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]} testID="ReturnPanelHeader">
      <FormDetails title="Transaction Date Time">
        <Paragraph style={{ fontSize: 16 }}>
          {moment().format('MMM D YYYY hh:mm a')}
        </Paragraph>
      </FormDetails>
      <FormDetails title="Status">
        <Status size="large" status={values.fields.status} />
      </FormDetails>
      <FormDetails title="Transaction Rep">
        <Paragraph style={{ fontSize: 16 }}>{values.fields.transactionRep.Name}</Paragraph>
      </FormDetails>
      <FormDetails title="Transaction Rep Territory">
        <Paragraph style={{ fontSize: 16 }}>
          {values.fields.transactionRepTerritory
            ? values.fields.transactionRepTerritory.name
            : ''}
        </Paragraph>
      </FormDetails>
      <FormDetails title="Ship to" >
        <Paragraph style={{ fontSize: 16 }}>
          {values.fields.shipTo
            ? values.fields.shipTo.label
            : ''}
        </Paragraph>
      </FormDetails>
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
