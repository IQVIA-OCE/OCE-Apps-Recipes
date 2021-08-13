import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { Formik } from 'formik';
import { InventoryContext } from '../InventoryContext';
import InventoryReason from './InventoryReason';
import { Provider, Select } from 'apollo-react-native';
import { INVENTORY_FORM_TYPE } from '../../../constants/Inventories';

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
  it('should render properly', () => {
    let tree;
    act(() => {
      tree = renderer.create(
        <Component editingType={INVENTORY_FORM_TYPE.edit} />
      );
    });

    act(() => {
      tree.root
        .findByType(Select)
        .props.onChange({ label: 'Damaged', id: 'Damaged' });
    });

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should render preview', () => {
    let tree;
    act(() => {
      tree = renderer.create(
        <Component editingType={INVENTORY_FORM_TYPE.preview} />
      );
    });

    expect(tree.toJSON()).toMatchSnapshot();
  })
});
