import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { useBoolean, useFetcher, useHandleData } from '../../../hooks';
import DisbursementsWidget from './DisbursementsWidgetContainer';
import { Provider } from 'apollo-react-native';
import HeaderControls from './HeaderControls';
import moment from 'moment';

jest.mock('../../../hooks');
jest.useFakeTimers();

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
    colors: ['#000', '#fff'],
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
    const promise = Promise.resolve();
    const tree = renderer.create(
      <Provider>
        <DisbursementsWidget />
      </Provider>
    );

    act(() => tree.root.findByType(HeaderControls).props.setFilter('2'));
    act(() => jest.advanceTimersByTime(4000));
    await act(() => promise);

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
