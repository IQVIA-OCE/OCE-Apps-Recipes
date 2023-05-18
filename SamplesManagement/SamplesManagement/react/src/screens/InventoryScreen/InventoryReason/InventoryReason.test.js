import React from 'react';
import { Formik } from 'formik';
import { InventoryContext } from '../InventoryContext';
import InventoryReason from './InventoryReason';
import { Provider, Select } from 'apollo-react-native';
import { INVENTORY_FORM_TYPE } from '../../../constants/Inventories';
import { render, act } from '@testing-library/react-native';

jest.useFakeTimers();

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
  it('should render properly', async () => {
    const { getByText, container } = render(<Component editingType={INVENTORY_FORM_TYPE.edit} />);

    act(() => {
      container
        .findByType(Select)
        .props.onChange({ label: 'Damaged', id: 'Damaged' });
    });

    expect(getByText(/Damaged/)).toBeTruthy();
  });

  it('should render preview', async () => {
    const { getByText } = render(<Component editingType={INVENTORY_FORM_TYPE.preview} />);

    expect(getByText(/Damaged/)).toBeTruthy();
  })
});
