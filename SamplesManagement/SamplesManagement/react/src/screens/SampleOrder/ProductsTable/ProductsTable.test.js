import React from 'react';
import renderer, { act } from 'react-test-renderer';
import ProductsTable from './ProductsTable';

describe('ProductsTable', () => {
  it('should render component', async () => {
    const promise = Promise.resolve();
    let tree;
    act(() => {
      tree = renderer.create(
        <ProductsTable
          rows={[]}
          showProductAllocationRemaining={false}
        />
      );
    });

    await act(() => promise);
    expect(tree.toJSON()).toMatchSnapshot();
  });
  it('should render component with showing remaining product allocations', async () => {
    const promise = Promise.resolve();
    let tree;
    act(() => {
      tree = renderer.create(
        <ProductsTable
          rows={[]}
          showProductAllocationRemaining={true}
        />
      );
    });

    await act(() => promise);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
