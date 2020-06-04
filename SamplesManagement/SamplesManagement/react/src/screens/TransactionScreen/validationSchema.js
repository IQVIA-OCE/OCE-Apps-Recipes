import * as Yup from 'yup';
import moment from 'moment';

export const getValidationSchema = recordTypeDevName =>
  Yup.object().shape({
    fields: fieldsValidation[recordTypeDevName],
    products: Yup.array()
      .of(productValidation[recordTypeDevName])
      .when('formStatus', {
        is: 'Submitting',
        then: fieldSchema =>
          fieldSchema.required('Please add at least one Product Detail.'),
      }),
  });

const fieldsValidation = {
  AcknowledgementOfShipment: Yup.object().shape({
    receivedDate: Yup.date()
      .max(
        moment()
          .add(1, 'days')
          .format('YYYY-MM-DD'),
        'Received Date cannot be later than today.'
      )
      .required('Complete this field.'),
    conditionOfPackage: Yup.object()
      .nullable()
      .required('Complete this field.'),
  }),
  Adjustment: Yup.object().shape({}),
  Return: Yup.object().shape({
    shipmentDate: Yup.date()
      .nullable()
      .max(
        moment()
          .add(1, 'days')
          .format('YYYY-MM-DD'),
        'Shipment Date cannot be later than today.'
      ),
  }),
  TransferIn: Yup.object().shape({
    receivedDate: Yup.date()
      .nullable()
      .required('Complete this field.'),
    conditionOfPackage: Yup.object()
      .nullable()
      .required('Complete this field.'),
    fromSalesRep: Yup.object()
      .nullable()
      .required('Complete this field.'),
    shipTo: Yup.object()
      .nullable()
      .required('Complete this field.'),
  }),
  TransferOut: Yup.object().shape({
    shipmentDate: Yup.date()
      .nullable()
      .required('Complete this field.'),
    shipTo: Yup.object()
      .nullable()
      .required('Complete this field.'),
    trackingNumber: Yup.string()
      .nullable()
      .required('Complete this field.'),
    shipmentCarrier: Yup.string()
      .nullable()
      .required('Complete this field.'),
    toSalesRep: Yup.object()
      .nullable()
      .required('Complete this field.'),
  }),
};

const productValidation = {
  AcknowledgementOfShipment: Yup.object().shape({
    quantity: Yup.number()
      .typeError('Enter a valid value.')
      .nullable()
      .max(99999, 'Please enter quantity less than or equal to 99,999.')
      .min(1, 'Must be greater 0 and less 99,999.')
      .required('Complete this field.'),
  }),
  Adjustment: Yup.object().shape({
    quantity: Yup.number()
      .typeError('Enter a valid value.')
      .nullable()
      .max(99999, 'Please enter quantity less than or equal to 99,999.')
      .min(1, 'Must be greater 0 and less 99,999.')
      .required('Complete this field.'),
    reason: Yup.object()
      .nullable()
      .test('required', 'Complete this field.', val => val),
  }),
  Return: Yup.object().shape({
    quantity: Yup.number()
      .typeError('Enter a valid value.')
      .nullable()
      .max(99999, 'Please enter quantity less than or equal to 99,999.')
      .min(1, 'Must be greater 0 and less 99,999.')
      .required('Complete this field.'),
  }),
  TransferIn: Yup.object().shape({
    quantity: Yup.number()
      .typeError('Enter a valid value.')
      .nullable()
      .max(99999, 'Please enter quantity less than or equal to 99,999.')
      .min(1, 'Must be greater 0 and less 99,999.')
      .required('Complete this field.'),
  }),
  TransferOut: Yup.object().shape({
    quantity: Yup.number()
      .typeError('Enter a valid value.')
      .nullable()
      .max(99999, 'Please enter quantity less than or equal to 99,999.')
      .min(1, 'Must be greater 0 and less 99,999.')
      .required('Complete this field.'),
  }),
};
