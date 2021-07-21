import React from 'react';
import AccountItem from './AccountItem';
import renderer from 'react-test-renderer';
import * as mocks from '../../../__mocks__/mocks';
import { IconButton } from 'apollo-react-native';
import { navigator } from '../../../../bridge/Navigation/ScreenNavigator';
import * as constants from '../../../constants';

const createTestProps = (props) => ({
  navigation: {
    push: jest.fn(),
  },
  ...props
});

describe('AccountItem', () => {
  beforeEach(() => {
    jest.useFakeTimers();

    navigator.dispatch = jest.fn().mockImplementation(() => Promise.resolve({}));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render properly', () => {
    const tree = renderer.create(
      <AccountItem itemData={mocks.AccountItem.itemData} columns={mocks.AccountItem.columns} />
    ).toJSON();

    expect(tree).toMatchSnapshot()
  });

  it('should render with empty data', () => {
    const tree = renderer.create(
      <AccountItem itemData={{
        "Id": "a1j2D000000MNHhQAO2",
        "OCE__Rank__c": 10,
        "attributes": {
          "type": "OCE__NextBestCustomer__c",
          "url": "/services/data/v43.0/sobjects/OCE__NextBestCustomer__c/a1j2D000000MNHhQAO"
        },
        "OCE__TotalScore__c": 0,
        "OCE__NbcData__c": "{\"scores\":{\"isTarget\":0,\"recentlyCalled\":0},\"metrics\":{\"isTarget\":false,\"recentlyCalled\":\"DATA_NOT_AVAILABLE\"},\"customLabels\":{}}",
        "index": 10
      }} columns={mocks.AccountItem.columns} />
    ).toJSON();

    expect(tree).toMatchSnapshot()
  });

  it('should render properly onIpad', () => {
    constants.isIphone = false;

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
