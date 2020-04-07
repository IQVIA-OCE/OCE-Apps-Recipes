import React from 'react';
import AccountDetailsScreen from './index';
import renderer from 'react-test-renderer';
import * as mocks from '../../__mocks__/mocks';

const createTestProps = (props) => ({
  navigation: {
    getParam: jest.fn(() => mocks.NBCAccountData)
  },
  ...props
});

describe('AccountDetailsScreen', () => {
  it('should render properly', () => {
    const props = createTestProps({});
    const tree = renderer.create(
      <AccountDetailsScreen {...props} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
