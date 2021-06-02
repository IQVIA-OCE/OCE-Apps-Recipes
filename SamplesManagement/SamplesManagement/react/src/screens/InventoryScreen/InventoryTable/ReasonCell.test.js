import React from 'react';
import renderer, { act } from 'react-test-renderer';
import ReasonCell from './ReasonCell';
import { FieldArray, Formik } from 'formik';
import { Select } from 'apollo-react-native';
import { InventoryContext } from '../InventoryContext';
import { INVENTORY_FORM_TYPE } from '../../../constants/Inventories';

const Component = () => <ReasonCell row={{ id: '1' }} />;

describe('ReasonCell', () => {
  it('should render properly', async () => {
    let tree;
    act(() => {
      tree = renderer.create(
        <InventoryContext.Provider
          value={{ editingType: INVENTORY_FORM_TYPE.edit, config: {} }}
        >
          <Formik initialValues={{ products: [{ id: '1', comments: '' }] }}>
            <Component />
          </Formik>
        </InventoryContext.Provider>
      );
    });

    act(() => {
      tree.root.findByType(Select).props.onChange({ id: '1', label: '1' });
    });

    expect(tree.toJSON()).toMatchSnapshot();
    act(() => {
      tree.update(
        <Formik
          initialValues={{
            status: 'Saved',
            products: [{ id: '1', comments: '' }],
          }}
        >
          <Component />
        </Formik>
      );
    });

    expect(tree.toJSON()).toMatchSnapshot();
    act(() => {
      tree.update();
    });
  });

  it('should NOT render component', async () => {
    let tree;
    act(() => {
      tree = renderer.create(
        <InventoryContext.Provider
          value={{
            config: { showCalculatedFields: true, showSystemCount: false },
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
    });

    expect(tree.toJSON()).toMatchSnapshot();
    act(() => {
      tree.update(
        <InventoryContext.Provider
          value={{
            config: { showCalculatedFields: false, showSystemCount: true },
          }}
        >
          <Formik
            initialValues={{
              status: 'Saved',
              products: [{ id: '1', comments: '' }],
            }}
          >
            <ReasonCell
              row={{ id: '1', physicalQuantity: '3', systemCount: '3' }}
            />
          </Formik>
        </InventoryContext.Provider>
      );
    });

    expect(tree.toJSON()).toMatchSnapshot();
    act(() => {
      tree.update();
    });
  });
});
