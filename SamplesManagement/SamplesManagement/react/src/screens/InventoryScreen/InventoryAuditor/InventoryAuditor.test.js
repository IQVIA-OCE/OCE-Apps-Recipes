import React from 'react';
import { Formik } from 'formik';
import InventoryAuditor from './InventoryAuditor';
import { Provider, Search } from '@oce-apps/apollo-react-native';
import { InventoryContext } from '../InventoryContext';
import { INVENTORY_FORM_TYPE } from '../../../constants/Inventories';
import { render, act, fireEvent } from '@testing-library/react-native';

const Component = ({ editingType, auditor }) => (
  <Provider>
    <InventoryContext.Provider
      value={{
        editingType,
      }}
    >
      <Formik
        initialValues={{
          auditor,
          id: '123',
          status: 'Saved',
          products: [{ id: '1' }],
        }}
      >
        <InventoryAuditor />
      </Formik>
    </InventoryContext.Provider>
  </Provider>
);

describe('InventoryAuditor', () => {
  it('should render properly', () => {
    const { UNSAFE_root, getByText } = render(
      <Component editingType={INVENTORY_FORM_TYPE.edit} />
    );

    fireEvent(UNSAFE_root.findByType(Search), 'onIconPress');
    fireEvent.changeText(UNSAFE_root.findByType(Search), 'some text');
    act(() => jest.runAllTimers());

    expect(getByText(/District Manager/)).toBeTruthy();
  });

  it('should render readonly component', () => {
    const { getByText } = render(<Component editingType={INVENTORY_FORM_TYPE.editSaved} auditor="0056F00000A4qgKQAR" />);
    act(() => jest.runAllTimers());

    expect(getByText(/District Manager/)).toBeTruthy();
  });
});
