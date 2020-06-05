import React from 'react';
import AccountDetailsScreen from './index';
import renderer from 'react-test-renderer';
import * as mocks from '../../__mocks__/mocks';
import { sfNetAPI } from '../../../bridge/sf/sfnetapi';

const createTestProps = (props) => ({
  navigation: {
    getParam: jest.fn(() => mocks.NBCAccountData)
  },
  ...props
});

const data = {
  records: [
    {
      OCE__Account__r: {
        Id: '1'
      }
    }
  ]
};

describe('AccountDetailsScreen', () => {
  beforeEach(() => {
    sfNetAPI.query = jest.fn()
      .mockImplementation((soql, success) => {
        typeof success === 'function' ? success(data) : null;
      })
  });

  it('should render properly', () => {
    const props = createTestProps({});
    const tree = renderer.create(
      <AccountDetailsScreen {...props} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });


});
