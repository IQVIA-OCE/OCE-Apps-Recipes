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
import { packageConditions } from '../../constants';

const PanelContent = ({ readonly, isLoadingDetails }) => {
  const context = useFormikContext();
  const { values, handleChange, setFieldValue, errors, touched } = context;

  const [users] = useFetcher(fetchAllUsers, normalizeUsers);
  const fromSalesRepId = values.fields.fromSalesRep
    ? values.fields.fromSalesRep['value']
    : null;
  const userId =
    values.fields.user && values.fields.user.Id ? values.fields.user.Id : null;

  const [locations, locationsActions] = useFetcher(
    async () => await fetchUserLocations(userId),
    normalizeLocations
  );
  const [territory, territoryActions] = useFetcher(
    async () => await fetchUserTerritory(fromSalesRepId)
  );

  useEffect(() => {
    territoryActions.handleFetch();
  }, [values.fields.fromSalesRep]);

  useEffect(() => {
    if (values.fields.user.Id) {
      locationsActions.handleFetch();
    }
  }, [values.fields.user.Id]);

  useEffect(() => {
    const fromSalesRepTerritory =
      territory.data && territory.data.length
        ? territory.data[0].OCE__Territory__c
        : '';
    setFieldValue('fields.fromSalesRepTerritory.name', fromSalesRepTerritory);
  }, [territory]);

  return (
    <View style={styles.container} testID="TransferInPanelContent">
      <View style={styles.col}>
      {isLoadingDetails ? null : 
        useHandleData(users)(data => {
          return readonly ? (
            <TextInput
              label="From Sales Rep"
              value={
                values.fields.fromSalesRep
                  ? values.fields.fromSalesRep.label
                  : ''
              }
              fullWidth
              readonly
              style={styles.readonlyField}
            />
          ) : (
            <Autocomplete
              label="From Sales Rep"
              helperText={getFieldHelperText('fromSalesRep', errors, touched)}
              error={getFieldError('fromSalesRep', errors, touched)}
              placeholder=""
              source={data}
              onChange={val => {
                setFieldValue('fields.fromSalesRep', val);
              }}
              singleSelect
              singleSelectValue={values.fields.fromSalesRep}
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
              style={styles.field}
              error={getFieldError('shipTo', errors, touched)}
              helperText={getFieldHelperText('shipTo', errors, touched)}
              required
            />
          );
        })}

        <DateField
          label="Received Date"
          value={values.fields.receivedDate}
          onChange={val => setFieldValue('fields.receivedDate', val)}
          style={readonly ? styles.readonlyField : styles.field}
          hasError={getFieldError('receivedDate', errors, touched)}
          helperText={getFieldHelperText('receivedDate', errors, touched)}
          required={readonly ? false : true}
          touched={touched}
          readonly={readonly}
        />

        {values.fields.relatedTransactionName ? (
          <View>
            <TextInput
              label="Shipment Carrier"
              value={values.fields.shipmentCarrier}
              fullWidth
              readonly
              style={styles.readonlyField}
            />
          </View>
        ) : null}
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
              value={values.fields.fromSalesRepTerritory.name}
              fullWidth
              style={styles.readonlyField}
              readonly
            />
          );
        })}

        {values.fields.relatedTransactionName ? (
          <View>
            <TextInput
              label="Shipment Date"
              value={values.fields.shipmentDate}
              fullWidth
              readonly
              style={styles.readonlyField}
            />
            <TextInput
              label="Tracking Number"
              value={values.fields.trackingNumber}
              fullWidth
              readonly
              style={styles.readonlyField}
            />
          </View>
        ) : null}

        {readonly ? (
          <TextInput
            label="Condition of Package"
            style={styles.readonlyField}
            value={
              values.fields.conditionOfPackage
                ? values.fields.conditionOfPackage.label
                : ''
            }
            fullWidth
            readonly
          />
        ) : (
          <Select
            label="Condition of Package"
            placeholder={'-None-'}
            options={packageConditions}
            value={values.fields.conditionOfPackage}
            onChange={val => setFieldValue('fields.conditionOfPackage', val)}
            fullWidth
            style={styles.field}
            error={getFieldError('conditionOfPackage', errors, touched)}
            helperText={getFieldHelperText(
              'conditionOfPackage',
              errors,
              touched
            )}
            required
          />
        )}

        <TextInput
          label="Comments"
          onChangeText={handleChange('fields.comments')}
          value={values.fields.comments}
          multiline
          numberOfLines={5}
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
