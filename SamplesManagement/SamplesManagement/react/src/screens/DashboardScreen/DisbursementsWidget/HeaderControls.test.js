import React from 'react';
import HeaderControls from './HeaderControls';
import {IconButton, Select, Menu, Provider} from 'apollo-react-native';
import { useBoolean, useHandleData } from '../../../hooks';
import { render, act } from '@testing-library/react-native';

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
    const { container, getByText } = render(
      <Provider>
        <HeaderControls
          items={items}
          period={'2'}
          setPeriod={setPeriod}
          disbursements={disbursements}
          filtered={['1']}
          setFilter={setFilter}
        />
      </Provider>
    );
    act(() => container.findAllByType(IconButton)[1].props.onPress());
    act(() => container.findByType(Select).props.onChange());
    act(() => container.findAllByType(Menu)[1].props.onDismiss());
    await act(() => promise);

    expect(getByText(/ads 2/)).toBeTruthy();
    expect(setPeriod).toBeCalledTimes(1);
  });
});
