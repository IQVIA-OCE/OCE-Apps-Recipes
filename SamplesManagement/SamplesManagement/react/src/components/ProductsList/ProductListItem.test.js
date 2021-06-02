import React from 'react';
import renderer from 'react-test-renderer';
import ProductListItem from './ProductListItem';
import { TouchableOpacity } from 'react-native';

let item = {
    productName: 'productName',
    name: 'name',
  },
  onPress;

describe('ProductListItem', () => {
  beforeEach(() => {
    onPress = jest.fn();
  });
  it('Should render ProductListItem component', () => {
    const tree = renderer
      .create(<ProductListItem item={item} onPress={onPress} />);

    tree.root.findByType(TouchableOpacity).props.onPress();

    expect(onPress.mock.calls.length).toBe(1);
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('Should render ProductListItem component lock', () => {
    const tree = renderer.create(
      <ProductListItem item={{ ...item, locked: true }} onPress={onPress} />
    );

    tree.root.findByType(TouchableOpacity).props.onPress();

    expect(onPress.mock.calls.length).toBe(0);
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('Should render ProductListItem component selected', () => {
    const tree = renderer.create(
      <ProductListItem item={{ ...item, selected: true }} onPress={() => {}} />
    );

    tree.root.findByType(TouchableOpacity).props.onPress();

    expect(onPress.mock.calls.length).toBe(0);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
