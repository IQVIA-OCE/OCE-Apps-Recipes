import React from 'react';
import AccountDetailsScreen from './index';
import renderer from 'react-test-renderer';
import * as mocks from '../../__mocks__/mocks';
import { sfNetAPI } from '../../../bridge/sf/sfnetapi';
import { Platform } from 'react-native';
import * as constants from '../../constants';

jest.useFakeTimers();

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
      },
      CreatedDate: '2020-12-09T08:06:23'
    },
    {
      OCE__Account__r: {
        Id: '1'
      },
      CreatedDate: '2020-12-09T08:06:23'
    },
  ]
};

describe('AccountDetailsScreen', () => {
  beforeAll(() => {
    sfNetAPI.query = jest.fn()
      .mockImplementationOnce((soql, success) => {
        typeof success === 'function' ? success(data) : null;
      })
      .mockImplementationOnce((soql, success) => {
        typeof success === 'function' ? success({records: []}) : null;
      })
  });

  it('should render properly', () => {
    const props = createTestProps({});
    const tree = renderer.create(
      <AccountDetailsScreen {...props} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should render properly iPad version', () => {
    const props = createTestProps({});

    constants.isIphone = false;

    const tree = renderer.create(
      <AccountDetailsScreen {...props} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });


});
