import React from 'react';
import renderer from 'react-test-renderer';
import ProductsList from './ProductsList';

describe('ProductsList', () => {
  it('Should render ProductsList component', () => {
    const products = {
      allIds: [1],
      byId: {
        1: {
          Id: '1',
          name: 'name',
          productName: 'productName',
        },
      },
    };
    const refreshing = false;
    const onRefresh = jest.fn();
    const tree = renderer.create(
      <ProductsList
        data={products}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onItemPress={() => {}}
      />
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('Should render empty ProductsList', () => {
    const tree = renderer.create(
      <ProductsList data={{ allIds: [] }} refreshing={false} />
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
