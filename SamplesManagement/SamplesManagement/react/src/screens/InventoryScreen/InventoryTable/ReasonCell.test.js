import React from 'react';
import ReasonCell from './ReasonCell';
import { Formik } from 'formik';
import { Select } from 'apollo-react-native';
import { InventoryContext } from '../InventoryContext';
import { INVENTORY_FORM_TYPE } from '../../../constants/Inventories';
import { render, act } from '@testing-library/react-native';

const Component = () => <ReasonCell row={{ id: '1' }} />;

describe('ReasonCell', () => {
  it('should render properly', async () => {
    const { getByTestId, container } = render(
      <InventoryContext.Provider
        value={{ editingType: INVENTORY_FORM_TYPE.edit, config: {} }}
      >
        <Formik initialValues={{ products: [{ id: '1', comments: '' }] }}>
          <Component />
        </Formik>
      </InventoryContext.Provider>
    );

    act(() => {
      container.findByType(Select).props.onChange({ id: '1', label: '1' });
    });

    expect(container.findByType(Select).props.value).toEqual({ id: '1', label: '1' });
    expect(getByTestId('ReasonCell')).toBeTruthy();
  });

  it('should NOT render component', async () => {
    const { queryByTestId, rerender } = render(
      <InventoryContext.Provider
        value={{
          config: { showCalculatedFields: true, showSystemCount: false },
          editingType: INVENTORY_FORM_TYPE.edit,
        }}
      >
        <Formik
          initialValues={{
            status: 'InProgress',
            products: [{ id: '1', comments: '' }],
          }}
        >
          <Component />
        </Formik>
      </InventoryContext.Provider>
    );

    expect(queryByTestId('ReasonCell')).toBeNull();
  });
});
