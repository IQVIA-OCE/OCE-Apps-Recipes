import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput, Select } from 'apollo-react-native';
import { useFormikContext } from 'formik';
import DateField from '../DateField';
import { getFieldError, getFieldHelperText } from '../../utils';

const PanelContent = () => {
  const context = useFormikContext();
  const { values, handleChange, setFieldValue, errors, touched } = context;

  return (
    <View style={styles.container}>
      <View style={styles.col}>
        <DateField
          label="Received Date"
          value={values.fields.receivedDate}
          onChange={val => setFieldValue('fields.receivedDate', val)}
          style={styles.field}
          hasError={getFieldError('receivedDate', errors, touched)}
          helperText={getFieldHelperText('receivedDate', errors, touched)}
          required
          touched={touched}
        />
        <Select
          label="Condition of Package"
          placeholder={'-None-'}
          options={[
            { label: 'Undamaged', id: '1' },
            { label: 'Damaged', id: '2' },
            { label: 'Opened', id: '3' },
          ]}
          value={values.fields.conditionOfPackage}
          onChange={val => setFieldValue('fields.conditionOfPackage', val)}
          fullWidth
          style={{ width: '100%' }}
          error={getFieldError('conditionOfPackage', errors, touched)}
          helperText={getFieldHelperText('conditionOfPackage', errors, touched)}
          required
        />
      </View>
      <View
        style={{
          flex: 1,
        }}
      >
        <TextInput
          label="Comments"
          onChangeText={handleChange('fields.comments')}
          value={values.fields.comments}
          multiline
          fullWidth
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
