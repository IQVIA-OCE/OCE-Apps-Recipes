import React, { useEffect } from 'react';
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

const PanelContent = ({ readonly }) => {
  const {
    values,
    handleChange,
    setFieldValue,
    errors,
    touched,
  } = useFormikContext();

  const [users] = useFetcher(fetchAllUsers, normalizeUsers);

  const toSalesRepId = values.fields.toSalesRep
    ? values.fields.toSalesRep['value']
    : null;

  const [locations, locationsActions] = useFetcher(
    async () => await fetchUserLocations(toSalesRepId),
    normalizeLocations
  );
  const [territory, territoryActions] = useFetcher(
    async () => await fetchUserTerritory(toSalesRepId)
  );

  useEffect(() => {
    locationsActions.handleFetch();
    territoryActions.handleFetch();
  }, [values.fields.toSalesRep]);

  useEffect(() => {
    const toSalesRepTerritory =
      territory.data && territory.data.length
        ? territory.data[0].OCE__Territory__c
        : '';
    setFieldValue('fields.toSalesRepTerritory.name', toSalesRepTerritory);
  }, [territory]);

  return (
    <View style={styles.container}>
      <View style={styles.col}>
        {useHandleData(users)(data => {
          return readonly ? (
            <TextInput
              label="To Sales Rep"
              value={
                values.fields.toSalesRep ? values.fields.toSalesRep.label : ''
              }
              fullWidth
              readonly
              style={styles.readonlyField}
            />
          ) : (
            <Autocomplete
              label="To Sales Rep"
              helperText={getFieldHelperText('toSalesRep', errors, touched)}
              error={getFieldError('toSalesRep', errors, touched)}
              placeholder=""
              source={data}
              onChange={val => {
                setFieldValue('fields.shipTo', null);
                setFieldValue('fields.toSalesRep', val);
              }}
              singleSelect
              singleSelectValue={values.fields.toSalesRep}
              fullWidth
              required
              style={styles.field}
            />
          );
        })}
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
              disabled={values.fields.toSalesRep == null || users.loading}
              required
            />
          );
        })}

        <DateField
          label="Shipment Date"
          value={values.fields.shipmentDate}
          onChange={val => setFieldValue('fields.shipmentDate', val)}
          style={styles.field}
          hasError={getFieldError('shipmentDate', errors, touched)}
          helperText={getFieldHelperText('shipmentDate', errors, touched)}
          touched={touched}
          readonly={readonly}
          required
        />

        <TextInput
          label="Shipment Carrier"
          onChangeText={handleChange('fields.shipmentCarrier')}
          value={values.fields.shipmentCarrier}
          fullWidth
          error={getFieldError('shipmentCarrier', errors, touched)}
          helperText={getFieldHelperText('shipmentCarrier', errors, touched)}
          required
          readonly={readonly}
          style={readonly ? styles.readonlyField : styles.field}
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
              label="To Sales Rep Territory"
              value={values.fields.toSalesRepTerritory.name}
              fullWidth
              style={[styles.field, { borderWidth: 0, opacity: 1 }]}
              readonly
              editable={false}
            />
          );
        })}

        <TextInput
          label="Tracking Number"
          onChangeText={handleChange('fields.trackingNumber')}
          value={values.fields.trackingNumber}
          error={getFieldError('trackingNumber', errors, touched)}
          helperText={getFieldHelperText('trackingNumber', errors, touched)}
          fullWidth
          required
          readonly={readonly}
          style={readonly ? styles.readonlyField : styles.field}
        />
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
