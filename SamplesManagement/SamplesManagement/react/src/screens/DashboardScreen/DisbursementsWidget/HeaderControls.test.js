import React from 'react';
import HeaderControls from './HeaderControls';
import {IconButton, Select, Menu, Provider} from '@oce-apps/apollo-react-native';
import { useBoolean } from '../../../hooks';
import { render, act, fireEvent } from '@testing-library/react-native';

jest.mock('../../../hooks/useBoolean');
const items = [
  { label: 'Last 3 Months', id: '2' },
  { label: 'Last 6 Months', id: '5' },
  { label: 'Last 12 Months', id: '11' },
];

const setPeriod = jest.fn();
const setFilter = jest.fn();
const disbursements = {
  error: '',
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

describe('HeaderControls', () => {
  beforeEach(() => {
    useBoolean.mockReturnValue([true, { toggle: jest.fn(), setFalse: jest.fn() }]);
  });

  it('should render properly', () => {
    const { UNSAFE_root, getByText } = render(
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
    act(() => jest.runAllTimers());

    fireEvent.press(UNSAFE_root.findAllByType(IconButton)[1]);
    fireEvent(UNSAFE_root.findByType(Select), 'change');
    fireEvent(UNSAFE_root.findAllByType(Menu)[1], 'onDismiss');

    expect(getByText(/ads 2/)).toBeTruthy();
    expect(setPeriod).toBeCalledTimes(1);
  });
});
