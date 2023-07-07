import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useFormikContext } from 'formik';
import { TextInput } from 'apollo-react-native';
import DateField from '../DateField';
import { getFieldError, getFieldHelperText } from '../../utils';

const PanelContent = ({ readonly }) => {
  const context = useFormikContext();
  const { values, setFieldValue, errors, touched } = context;

  return (
    <View style={styles.container} testID="ReturnPanelContent">
      <View style={styles.col}>
        <DateField
          label="Shipment Date"
          value={values.fields.shipmentDate}
          onChange={val => setFieldValue('fields.shipmentDate', val)}
          style={styles.field}
          hasError={getFieldError('shipmentDate', errors, touched)}
          helperText={getFieldHelperText('shipmentDate', errors, touched)}
          touched={touched}
          readonly={readonly}
        />
        <TextInput
          label="Tracking Number"
          onChangeText={val => setFieldValue('fields.trackingNumber', val)}
          value={values.fields.trackingNumber}
          readonly={readonly}
          fullWidth
        />
      </View>
      <View
        style={{
          flex: 1,
        }}
      >
        <TextInput
          label="Shipment Carrier"
          onChangeText={val => setFieldValue('fields.shipmentCarrier', val)}
          value={values.fields.shipmentCarrier}
          fullWidth
          style={styles.field}
          readonly={readonly}
        />
        <TextInput
          label="Comments"
          onChangeText={val => setFieldValue('fields.comments', val)}
          value={values.fields.comments}
          multiline
          fullWidth
          readonly={readonly}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 15,
    paddingHorizontal: 30,
    marginBottom: 10,
  },
  col: {
    borderRightWidth: 1,
    borderRightColor: 'rgb(221, 219, 218)',
    flex: 1,
    marginRight: 20,
    paddingRight: 20,
  },
  field: {
    marginBottom: 15,
  },
});

export default PanelContent;
