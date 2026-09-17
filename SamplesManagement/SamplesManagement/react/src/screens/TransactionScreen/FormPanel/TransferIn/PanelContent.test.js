import React from 'react';
import PanelContent from './PanelContent';
import { Formik } from 'formik';
import { useBoolean } from '../../../../hooks';
import { Autocomplete, Select } from '@oce-apps/apollo-react-native';
import { render, act, fireEvent } from '@testing-library/react-native';
import moment from 'moment';

jest.mock('../../../../hooks/useBoolean');

describe('PanelHeader', () => {
  beforeAll(() => {
    useBoolean.mockReturnValue([
      false,
      { setTrue: jest.fn(), setFalse: jest.fn() },
    ]);
  });

  it('should render properly', () => {
    const Component = () => (
      <Formik
        enableReinitialize
        initialValues={{
          fields: {
            fromSalesRepTerritory: '',
            fromSalesRep: '',
            shipTo: '',
            receivedDate: moment().toISOString(),
            conditionOfPackage: '',
            comments: '',
            user: {},
          },
        }}
      >
        <PanelContent />
      </Formik>
    );

    const { UNSAFE_root } = render(
      <Component />
    );
    act(() => jest.runAllTimers());

    fireEvent(UNSAFE_root.findByType(Autocomplete), 'change');
    act(() => jest.runAllTimers());

    fireEvent(UNSAFE_root.findAllByType(Select)[0], 'change');
    act(() => jest.runAllTimers());

    fireEvent(UNSAFE_root.findAllByType(Select)[1], 'change');
    act(() => jest.runAllTimers());

    expect(UNSAFE_root.findByType(Autocomplete)).toBeTruthy();
  });

  it('should render in readonly mode properly', () => {
    const Component = () => (
      <Formik
        enableReinitialize
        initialValues={{
          fields: {
            fromSalesRepTerritory: '',
            fromSalesRep: '',
            shipTo: '',
            receivedDate: moment().toISOString(),
            conditionOfPackage: '',
            comments: '',
            user: {},
          },
        }}
      >
        <PanelContent readonly/>
      </Formik>
    );

    const { UNSAFE_root } = render(
      <Component />
    );
    act(() => jest.runAllTimers());

    expect(UNSAFE_root.findAllByType(Autocomplete).length).toEqual(0);
    act(() => jest.runAllTimers());
  });
});
