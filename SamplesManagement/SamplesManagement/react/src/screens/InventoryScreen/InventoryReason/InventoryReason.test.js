import React from 'react';
import { Formik } from 'formik';
import { InventoryContext } from '../InventoryContext';
import InventoryReason from './InventoryReason';
import { Provider, Select } from '@oce-apps/apollo-react-native';
import { INVENTORY_FORM_TYPE } from '../../../constants/Inventories';
import { render, act, fireEvent } from '@testing-library/react-native';

const Component = ({ editingType }) => (
  <Provider>
    <InventoryContext.Provider
      value={{
        editingType,
      }}
    >
      <Formik
        initialValues={{
          id: '123',
          reason: 'Damaged',
          status: 'Saved',
          products: [{ id: '1' }],
        }}
      >
        <InventoryReason />
      </Formik>
    </InventoryContext.Provider>
  </Provider>
);

describe('InventoryReason', () => {
  it('should render properly', () => {
    const { getByText, UNSAFE_root } = render(<Component editingType={INVENTORY_FORM_TYPE.edit} />);

    fireEvent(UNSAFE_root.findByType(Select), 'onChange', { label: 'Damaged', id: 'Damaged' });
    act(() => jest.runAllTimers());

    expect(getByText(/Damaged/)).toBeTruthy();
  });

  it('should render preview', () => {
    const { getByText } = render(<Component editingType={INVENTORY_FORM_TYPE.preview} />);

    expect(getByText(/Damaged/)).toBeTruthy();
  })
});
