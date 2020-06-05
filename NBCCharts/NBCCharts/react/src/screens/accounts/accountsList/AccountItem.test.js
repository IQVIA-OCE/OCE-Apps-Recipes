import React from 'react';
import AccountItem from './AccountItem';
import renderer from 'react-test-renderer';
import * as mocks from '../../../__mocks__/mocks';
import { IconButton } from 'apollo-react-native';
import { navigator } from '../../../../bridge/Navigation/ScreenNavigator';

const createTestProps = (props) => ({
  navigation: {
    push: jest.fn(),
  },
  ...props
});

describe('AccountItem', () => {
  beforeEach(() => {
    navigator.dispatch = jest.fn().mockImplementation(() => Promise.resolve({}));
  });

  it('should render properly', () => {
    const tree = renderer.create(
      <AccountItem itemData={mocks.AccountItem.itemData} columns={mocks.AccountItem.columns} />
    ).toJSON();

    expect(tree).toMatchSnapshot()
  });

  it('should call buttons onPress', () => {
    const props = createTestProps({});
    const tree = renderer.create(
      <AccountItem itemData={mocks.AccountItem.itemData} columns={mocks.AccountItem.columns} {...props}/>
    );

    const iconButtons = tree.root.findAllByType(IconButton);

    iconButtons.forEach(el => el.props.onPress());
    expect(tree.toJSON()).toMatchSnapshot()
  })
});
