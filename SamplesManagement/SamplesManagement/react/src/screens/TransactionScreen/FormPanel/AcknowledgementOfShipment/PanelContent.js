import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput, Select } from '@oce-apps/apollo-react-native';
import { useFormikContext } from 'formik';
import DateField from '../DateField';
import { getFieldError, getFieldHelperText } from '../../utils';
import { packageConditions } from '../../constants';

const PanelContent = ({ readonly }) => {
  const context = useFormikContext();
  const { values, handleChange, setFieldValue, errors, touched } = context;

  return (
    <View style={styles.container} testID="AOSPanelContent">
      <View style={styles.col}>
        <DateField
          label="Received Date"
          value={values.fields.receivedDate}
          onChange={val => setFieldValue('fields.receivedDate', val)}
          style={styles.field}
          hasError={getFieldError('receivedDate', errors, touched)}
          helperText={getFieldHelperText('receivedDate', errors, touched)}
          required={readonly ? false : true}
          touched={touched}
          readonly={readonly}
        />
        {readonly ? <TextInput
          label="Condition of Package"
          value={values.fields.conditionOfPackage ? values.fields.conditionOfPackage.label : ''}
          fullWidth
          readonly={readonly}
        /> : <Select
          label="Condition of Package"
          placeholder={'-None-'}
          options={packageConditions}
          value={values.fields.conditionOfPackage}
          onChange={val => setFieldValue('fields.conditionOfPackage', val)}
          fullWidth
          style={{ width: '100%'}}
          error={getFieldError('conditionOfPackage', errors, touched)}
          helperText={getFieldHelperText('conditionOfPackage', errors, touched)}
          required
        />}

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
          readonly={readonly}
          style={readonly ? styles.readonlyWithBorder : null}
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
  required: {
    borderWidth: 0
  },
  readonlyWithBorder: {
    marginBottom: 10,
    borderBottomWidth: 0.5,
    borderColor: '#D9D9D9',
  },
});

export default PanelContent;
