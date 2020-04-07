import React from 'react';
import AccountItem from './AccountItem';
import renderer from 'react-test-renderer';
import * as mocks from '../../../__mocks__/mocks';

describe('AccountItem', () => {
  it('should render properly', () => {
    const tree = renderer.create(
      <AccountItem itemData={mocks.AccountItem.itemData} columns={mocks.AccountItem.columns} />
    ).toJSON();

    expect(tree).toMatchSnapshot()
  })
});
