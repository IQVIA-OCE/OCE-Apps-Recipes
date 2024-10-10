import React from 'react';
import { deleteToDo, fetchCallToDos } from '../../store/callToDos/callToDosSlice';
import { CallToDosTable } from './CallToDosTable';
import { fireEvent, render, act, waitFor } from '@testing-library/react-native';
import { TouchableWithoutFeedback as MockTouchableWithoutFeedback } from 'react-native';
import {
  callSelector,
  complianceTypesSelector,
  formLoadingStatusSelector,
  todosListItemsSelector,
  todosListLoadingStatusSelector,
  todosListParamsSelector,
  todosListTotalCountSelector,
} from '../../store/callToDos/callToDosSelectors';
import { LOADING_STATUS } from '../../constants';
import { Button, Menu, Provider } from '@oce-apps/apollo-react-native';
import { CALL_MAPPED } from '../../__mocks__/callMocks';
import { CALL_TODOS_MAPPED } from '../../__mocks__/callToDosMocks';
import { fetchAllComplianceRecords, fetchSurveyTypes } from '../../api/callToDoApi';
import { COMPLIANCE_RECORDS_RAW_EPPV, SURVEY_TYPES } from '../../__mocks__/complianceMocks';
import * as Alert from '../../utils/alert';
import { useDispatch } from 'react-redux';

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

jest.mock('@oce-apps/apollo-react-native/lib/module/components/PressableRipple', () =>
  jest.fn(({ children, ...props }) => (
    <MockTouchableWithoutFeedback {...props}>{children}</MockTouchableWithoutFeedback>
  ))
);

jest.mock('react-redux', () => ({
  useSelector: jest.fn((selector) => selector()),
  useDispatch: jest.fn(),
}));

jest.mock('../../store/callToDos/callToDosSlice', () => ({
  bootstrap: jest.fn(),
  fetchCallToDos: jest.fn(),
  deleteToDo: jest.fn(),
}));

jest.mock('../../store/callToDos/callToDosSelectors', () => ({
  todosListParamsSelector: jest.fn(),
  todosListItemsSelector: jest.fn(),
  todosListTotalCountSelector: jest.fn(),
  todosListLoadingStatusSelector: jest.fn(),
  callSelector: jest.fn(),
  formLoadingStatusSelector: jest.fn(),
  complianceTypesSelector: jest.fn(),
}));

jest.mock('../../api/callToDoApi', () => ({
  fetchSurveyTypes: jest.fn(),
  fetchAllComplianceRecords: jest.fn(),
}));

describe('CallToDosTable', () => {
  beforeEach(() => {
    useDispatch.mockImplementation(() => () => {});
    todosListParamsSelector.mockReturnValue({
      callId: 'a2W0k000002LNqnEAG',
      page: 1,
      rowsPerPage: 5,
      sortColumn: 'complianceName',
      sortOrder: 'ascending',
    });
    todosListItemsSelector.mockReturnValue(CALL_TODOS_MAPPED);
    todosListTotalCountSelector.mockReturnValue(17);
    todosListLoadingStatusSelector.mockReturnValue(LOADING_STATUS.SUCCESS);
    callSelector.mockReturnValue(CALL_MAPPED);
    formLoadingStatusSelector.mockReturnValue(LOADING_STATUS.IDLE);
    complianceTypesSelector.mockReturnValue([]);

    fetchSurveyTypes.mockResolvedValue(SURVEY_TYPES);
    fetchAllComplianceRecords.mockResolvedValue(COMPLIANCE_RECORDS_RAW_EPPV);

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('should render properly in a draft call', () => {
    const { getByText, getAllByText, getByTestId } = render(
      <Provider>
        <CallToDosTable callId={'1'} />
      </Provider>
    );

    const newButton = getByTestId('table-custom-header').findByType(Button);

    expect(getByText(/^EPPV$/)).toBeTruthy();
    expect(getAllByText('Compliance EPPV 1')[0]).toBeTruthy();
    expect(getAllByText('Face To Face')[0]).toBeTruthy();
    expect(getAllByText('IS BC Contact #1')[0]).toBeTruthy();
    expect(getAllByText('Other interviewee')[0]).toBeTruthy();
    expect(newButton.props.disabled).toBe(false);
  });

  it('"New" button should be disabled in a submitted call', () => {
    callSelector.mockReset().mockReturnValue({
      ...CALL_MAPPED,
      status: 'Completed',
    });
    const { getByTestId } = render(
      <Provider>
        <CallToDosTable callId={'1'} />
      </Provider>
    );

    const newButton = getByTestId('table-custom-header').findByType(Button);

    expect(newButton.props.disabled).toBe(true);
  });

  it('should call onChange', async () => {
    const { getByTestId } = render(
      <Provider>
        <CallToDosTable callId={'1'} />
      </Provider>
    );

    const nextPageIcon = getByTestId('next-button');
    fireEvent.press(nextPageIcon, {
      nativeEvent: {},
      bubbles: true,
    });

    const promise = Promise.resolve();
    await act(() => promise);

    expect(fetchCallToDos).toHaveBeenLastCalledWith({
      callId: 'a2W0k000002LNqnEAG',
      page: 2,
      rowsPerPage: 5,
      sortColumn: 'complianceName',
      sortOrder: 'ascending',
    });
  });

  describe('actions', () => {
    it('create', async () => {
      const { getByTestId } = render(
        <Provider>
          <CallToDosTable callId={'1'} />
        </Provider>
      );

      const newButton = getByTestId('new-button');

      await act(async () => {
        fireEvent.press(newButton, {
          nativeEvent: {},
          bubbles: true,
        });
      });

      const formWrapper = await waitFor(() => getByTestId('callToDoFormWrapper'));
      expect(formWrapper).toBeTruthy();
    });

    it('edit', async () => {
      const { UNSAFE_getAllByProps, getByTestId, UNSAFE_getAllByType } = render(
        <Provider>
          <CallToDosTable callId={'1'} />
        </Provider>
      );

      const firstActionsIcon = UNSAFE_getAllByProps({ icon: 'dots-vertical' })[0];
      act(() => {
        firstActionsIcon.props.onPress();
      });

      // wait for actions menu
      const editOption = await waitFor(() => UNSAFE_getAllByType(Menu.Item)[0]);
      fireEvent.press(editOption);

      const formWrapper = await waitFor(() => getByTestId('callToDoFormWrapper'));
      expect(formWrapper).toBeTruthy();
    });

    it('delete', async () => {
      const { UNSAFE_getAllByProps, UNSAFE_getAllByType } = render(
        <Provider>
          <CallToDosTable callId={'1'} />
        </Provider>
      );

      const firstActionsIcon = UNSAFE_getAllByProps({ icon: 'dots-vertical' })[0];
      act(() => {
        firstActionsIcon.props.onPress();
      });

      jest.spyOn(Alert, 'alert');

      // wait for actions menu
      const deleteOption = await waitFor(() => UNSAFE_getAllByType(Menu.Item)[1]);
      fireEvent.press(deleteOption);

      expect(Alert.alert).toHaveBeenCalledTimes(1);
      act(() => {
        Alert.alert.mock.calls[0][2][1].onPress();
      });
      expect(deleteToDo).toHaveBeenCalledTimes(1);
      expect(deleteToDo).toHaveBeenCalledWith('a2V0k000000lWv3EAE');
    });
  });
});
