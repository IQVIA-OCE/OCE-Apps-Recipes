import React from 'react';
import AccountsScreen from './index';
import renderer from 'react-test-renderer';
import { sfNetAPI } from '../../../bridge/sf/sfnetapi';
import { IconButton, Menu, Search } from 'apollo-react-native';
import { FlatList } from 'react-native';

const data = {
  records: [
    {
      OCE__Account__r: {
        Id: '1'
      }
    }
  ]
};

describe('AccountsScreen', () => {
  beforeEach(() => {
    sfNetAPI.query = jest.fn()
      .mockImplementation((soql, success, error) => {
        typeof success === 'function' ? success(data) : null;
        typeof error === 'function' ? error({ message: 'Error' }) : null;
      })
  });

  it('should render properly', () => {
    const tree = renderer.create(
      <AccountsScreen/>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should call toggleSortDirection', () => {
    const tree = renderer.create(
      <AccountsScreen />
    );

    const toggleSortDirectionButton = tree.root
      .findAllByType(IconButton)
      .find(el => el.props.icon === 'arrow-down');

    toggleSortDirectionButton.props.onPress();

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call sortBy', () => {
    const tree = renderer.create(
      <AccountsScreen />
    );

    const menuItem = tree.root
      .findByType(Menu)
      .children[0].props.children[0].props.children;

    menuItem.props.onPress();
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call searchDebounced', () => {
    const tree = renderer.create(
      <AccountsScreen />
    );

    const searchComponent = tree.root
      .findByType(Search);
    searchComponent.props.onChangeText('Search query');
    searchComponent.props.onIconPress();
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call changeQuery', () => {
    const tree = renderer.create(
      <AccountsScreen />
    );

    const searchComponent = tree.root
      .findByType(Search);

    searchComponent.props.onChangeText();
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call queryMore', () => {
    const tree = renderer.create(
      <AccountsScreen />
    );

    const flatListComponent = tree.root
      .findByType(FlatList);

    flatListComponent.props.onEndReached();
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should call queryMore with filterQuery parameter', () => {
    const tree = renderer.create(
      <AccountsScreen />
    );

    tree.root.findByType(Search).props.onChangeText('Filter query');

    const flatListComponent = tree.root
      .findByType(FlatList);

    flatListComponent.props.onEndReached();
    expect(tree.toJSON()).toMatchSnapshot();
  });

});
