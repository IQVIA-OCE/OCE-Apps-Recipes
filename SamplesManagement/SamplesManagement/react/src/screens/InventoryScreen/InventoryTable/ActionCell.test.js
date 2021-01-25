import React from 'react';
import ActionCell from './ActionCell';
import renderer, { act } from 'react-test-renderer';
import { IconButton } from 'apollo-react-native';
import { Formik } from 'formik';
import { InventoryContext } from '../InventoryContext';
import { INVENTORY_FORM_TYPE } from '../../../constants/Inventories';

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

    const tree = renderer.create(
      <Component onPress={onPress} row={{ lotNumberId: '1', locked: false }} />
    );

    act(() => tree.root.findByType(IconButton).props.onPress());

    expect(onPress).toHaveBeenCalledTimes(1);
    expect(tree.toJSON()).toMatchSnapshot();

    act(() =>
      tree.update(
        <Component onPress={onPress} row={{ Id: '1', locked: true }} />
      )
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
