import React from 'react';
import FormPanel from './FormPanel';
import { Formik } from 'formik';
import { act, render } from '@testing-library/react-native';
import moment from 'moment';

const formikFields = {
  fields: {
    fromSalesRepTerritory: '',
    fromSalesRep: '',
    shipTo: '',
    receivedDate: moment().toISOString(),
    conditionOfPackage: '',
    comments: '',
    user: {},
    transactionRep: {
      Name: 'test'
    }
  },
};

describe('FormPanel', () => {
  it('should render correctly', () => {
    const { queryByText } = render(
      <FormPanel />
    );
    act(() => jest.runAllTimers());

    expect(queryByText(/Transaction Date Time/)).toBeNull();
  });

  it('should render AOS', () => {
    const { findByTestId } = render(
      <Formik
        initialValues={formikFields}
      >
        <FormPanel recordType={'AcknowledgementOfShipment'} />
      </Formik>
    );
    act(() => jest.runAllTimers());

    expect(findByTestId('AOSPanelHeader')).toBeTruthy();
    expect(findByTestId('AOSPanelContent')).toBeTruthy();
  });

  it('should render Adjustment', () => {
    const { findByTestId } = render(
      <Formik
        initialValues={formikFields}
      >
        <FormPanel recordType={'Adjustment'} />
      </Formik>
    );
    act(() => jest.runAllTimers());

    expect(findByTestId('AdjustmentPanelHeader')).toBeTruthy();
    expect(findByTestId('AdjustmentPanelContent')).toBeTruthy();
  });

  it('should render Return', () => {
    const { findByTestId } = render(
      <Formik
        initialValues={formikFields}
      >
        <FormPanel recordType={'Return'} />
      </Formik>
    );
    act(() => jest.runAllTimers());

    expect(findByTestId('ReturnPanelHeader')).toBeTruthy();
    expect(findByTestId('ReturnPanelContent')).toBeTruthy();
  });

  it('should render TransferIn', () => {
    const { findByTestId } = render(
      <Formik
        initialValues={formikFields}
      >
        <FormPanel recordType={'TransferIn'} />
      </Formik>
    );
    act(() => jest.runAllTimers());

    expect(findByTestId('TransferInPanelHeader')).toBeTruthy();
    expect(findByTestId('TransferInPanelContent')).toBeTruthy();
  });

  it('should render TransferOut', () => {
    const { findByTestId } = render(
      <Formik
        initialValues={formikFields}
      >
        <FormPanel recordType={'TransferOut'} />
      </Formik>
    );
    act(() => jest.runAllTimers());

    expect(findByTestId('TransferOutPanelHeader')).toBeTruthy();
    expect(findByTestId('TransferOutPanelContent')).toBeTruthy();
  });
});
