import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput, Select, Autocomplete } from 'apollo-react-native';
import { useFormikContext } from 'formik';
import { useFetcher, useHandleData } from '../../../hooks';
import { fetchUserLocations } from '../../../api/SampleOrder';
import {
  normalizeUsers,
  normalizeLocations,
  getFieldError,
  getFieldHelperText,
} from '../utils';

const PanelContent = ({ readonly }) => {
  const context = useFormikContext();
  const { values, handleChange, setFieldValue, errors, touched } = context;

  const [locations] = useFetcher(async () => {
    return await fetchUserLocations(values.fields.user.Id);
  }, normalizeLocations);

  return (
    <View style={styles.container}>
      <View style={styles.col}>
        {useHandleData(locations)(data => {
          return readonly ? (
            <TextInput
              label="Ship To"
              value={values.fields.shipTo ? values.fields.shipTo.label : ''}
              fullWidth
              readonly
              style={styles.readonlyField}
            />
          ) : (
            <Select
              label="Ship To"
              placeholder={'-None-'}
              options={data}
              value={values.fields.shipTo}
              onChange={val => setFieldValue('fields.shipTo', val)}
              fullWidth
              style={{ width: '100%', marginBottom: 15 }}
              error={getFieldError('shipTo', errors, touched)}
              helperText={getFieldHelperText('shipTo', errors, touched)}
              required
            />
          );
        })}
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
          style={readonly ? styles.readonlyWithBorder : styles.field}
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
  readonlyField: {
    marginBottom: 18,
  },
  readonlyWithBorder: {
    marginBottom: 10,
    borderBottomWidth: 0.5,
    borderColor: '#D9D9D9',
  },
});

export default PanelContent;
