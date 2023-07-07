import React, { useEffect } from 'react';
import { Portal, Modal, Button, TextInput, Select } from 'apollo-react-native';
import { View, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useFetcher, useHandleData } from '../../hooks';
import { fetchUserLocations } from '../../api/SampleTransaction';
import { normalizeLocations } from './utils';
import DateField from './FormPanel/DateField';
import { getFieldError, getFieldHelperText } from './utils';

const ReturnToSenderModal = ({
  status,
  returnValues,
  handleAction,
  onDismiss,
}) => {
  const [locations, locationsActions] = useFetcher(
    async () =>
      await fetchUserLocations(returnValues.fields.fromSalesRep.value),
    normalizeLocations
  );

  useEffect(() => {
    if (
      returnValues.fields.fromSalesRep &&
      returnValues.fields.fromSalesRep.value
    ) {
      locationsActions.handleFetch();
    }
  }, [returnValues.fields.fromSalesRep]);

  return (
    <Portal>
      <Modal visible={status} onDismiss={onDismiss}>
        <Formik
          enableReinitialize
          initialValues={{
            fields: {
              shipmentCarrier: '',
              trackingNumber: '',
              shipmentDate: '',
              comments: '',
              shipTo: '',
            },
          }}
          onSubmit={values => handleAction(values, returnValues)}
          validateOnMount={true}
          validationSchema={Yup.object().shape({
            fields: Yup.object().shape({
              shipmentCarrier: Yup.string()
                .nullable()
                .required('Complete this field.'),
              trackingNumber: Yup.string()
                .nullable()
                .required('Complete this field.'),
              shipmentDate: Yup.date()
                .nullable()
                .required('Complete this field.'),
              comments: Yup.string()
                .nullable()
                .required('Complete this field.'),
              shipTo: Yup.object()
                .nullable()
                .required('Complete this field.'),
            }),
          })}
        >
          {({
            handleSubmit,
            values,
            touched,
            errors,
            setFieldValue,
            handleChange,
          }) => (
            <>
              <Modal.Title title={`Return To Sender`} closeIcon />
              <Modal.Content>
                <View style={styles.container}>
                  <View style={styles.col}>
                    <TextInput
                      value={values.fields.shipmentCarrier}
                      label={'Carrier'}
                      onChangeText={handleChange('fields.shipmentCarrier')}
                      placeholder=""
                      required
                      fullWidth
                      helperText={getFieldHelperText(
                        'shipmentCarrier',
                        errors,
                        touched
                      )}
                      error={getFieldError('shipmentCarrier', errors, touched)}
                      style={styles.field}
                    />
                    <DateField
                      label="Shipment Date"
                      value={values.fields.shipmentDate}
                      onChange={val =>
                        setFieldValue('fields.shipmentDate', val)
                      }
                      style={styles.field}
                      hasError={getFieldError('shipmentDate', errors, touched)}
                      helperText={getFieldHelperText(
                        'shipmentDate',
                        errors,
                        touched
                      )}
                      touched={touched}
                      required
                    />
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
                          helperText={getFieldHelperText(
                            'shipTo',
                            errors,
                            touched
                          )}
                          required
                        />
                      );
                    })}
                  </View>
                  <View style={styles.col}>
                    <TextInput
                      value={values.fields.trackingNumber}
                      label={'Tracking Number'}
                      onChangeText={handleChange('fields.trackingNumber')}
                      placeholder=""
                      required
                      fullWidth
                      helperText={getFieldHelperText(
                        'trackingNumber',
                        errors,
                        touched
                      )}
                      error={getFieldError('trackingNumber', errors, touched)}
                      style={styles.field}
                    />
                    <TextInput
                      value={values.fields.comments}
                      label={'Comments'}
                      onChangeText={handleChange('fields.comments')}
                      placeholder="Comments"
                      multiline
                      required
                      fullWidth
                      helperText={getFieldHelperText(
                        'comments',
                        errors,
                        touched
                      )}
                      error={getFieldError('comments', errors, touched)}
                      style={styles.field}
                    />
                  </View>
                </View>
              </Modal.Content>
              <Modal.Actions>
                <Button mode="tertiary" onPress={onDismiss}>
                  Cancel
                </Button>
                <Button mode="contained" onPress={() => handleSubmit()}>
                  Return To Sender
                </Button>
              </Modal.Actions>
            </>
          )}
        </Formik>
      </Modal>
    </Portal>
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
    flexDirection: 'column',
    marginRight: 20,
    paddingRight: 20,
    width: '50%',
  },
  field: {
    marginBottom: 15,
  },
});

export default ReturnToSenderModal;
