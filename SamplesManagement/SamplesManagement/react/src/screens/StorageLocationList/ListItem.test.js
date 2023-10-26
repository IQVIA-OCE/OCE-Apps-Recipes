import React from 'react';
import ListItem from './ListItem';
import { IconButton, RadioButton } from 'apollo-react-native';
import { render } from '@testing-library/react-native';

describe('ListItem', () => {
  it('Should render ListItem component', () => {
    const handleChange = jest.fn();
    const handleDelete = jest.fn();
    const handleEdit = jest.fn();
    
    const { container } = render(
      <ListItem
        item={{ address: 'address 1', isDefault: false, id: '1' }}
        handleChange={handleChange}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
      />
    );

    container.findAllByType(IconButton)[0].props.onPress();
    expect(handleDelete).toHaveBeenCalledTimes(1);

    container.findAllByType(IconButton)[1].props.onPress();
    expect(handleEdit).toHaveBeenCalledTimes(1);

    container.findByType(RadioButton).props.onPress();
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith('1');
  });

  it('Should not call change default', () => {
    const handleChange = jest.fn();
    const { container } = render(
      <ListItem
        item={{ address: 'address 1', isDefault: true, id: '1' }}
        handleChange={handleChange}
      />
    );

    container.findByType(RadioButton).props.onPress();
    expect(handleChange).toHaveBeenCalledTimes(0);
  });
});
