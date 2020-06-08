import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput, Select, Autocomplete } from 'apollo-react-native';
import { useFormikContext } from 'formik';
import DateField from '../DateField';
import { useFetcher, useHandleData } from '../../../../hooks';
import {
  fetchAllUsers,
  fetchUserLocations,
  fetchUserTerritory,
} from '../../../../api/SampleTransaction';
import {
  normalizeUsers,
  normalizeLocations,
  getFieldError,
  getFieldHelperText,
} from '../../utils';

const PanelContent = () => {
  const context = useFormikContext();
  const { values, handleChange, setFieldValue, errors, touched } = context;

  const [users] = useFetcher(fetchAllUsers, normalizeUsers);
  const [locations, locationsActions] = useFetcher(
    async () => await fetchUserLocations(values.fields.fromSalesRep),
    normalizeLocations
  );
  const [territory, territoryActions] = useFetcher(
    async () => await fetchUserTerritory(values.fields.fromSalesRep)
  );

  useEffect(() => {
    locationsActions.handleFetch();
    territoryActions.handleFetch();
  }, [values.fields.fromSalesRep]);

  useEffect(() => {
    const fromSalesRepTerritory =
      territory.data && territory.data.length
        ? territory.data[0].OCE__Territory__c
        : '';
    setFieldValue('fields.fromSalesRepTerritory', fromSalesRepTerritory);
  }, [territory]);

  return (
    <View style={styles.container}>
      <View style={styles.col}>
        {useHandleData(users)(data => {
          return (
            <Autocomplete
              label="From Sales Rep"
              helperText={getFieldHelperText('fromSalesRep', errors, touched)}
              error={getFieldError('fromSalesRep', errors, touched)}
              placeholder=""
              source={data}
              onChange={val => {
                setFieldValue('fields.shipTo', null);
                setFieldValue('fields.fromSalesRep', val);
              }}
              singleSelect
              fullWidth
              required
              style={styles.field}
            />
          );
        })}
        {useHandleData(locations)(data => {
          return (
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
              disabled={values.fields.fromSalesRep == null || users.loading}
              required
            />
          );
        })}

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
      </View>
      <View
        style={{
          flex: 1,
        }}
      >
        {useHandleData(territory)(() => {
          return (
            <TextInput
              label="From Sales Rep Territory"
              value={values.fields.fromSalesRepTerritory}
              fullWidth
              style={[styles.field, { borderWidth: 0, opacity: 1 }]}
              readonly
              editable={false}
            />
          );
        })}
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
          style={{ width: '100%', marginBottom: 15 }}
          error={getFieldError('conditionOfPackage', errors, touched)}
          helperText={getFieldHelperText('conditionOfPackage', errors, touched)}
          required
        />
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
