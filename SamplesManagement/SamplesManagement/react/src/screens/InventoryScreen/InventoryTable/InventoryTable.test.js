import React from 'react';
import InventoryTable from './InventoryTable';
import { Formik } from 'formik';
import { InventoryContext } from '../InventoryContext';
import { render } from '@testing-library/react-native';

jest.mock('react-native-keyboard-aware-scroll-view', () => {
  const KeyboardAwareScrollView = ({ children }) => children;
  return { KeyboardAwareScrollView };
});

describe('TransactionTable', () => {
  it('should render component', () => {
    const { getByText } = render(
      <InventoryContext.Provider
        value={{
          config: { showCalculatedFields: true, showSystemCount: true },
        }}
      >
        <Formik
          initialValues={{
            id: '123',
            status: 'Saved',
            products: [{ id: '1', physicalQuantity: '1', name: 'productName' }],
          }}
        >
          <InventoryTable
            rows={[]}
            readonly={false}
            form={{ values: { recordType: 'Adjustment' } }}
          />
        </Formik>
      </InventoryContext.Provider>
    );

    expect(getByText('PRODUCT')).toBeTruthy();
    expect(getByText('OPENING BALANCE')).toBeTruthy();
    expect(getByText('QTY. IN')).toBeTruthy();
    expect(getByText('QTY. OUT')).toBeTruthy();
    expect(getByText('SYS. COUNT')).toBeTruthy();
    expect(getByText('PHYSICAL COUNT')).toBeTruthy();
    expect(getByText('REASON')).toBeTruthy();
  });

  it('should render component with different record type', () => {
    const { getByText, queryByText } = render(
      <Formik
        initialValues={{
          id: '123',
          status: 'Saved',
          products: [{ id: '1', physicalQuantity: '1' }],
        }}
      >
        <InventoryTable
          rows={[]}
          readonly={false}
          form={{ values: { recordType: 'TransferIn' } }}
        />
      </Formik>
    )

    expect(getByText('PRODUCT')).toBeTruthy();
    expect(getByText('PHYSICAL COUNT')).toBeTruthy();
    expect(getByText('REASON')).toBeTruthy();
    expect(queryByText('QTY. IN')).toBeNull()
  });
});
