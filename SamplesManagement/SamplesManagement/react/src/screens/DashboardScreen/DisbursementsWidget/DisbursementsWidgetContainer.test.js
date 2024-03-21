import React from 'react';
import {render, act, fireEvent} from '@testing-library/react-native';
import { useBoolean, useFetcher, useHandleData } from '../../../hooks';
import DisbursementsWidget from './DisbursementsWidgetContainer';
import { Provider } from '@oce-apps/apollo-react-native';
import HeaderControls from './HeaderControls';
import moment from 'moment';

jest.mock('../../../hooks');
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper')

jest.mock('moment', () => () => {
  const fakeMoment = {
    format: val => val,
    startOf: () => fakeMoment,
    subtract: () => fakeMoment,
  };

  return fakeMoment;
});

const disbursements = {
  data: {
    allIds: ['1', '2'],
    byId: {
      '1': {
        color: '#5899DA',
        data: [
          {
            tooltip: 'ADRAVIL: 3',
            x: 'Jul 04 2020 14:25:09 GMT+0300 (Eastern European Summer Time)',
            y: 3,
          },
          {
            tooltip: 'ADRAVIL: 3',
            x: 'Jul 04 2020 14:25:09 GMT+0300 (Eastern European Summer Time)',
            y: 3,
          },
          {
            tooltip: 'ADRAVIL: 3',
            x: 'Jul 04 2020 14:25:09 GMT+0300 (Eastern European Summer Time)',
            y: 3,
          },
        ],
        label: 'ADRAVIL',
      },
      '2': {
        color: '#2F6497',
        data: [
          {
            tooltip: 'null: 3',
            x: 'Jul 04 2020 14:25:09 GMT+0300 (Eastern European Summer Time)',
            y: 3,
          },
          {
            tooltip: 'null: 3',
            x: 'Jul 04 2020 14:25:09 GMT+0300 (Eastern European Summer Time)',
            y: 3,
          },
          {
            tooltip: 'null: 3',
            x: 'Jul 04 2020 14:25:09 GMT+0300 (Eastern European Summer Time)',
            y: 3,
          },
        ],
        label: '',
      },
    },
    colors: ['#5899DA', '#2F6497'],
  },
};

describe('DisbursementsWidget', () => {
  beforeEach(() => {
    useFetcher.mockReturnValue([disbursements]);
    useBoolean.mockReturnValue([
      true,
      { toggle: jest.fn(), setFalse: jest.fn(), setTrue: jest.fn() },
    ]);
    useHandleData.mockImplementation(data => fn => fn(data.data));
  });

  it('Should render properly', async () => {
    const { UNSAFE_root, getByText } = render(
      <Provider>
        <DisbursementsWidget />
      </Provider>
    );

    act(() => UNSAFE_root.findByType(HeaderControls).props.setFilter('2'));
    act(() => jest.advanceTimersByTime(4000));

    expect(getByText(/Disbursements/)).toBeTruthy();
  });
});
