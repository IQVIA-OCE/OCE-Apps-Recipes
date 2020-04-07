import React from 'react';
import AccountsScreen from './index';
import renderer from 'react-test-renderer';

describe('AccountsScreen', () => {
  it('should render properly', () => {
    const tree = renderer.create(
      <AccountsScreen/>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
