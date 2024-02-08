import React from 'react';
import ActionCell from './ActionCell';
import { IconButton } from '@oce-apps/apollo-react-native';
import { Formik } from 'formik';
import { InventoryContext } from '../InventoryContext';
import { INVENTORY_FORM_TYPE } from '../../../constants/Inventories';
import { render, act } from '@testing-library/react-native';

describe('ActionCell', () => {
  it('should render properly', () => {
    const onPress = jest.fn();
    const Component = props => (
      <InventoryContext.Provider
        value={{ editingType: INVENTORY_FORM_TYPE.edit }}
      >
        <Formik initialValues={{ products: [{ lotNumberId: '1' }] }}>
          <ActionCell {...props} />
        </Formik>
      </InventoryContext.Provider>
    );

    const { UNSAFE_root, rerender } = render(<Component onPress={onPress} row={{ lotNumberId: '1', locked: false }} />);

    act(() => UNSAFE_root.findByType(IconButton).props.onPress());

    expect(onPress).toHaveBeenCalledTimes(1);

    rerender(<Component onPress={onPress} row={{ Id: '1', locked: true }} />)

    expect(UNSAFE_root.findByType(IconButton).props.icon).toBe('lock')
  });
});
