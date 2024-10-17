import React from 'react';
import ProductListItem from './ProductListItem';
import {fireEvent, render} from '@testing-library/react-native';

let item = {
    productName: 'productName',
    name: 'name',
  },
  onPress = jest.fn();

describe('ProductListItem', () => {
  beforeEach(() => {
    onPress.mockClear();
  });

  it('Should render ProductListItem component', () => {
    const { getByTestId } = render(<ProductListItem item={item} onPress={onPress} />);

    fireEvent.press(getByTestId('ProductListItem'))

    expect(onPress).toBeCalled()
  });

  it('Should render ProductListItem component lock', () => {
    const { getByTestId } = render(
      <ProductListItem item={{ ...item, locked: true }} onPress={onPress} />
    );

    fireEvent.press(getByTestId('ProductListItem'))

    expect(onPress).toBeCalledTimes(0);
  });

  it('Should render ProductListItem component selected', () => {
    const { getByTestId } = render(
      <ProductListItem item={{ ...item, selected: true }} onPress={() => {}} />
    );

    expect(getByTestId('ProductListItem_Icon')).toBeTruthy();
  });
});
