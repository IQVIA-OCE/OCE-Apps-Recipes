import React from 'react';
import renderer, { act } from 'react-test-renderer';
import CallDetailsHistory from './CallDetailsHistory';
import api from './utils/api';
import { Autocomplete, Select, Search, Menu } from 'apollo-react-native';

const ACCOUNTS_MOCK = [
  {
    Name: 'Account Name',
    Id: 'testId'
  },
];

const CALLS_MOCK = [
  {
    Id: 'testCallId',
    OCE__CallDateTime__c: '2020-11-13T10:58:09.539Z',
    OCE__Call_c: 'testId',
  }
];

const PRODUCTS_MOCK = [
  {
    OCE__Product__r: {
      Id: 'testProductId',
      Name: 'Product Name'
    }
  }
]
describe('CallDetailsHistory', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should render properly', () => {
    const tree = renderer.create(
      <CallDetailsHistory />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should render with recordId', async () => {
    let tree;

    api.query = jest.fn()
      .mockResolvedValueOnce([ACCOUNTS_MOCK, {}]);

    await act(async () => {
      tree = renderer.create(
        <CallDetailsHistory recordId="test" />
      );
    });

    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should fetch accounts', () => {
    api.query = jest.fn()
      .mockResolvedValueOnce([ACCOUNTS_MOCK, {}]);

    const tree = renderer.create(
      <CallDetailsHistory />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should fetch accounts with error', () => {
    api.query = jest.fn()
      .mockRejectedValueOnce(new Error('Error message'));

    const tree = renderer.create(
      <CallDetailsHistory />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should render with selected account', async () => {
    let tree;

    api.query = jest.fn()
      .mockResolvedValueOnce([ACCOUNTS_MOCK, {}])
      .mockResolvedValueOnce([[CALLS_MOCK], {}])
      .mockResolvedValueOnce([[
        {
          OCE__Product__r: {
            Id: 'testProductId',
            Name: 'Product Name'
          }
        }
      ], {}]);

    await act(async () => {
      tree = renderer.create(
        <CallDetailsHistory />
      );
    });


    await act(async () => {
      const searchComponent = tree.root.findByType(Search);
      searchComponent.props.onChangeText('test');
      jest.advanceTimersByTime(500);
    });

    await act(async () => {
      const [menuComponent] = tree.root.findAllByType(Menu);
      menuComponent.props.children[2].props.children[0].props.onPress();
    });

    expect(tree).toMatchSnapshot();
  });

  it('should render without recent calls', async () => {
    let tree;

    api.query = jest.fn()
      .mockResolvedValueOnce([ACCOUNTS_MOCK, {}])
      .mockResolvedValueOnce([[], {}]);

    await act(async () => {
      tree = renderer.create(
        <CallDetailsHistory />
      );
    });

    expect(tree).toMatchSnapshot();
  });

  it('should render with custom period', async () => {
    let tree;

    api.query = jest.fn()
      .mockResolvedValueOnce([ACCOUNTS_MOCK, {}])
      .mockResolvedValueOnce([CALLS_MOCK, {}])
      .mockResolvedValueOnce([PRODUCTS_MOCK, {}]);

    await act(async () => {
      tree = renderer.create(
        <CallDetailsHistory />
      );
    });


    await act(async () => {
      const searchComponent = tree.root.findByType(Search);
      searchComponent.props.onChangeText('test');
      jest.advanceTimersByTime(500);
    });

    await act(async () => {
      const [menuComponent] = tree.root.findAllByType(Menu);
      menuComponent.props.children[2].props.children[0].props.onPress();
    });

    act(() => {
      const selectComponent = tree.root.findByType(Select);
      selectComponent.props.onChange(6);
    });

    expect(tree).toMatchSnapshot();
  });

  it('should open ProductsMenu', async () => {
    let tree;

    api.query = jest.fn()
      .mockResolvedValueOnce([ACCOUNTS_MOCK, {}])
      .mockResolvedValueOnce([CALLS_MOCK, {}])
      .mockResolvedValueOnce([PRODUCTS_MOCK, {}]);

    await act(async () => {
      tree = renderer.create(
        <CallDetailsHistory />
      );
    });

    await act(async () => {
      const searchComponent = tree.root.findByType(Search);
      searchComponent.props.onChangeText('test');
      jest.advanceTimersByTime(500);
    });

    await act(async () => {
      const [menuComponent] = tree.root.findAllByType(Menu);
      menuComponent.props.children[2].props.children[0].props.onPress();
    });

    await act(async () => {
      const filterButton = tree.root.findByProps({
        icon: 'filter'
      });
      filterButton.props.onPress();
    });

    expect(tree).toMatchSnapshot();
  });
});
