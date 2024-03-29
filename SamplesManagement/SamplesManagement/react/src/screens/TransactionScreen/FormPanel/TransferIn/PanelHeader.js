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
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]} testID="TransferInPanelHeader">
      <FormDetails title="Transaction Date Time">
        <Paragraph style={{ fontSize: 16 }}>
          {moment(values.fields.transactionDateTime).format(
            'MMM D YYYY hh:mm a'
          )}
        </Paragraph>
      </FormDetails>
      <FormDetails title="Status">
        <Status size="large" status={values.fields.status} />
      </FormDetails>
      <FormDetails title="To Sales Rep">
        <Paragraph style={{ fontSize: 16 }}>
          {values.fields.user ? values.fields.user.Name : ''}
        </Paragraph>
      </FormDetails>
      <FormDetails title="To Sales Rep Territory">
        <Paragraph style={{ fontSize: 16 }}>
          {values.fields.toSalesRepTerritory ? values.fields.toSalesRepTerritory.name : ''}
        </Paragraph>
      </FormDetails>
      {values.fields.relatedTransactionName ? (
        <FormDetails title="Related Transaction ID">
          <Paragraph style={{ fontSize: 16 }}>
            {values.fields.relatedTransactionName}
          </Paragraph>
        </FormDetails>
      ) : null}
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
