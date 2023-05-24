import React from 'react';
import FormPanel from './FormPanel';
import { Formik } from 'formik';
import { render } from '@testing-library/react-native';

const formikFields = {
  fields: {
    fromSalesRepTerritory: '',
    fromSalesRep: '',
    shipTo: '',
    receivedDate: 'Tue Jun 02 2020 13:23:52 GMT+0300',
    conditionOfPackage: '',
    comments: '',
    user: {},
    transactionRep: {
      Name: 'test'
    }
  },
};

describe('FormPanel', () => {
  it('should render correctly', async () => {
    const { queryByText } = render(
      <FormPanel />
    );

    expect(queryByText(/Transaction Date Time/)).toBeNull();
  });

  it('should render AOS', () => {
    const { getByTestId } = render(
      <Formik
        initialValues={formikFields}
      >
        <FormPanel recordType={'AcknowledgementOfShipment'} />
      </Formik>
    );

    expect(getByTestId('AOSPanelHeader')).toBeTruthy();
    expect(getByTestId('AOSPanelContent')).toBeTruthy();
  });

  it('should render Adjustment', () => {
    const { getByTestId } = render(
      <Formik
        initialValues={formikFields}
      >
        <FormPanel recordType={'Adjustment'} />
      </Formik>
    );

    expect(getByTestId('AdjustmentPanelHeader')).toBeTruthy();
    expect(getByTestId('AdjustmentPanelContent')).toBeTruthy();
  });

  it('should render Return', () => {
    const { getByTestId } = render(
      <Formik
        initialValues={formikFields}
      >
        <FormPanel recordType={'Return'} />
      </Formik>
    );

    expect(getByTestId('ReturnPanelHeader')).toBeTruthy();
    expect(getByTestId('ReturnPanelContent')).toBeTruthy();
  });

  it('should render TransferIn', () => {
    const { getByTestId } = render(
      <Formik
        initialValues={formikFields}
      >
        <FormPanel recordType={'TransferIn'} />
      </Formik>
    );

    expect(getByTestId('TransferInPanelHeader')).toBeTruthy();
    expect(getByTestId('TransferInPanelContent')).toBeTruthy();
  });

  it('should render TransferOut', () => {
    const { getByTestId } = render(
      <Formik
        initialValues={formikFields}
      >
        <FormPanel recordType={'TransferOut'} />
      </Formik>
    );

    expect(getByTestId('TransferOutPanelHeader')).toBeTruthy();
    expect(getByTestId('TransferOutPanelContent')).toBeTruthy();
  });

});
