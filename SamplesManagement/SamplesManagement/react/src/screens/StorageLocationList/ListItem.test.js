import React from 'react';
import renderer from 'react-test-renderer';
import ListItem from './ListItem';
import { IconButton, RadioButton } from 'apollo-react-native';

describe('ListItem', () => {
  it('Should render ListItem component', () => {
    const handleChange = jest.fn();
    const handleDelete = jest.fn();
    const handleEdit = jest.fn();
    const tree = renderer.create(
      <ListItem
        item={{ address: 'address 1', isDefault: false, id: '1' }}
        handleChange={handleChange}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
      />
    );

    tree.root.findAllByType(IconButton)[0].props.onPress();
    expect(handleDelete).toHaveBeenCalledTimes(1);

    tree.root.findAllByType(IconButton)[1].props.onPress();
    expect(handleEdit).toHaveBeenCalledTimes(1);

    tree.root.findByType(RadioButton).props.onPress();
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith('1');

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('Should not call change default', () => {
    const handleChange = jest.fn();
    const tree = renderer.create(
      <ListItem
        item={{ address: 'address 1', isDefault: true, id: '1' }}
        handleChange={handleChange}
      />
    );
    tree.root.findByType(RadioButton).props.onPress();
    expect(handleChange).toHaveBeenCalledTimes(0);
  });
});
