import React from 'react';
import PanelContent from './PanelContent';
import { Formik } from 'formik';
import { useBoolean, useFetcher, useHandleData } from '../../../../hooks';
import { Autocomplete, Select } from '@oce-apps/apollo-react-native';
import { render, act } from '@testing-library/react-native';

jest.mock('../../../../hooks');

describe('PanelHeader', () => {
  beforeAll(() => {
    useBoolean.mockReturnValue([
      false,
      { setTrue: jest.fn(), setFalse: jest.fn() },
    ]);
    useHandleData.mockImplementation(data => fn => fn(data.data));
    useFetcher.mockReturnValue([
      {
        data: [],
      },
      {
        locationsActions: jest.fn(),
        handleFetch: jest.fn(),
      },
    ]);
  });

  it('should render properly', async () => {
    const Component = () => (
      <Formik
        enableReinitialize
        initialValues={{
          fields: {
            fromSalesRepTerritory: '',
            fromSalesRep: '',
            shipTo: '',
            receivedDate: 'Tue Jun 02 2020 13:23:52 GMT+0300',
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


    act(() => UNSAFE_root.findByType(Autocomplete).props.onChange());

    await act(() => UNSAFE_root.findAllByType(Select)[0].props.onChange());
    await act(() => UNSAFE_root.findAllByType(Select)[1].props.onChange());

    expect(UNSAFE_root.findByType(Autocomplete)).toBeTruthy();
  });

  it('should render in readonly mode properly', async () => {
    const Component = () => (
      <Formik
        enableReinitialize
        initialValues={{
          fields: {
            fromSalesRepTerritory: '',
            fromSalesRep: '',
            shipTo: '',
            receivedDate: 'Tue Jun 02 2020 13:23:52 GMT+0300',
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

    expect(UNSAFE_root.findAllByType(Autocomplete).length).toEqual(0);
  });
});
