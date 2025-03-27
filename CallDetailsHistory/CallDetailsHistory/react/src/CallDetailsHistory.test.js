import { act, render, waitFor } from '@testing-library/react-native';
import { IconButton, LineChart, Menu, Provider, Search } from '@oce-apps/apollo-react-native';
import React from 'react';
import { fetchAccountById, fetchAccounts } from './api/callDetailsHistoryApi';
import CallDetailsHistory from './CallDetailsHistory';
import { getFilteredColors, getNormalizedChartData, getNormalizedData } from './helpers';
import { ACCOUNTS_MOCK, NORMALIZED_DATA } from './mocks/dataMocks';

jest.mock('./api/callDetailsHistoryApi', () => ({
  fetchAccountById: jest.fn(),
  fetchAccounts: jest.fn(),
}));

jest.mock('./helpers', () => ({
  getNormalizedData: jest.fn(),
  getNormalizedChartData: jest.fn(),
  getFilteredColors: jest.fn(),
}));

const CHART_DATA_MOCK = [
  {
    data: [
      {
        x: 'Apr 2022',
        y: 0,
        tooltip: 'A:Maxton: Submitted 0 times',
      },
      {
        x: 'May 2022',
        y: 0,
        tooltip: 'A:Maxton: Submitted 0 times',
      },
      {
        x: 'Jun 2022',
        y: 0,
        tooltip: 'A:Maxton: Submitted 0 times',
      },
      {
        x: 'Jul 2022',
        y: 0,
        tooltip: 'A:Maxton: Submitted 0 times',
      },
      {
        x: 'Aug 2022',
        y: 1,
        tooltip: 'A:Maxton: Submitted 1 times',
      },
      {
        x: 'Sep 2022',
        y: 0,
        tooltip: 'A:Maxton: Submitted 0 times',
      },
    ],
  },
  {
    data: [
      {
        x: 'Apr 2022',
        y: 0,
        tooltip: 'B:Alodox: Submitted 0 times',
      },
      {
        x: 'May 2022',
        y: 0,
        tooltip: 'B:Alodox: Submitted 0 times',
      },
      {
        x: 'Jun 2022',
        y: 0,
        tooltip: 'B:Alodox: Submitted 0 times',
      },
      {
        x: 'Jul 2022',
        y: 0,
        tooltip: 'B:Alodox: Submitted 0 times',
      },
      {
        x: 'Aug 2022',
        y: 0,
        tooltip: 'B:Alodox: Submitted 0 times',
      },
      {
        x: 'Sep 2022',
        y: 1,
        tooltip: 'B:Alodox: Submitted 1 times',
      },
    ],
  },
];

const ACCOUNT_LIST_MOCK = [
  {
    value: '0',
    label: 'Danca Luchici',
  },
  {
    value: '1',
    label: 'David Labotka',
  },
];

describe('CallDetailsHistory', () => {
  beforeEach(() => {
    fetchAccountById.mockReset();
    fetchAccounts.mockReset();
    getNormalizedData.mockReset();
    getNormalizedChartData.mockReset();
    getFilteredColors.mockReset();
  });

  it('should render properly', () => {
    const { queryByText } = render(<CallDetailsHistory />);

    expect(queryByText(/No account selected./)).toBeTruthy();
  });

  it('should render chart if component gets all needed data', async () => {
    fetchAccountById.mockResolvedValueOnce(ACCOUNTS_MOCK[0]);
    getNormalizedData.mockResolvedValueOnce(NORMALIZED_DATA);
    getFilteredColors.mockReturnValueOnce(['#5899DA', '#2F6497']);
    getNormalizedChartData.mockReturnValue(CHART_DATA_MOCK);
    const { UNSAFE_root } = render(<CallDetailsHistory recordId={'0'} />);

    await waitFor(() => {
      expect(UNSAFE_root.findByType(Search).props.value).toBe(ACCOUNTS_MOCK[0].Name);
      expect(UNSAFE_root.findByType(LineChart)).toBeTruthy();
    });
  });

  it('should render special message if no selected products', async () => {
    fetchAccountById.mockResolvedValueOnce(ACCOUNTS_MOCK[0]);
    getNormalizedData.mockResolvedValueOnce([]);
    getFilteredColors.mockReturnValueOnce([]);
    getNormalizedChartData.mockReturnValueOnce(CHART_DATA_MOCK);
    getNormalizedChartData.mockReturnValueOnce([]);
    const { queryByText } = render(<CallDetailsHistory recordId={'0'} />);

    await waitFor(() => {
      expect(queryByText(/No products selected./)).toBeTruthy();
    });
  });

  it('should open list of accounts when it is searching', async () => {
    fetchAccounts.mockResolvedValue(ACCOUNT_LIST_MOCK);
    const { queryByText, UNSAFE_root } = render(
      <Provider>
        <CallDetailsHistory />
      </Provider>,
    );

    await waitFor(() => {
      expect(UNSAFE_root.findAllByType(Menu.Item).length).toEqual(0);
    });

    await waitFor(() => {
      UNSAFE_root.findByType(Search).props.onFocus();
    });

    await waitFor(() => {
      UNSAFE_root.findByType(Search).props.onChangeText('test');
    });

    await waitFor(() => {
      expect(UNSAFE_root.findAllByType(Menu.Item).length).toEqual(2);
      expect(queryByText(/David Labotka/)).toBeTruthy();
    });
  });

  it('should close list of accounts', async () => {
    fetchAccounts.mockResolvedValueOnce(ACCOUNTS_MOCK.map((el) => ({
      label: el.Name,
      value: el.Id,
    })));
    const { UNSAFE_root } = render(
      <Provider>
        <CallDetailsHistory />
      </Provider>,
    );

    act(() => {
      UNSAFE_root.findByType(Search).props.onFocus();
    });

    await waitFor(() => {
      expect(UNSAFE_root.findAllByType(Menu)[0].props.visible).toBeTruthy();
    });

    act(() => {
      UNSAFE_root.findAllByType(Menu)[0].props.onDismiss();
    });

    await waitFor(() => {
      expect(UNSAFE_root.findAllByType(Menu)[0].props.visible).toBeFalsy();
    });
  });

  it('should change account name in search input if accounts was selected', async () => {
    fetchAccounts.mockResolvedValue(ACCOUNT_LIST_MOCK);
    const { queryByText, UNSAFE_root } = render(
      <Provider>
        <CallDetailsHistory />
      </Provider>,
    );

    await waitFor(() => {
      expect(UNSAFE_root.findByType(Search).props.value).toBe('');
      expect(UNSAFE_root.findAllByType(Menu.Item).length).toEqual(0);
    });

    await waitFor(() => {
      UNSAFE_root.findByType(Search).props.onFocus();
    });

    await waitFor(() => {
      UNSAFE_root.findByType(Search).props.onChangeText('test');
    });

    await waitFor(() => {
      expect(UNSAFE_root.findAllByType(Menu.Item).length).toEqual(2);
      expect(queryByText(/David Labotka/)).toBeTruthy();
    });

    await waitFor(() => {
      UNSAFE_root.findAllByType(Menu.Item)[1].props.onPress();
    });

    await waitFor(() => {
      expect(UNSAFE_root.findAllByType(Menu.Item).length).toEqual(0);
      expect(UNSAFE_root.findByType(Search).props.value).toBe('David Labotka');
    });
  });

  it('should start refreshing if refresh button was pressed', async () => {
    const consoleWarnSpyOn = jest.spyOn(global.console, 'warn');

    fetchAccountById.mockResolvedValueOnce(ACCOUNTS_MOCK[0]);
    getNormalizedData.mockResolvedValue(NORMALIZED_DATA);
    getFilteredColors.mockReturnValue(['#5899DA', '#2F6497']);
    getNormalizedChartData.mockReturnValue(CHART_DATA_MOCK);
    const { UNSAFE_root } = render(<CallDetailsHistory recordId={'0'} />);

    await waitFor(() => {
      expect(UNSAFE_root.findByType(Search).props.value).toBe(ACCOUNTS_MOCK[0].Name);
      expect(UNSAFE_root.findByType(LineChart)).toBeTruthy();
    });

    act(() => {
      UNSAFE_root.findAllByType(IconButton).find(el => el.props.icon === 'refresh').props.onPress();
    });

    await waitFor(() => {
      expect(consoleWarnSpyOn).toHaveBeenCalled();
      expect(getNormalizedData.mock.calls.length).toEqual(2);
      expect(UNSAFE_root.findByType(Search).props.value).toBeUndefined();
    });
  });
});
