import React from 'react';
import renderer, { act } from 'react-test-renderer';
import HeaderControls from './HeaderControls';
import { IconButton, Select, Menu } from 'apollo-react-native';
import { useBoolean, useHandleData } from '../../../hooks';

const items = [
  { label: 'Last 3 Months', id: '2' },
  { label: 'Last 6 Months', id: '5' },
  { label: 'Last 12 Months', id: '11' },
];

const setPeriod = jest.fn();
const setFilter = jest.fn();
const disbursements = {
  data: {
    colors: ['#000'],
    allIds: ['1', '2'],
    byId: {
      1: {
        id: '1',
        label: 'ads',
      },
      2: {
        id: '2',
        label: 'ads 2',
      },
    },
  },
};

jest.mock('../../../hooks');

describe('HeaderControls', () => {
  beforeEach(() => {
    useBoolean.mockReturnValue([true, { toggle: jest.fn(), setFalse: jest.fn() }]);
    useHandleData.mockImplementation(data => fn => fn(data.data));
  });
  it('should render properly', async () => {
    const promise = Promise.resolve();
    const tree = renderer.create(
      <HeaderControls
        items={items}
        period={'2'}
        setPeriod={setPeriod}
        disbursements={disbursements}
        filtered={['1']}
        setFilter={setFilter}
      />
    );
    act(() => tree.root.findAllByType(IconButton)[1].props.onPress());
    act(() => tree.root.findByType(Select).props.onChange());
    act(() => tree.root.findAllByType(Menu)[1].props.onDismiss());
    await act(() => promise);

    expect(tree.toJSON()).toMatchSnapshot();
    expect(setPeriod).toBeCalledTimes(1);
  });
});
