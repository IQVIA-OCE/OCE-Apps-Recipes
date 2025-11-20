import { act, fireEvent, render } from '@testing-library/react-native';
import {
  Button,
  Provider as ApolloProvider,
  Search,
  Tooltip,
} from '@oce-apps/apollo-react-native';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ListEmptyComponent } from '../../components/ListEmptyComponent';
import {
  LOADING_STATUS,
  MAPPED_BUDGETS_DATA,
  MAPPED_MEETING_DATA,
} from '../../constants';
import * as commonUtils from '../../utils/common';
import { BudgetPickerScreen } from './BudgetPickerScreen';

const dispatch = jest.fn();

jest.mock('../../utils/dateTimeFormat', () => ({
  formatDate: (date) => date,
}));
jest.mock('../../api/budgetsApi');
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

describe('BudgetPickerScreen', () => {
  beforeEach(() => {
    dispatch.mockReset();
    useSelector.mockReset();
    useDispatch.mockReset();
    useDispatch.mockImplementation(() => dispatch);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should render correctly', () => {
    useSelector.mockImplementation((cb) =>
      cb({
        budgetPicker: {
          budgets: MAPPED_BUDGETS_DATA,
          meeting: MAPPED_MEETING_DATA,
          isSystemGeneratedFilterEnabled: true,
          params: {
            searchQuery: '',
          },
        },
      })
    );
    const { getByText } = render(
      <ApolloProvider>
        <BudgetPickerScreen />
      </ApolloProvider>
    );

    expect(getByText(/Select Meeting Budget/i)).toBeTruthy();
    expect(getByText(/Akron Budget/i)).toBeTruthy();
  });

  test('should render ListEmptyComponent component if budgets are empty', () => {
    useSelector.mockImplementation((cb) =>
      cb({
        budgetPicker: {
          budgets: [],
          meeting: MAPPED_MEETING_DATA,
          params: {
            searchQuery: '',
          },
        },
      })
    );
    const { UNSAFE_getByType } = render(
      <ApolloProvider>
        <BudgetPickerScreen />
      </ApolloProvider>
    );

    expect(UNSAFE_getByType(ListEmptyComponent)).toBeTruthy();
  });

  test('should render ApolloProgress component if loadingStatus = true', () => {
    useSelector.mockImplementation((cb) =>
      cb({
        budgetPicker: {
          loadingStatus: LOADING_STATUS.BOOTSTRAPPING,
          budgets: MAPPED_BUDGETS_DATA,
          meeting: MAPPED_MEETING_DATA,
          params: {
            searchQuery: '',
          },
        },
      })
    );
    const { getByTestId } = render(
      <ApolloProvider>
        <BudgetPickerScreen />
      </ApolloProvider>
    );

    expect(getByTestId('apolloProgress')).toBeTruthy();
  });

  test('should call onSelectRow if user pressed on table row', () => {
    useSelector.mockImplementation((cb) =>
      cb({
        budgetPicker: {
          budgets: MAPPED_BUDGETS_DATA,
          meeting: MAPPED_MEETING_DATA,
          params: {
            searchQuery: '',
          },
        },
      })
    );
    const { getByText } = render(
      <ApolloProvider>
        <BudgetPickerScreen />
      </ApolloProvider>
    );
    const row = getByText(/Akron Budget/i);

    fireEvent.press(row);

    expect(dispatch).toHaveBeenCalledTimes(3);
  });

  test('should call onSetFilter if user pressed on filter button', () => {
    useSelector.mockImplementation((cb) =>
      cb({
        budgetPicker: {
          budgets: MAPPED_BUDGETS_DATA,
          meeting: MAPPED_MEETING_DATA,
          params: {
            searchQuery: '',
          },
        },
      })
    );
    const { UNSAFE_getByType } = render(
      <ApolloProvider>
        <BudgetPickerScreen />
      </ApolloProvider>
    );

    fireEvent.press(UNSAFE_getByType(Button));

    expect(dispatch).toHaveBeenNthCalledWith(3, {
      payload: undefined,
      type: 'budgetPicker/toggleSystemGeneratedFilter',
    });
  });

  test('should call onSearch if user entered something in search input', () => {
    useSelector.mockImplementation((cb) =>
      cb({
        budgetPicker: {
          budgets: MAPPED_BUDGETS_DATA,
          meeting: MAPPED_MEETING_DATA,
          params: {
            searchQuery: '',
          },
        },
      })
    );
    const { UNSAFE_getByType } = render(
      <ApolloProvider>
        <BudgetPickerScreen />
      </ApolloProvider>
    );

    fireEvent.changeText(UNSAFE_getByType(Search), 'Test');

    act(() => {
      jest.runAllTimers();
    });

    expect(dispatch).toHaveBeenNthCalledWith(3, {
      payload: 'Test',
      type: 'budgetPicker/setBudgetSearchQuery',
    });
  });

  test('should place tooltip on right and set width auto if it is not iPhone', () => {
    commonUtils.isIphone = false;
    useSelector.mockImplementation((cb) =>
      cb({
        budgetPicker: {
          budgets: MAPPED_BUDGETS_DATA,
          meeting: MAPPED_MEETING_DATA,
          params: {
            searchQuery: '',
          },
        },
      })
    );
    const { UNSAFE_getByType } = render(
      <ApolloProvider>
        <BudgetPickerScreen />
      </ApolloProvider>
    );
    const tooltip = UNSAFE_getByType(Tooltip);

    expect(tooltip).toBeTruthy();
    expect(tooltip).toHaveProp('placement', 'right');
    expect(tooltip.props.children.props.style.width).toEqual('auto');
  });
});
