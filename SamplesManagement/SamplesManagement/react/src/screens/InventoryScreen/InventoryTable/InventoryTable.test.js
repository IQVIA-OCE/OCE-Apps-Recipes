import React from 'react';
import renderer, { act } from 'react-test-renderer';
import InventoryTable from './InventoryTable';
import { Formik } from 'formik';
import { InventoryContext } from '../InventoryContext';

describe('TransactionTable', () => {
  it('should render component', async () => {
    const promise = Promise.resolve();
    let tree;
    act(() => {
      tree = renderer.create(
        <InventoryContext.Provider
          value={{
            config: { showCalculatedFields: true, showSystemCount: true },
          }}
        >
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
              form={{ values: { recordType: 'Adjustment' } }}
            />
          </Formik>
        </InventoryContext.Provider>
      );
    });

    await act(() => promise);
    expect(tree.toJSON()).toMatchSnapshot();
  });
  it('should render component with different record type', async () => {
    const promise = Promise.resolve();
    let tree;
    act(() => {
      tree = renderer.create(
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
      );
    });

    await act(() => promise);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
