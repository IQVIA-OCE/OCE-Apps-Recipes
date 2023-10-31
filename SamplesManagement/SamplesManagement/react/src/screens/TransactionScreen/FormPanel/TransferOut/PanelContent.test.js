import React from 'react';
import PanelContent from './PanelContent';
import { Formik } from 'formik';
import { useBoolean, useFetcher, useHandleData } from '../../../../hooks';
import { Autocomplete, Select } from 'apollo-react-native';
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
            fromSalesRep: '',
            shipTo: '',
            receivedDate: 'Tue Jun 02 2020 13:23:52 GMT+0300',
            conditionOfPackage: '',
            comments: '',
            toSalesRepTerritory: {
              name: "Atalanta"
            },
            transactionRepTerritory: {
              name: "TerrritoryName"
            },
            fromSalesRepTerritory: {
              name: "Atalanta"
            }
          },
        }}
      >
        <PanelContent />
      </Formik>
    );
    
    const { container, getByText } = render(
      <Component />
    );

    act(() => container.findByType(Autocomplete).props.onChange());

    await act(() => container.findAllByType(Select)[0].props.onChange());

    await act(() => container.findAllByType(Select)[0].props.onChange());

    expect(getByText(/Shipment Carrier/)).toBeTruthy();
  });
});
