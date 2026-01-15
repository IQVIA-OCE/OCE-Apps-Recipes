import React from 'react';
import ProductsList from './ProductsList';
import { render } from '@testing-library/react-native';

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

    const { getByTestId } = render(
      <ProductsList
        data={products}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onItemPress={() => {}}
      />
    );

    expect(getByTestId).toBeTruthy();
  });

  it('Should render empty ProductsList', () => {
    const { queryByTestId } = render(
      <ProductsList data={{ allIds: [] }} refreshing={false} />
    );

    expect(queryByTestId('ProductListItem_Icon')).toBeNull();
  });
});
