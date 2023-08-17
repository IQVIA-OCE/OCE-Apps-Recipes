import { act, render, waitFor } from '@testing-library/react-native';
import { Provider as ApolloProvider } from 'apollo-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { CustomProgress } from '../components/CustomProgress';
import { CustomTable } from '../components/CustomTable';
import { ModalSelector } from '../components/ModalSelector';
import { LOADING_STATUS } from '../constants';
import { CALL_ATTENDEES_MAPPED_DATA } from '../mocks/callTestData';
import {
  CALLS_MAPPED_DATA,
  MEETING_ATTENDEES_MAPPED_DATA,
  MEETING_MAPPED_DATA,
} from '../mocks/meetingTestData';
import * as utilsCommon from '../utils/common';
import * as utilsNavigator from '../utils/navigator';
import { MeetingScreen } from './MeetingScreen';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

const STATE_MOCK = {
  loadingStatus: LOADING_STATUS.SUCCESS,
  meetingObj: MEETING_MAPPED_DATA,
  calls: {
    data: CALLS_MAPPED_DATA,
    totalSize: CALLS_MAPPED_DATA.length,
  },
  meetingAttendees: MEETING_ATTENDEES_MAPPED_DATA,
};

describe('MeetingScreen', () => {
  beforeEach(() => {
    useDispatch.mockReturnValue(() => jest.fn());
    useSelector.mockImplementation((cb) => cb({ meetingStore: STATE_MOCK }));
  });

  test('should render properly', () => {
    utilsCommon.isIphone = false;
    utilsCommon.isWeb = false;
    const { queryByText } = render(
      <ApolloProvider>
        <MeetingScreen recordId={'111'} />
      </ApolloProvider>
    );

    expect(queryByText('Call 2.0 calls', { exact: true })).toBeTruthy();
  });

  test('should render properly for WEB', () => {
    utilsCommon.isIphone = false;
    utilsCommon.isWeb = true;
    const { queryByText } = render(
      <ApolloProvider>
        <MeetingScreen recordId={'111'} />
      </ApolloProvider>
    );

    expect(queryByText('Call 2.0 calls', { exact: true })).toBeTruthy();
  });

  test('should render properly for iPhone', () => {
    utilsCommon.isIphone = true;
    utilsCommon.isWeb = false;
    const { queryByText } = render(
      <ApolloProvider>
        <MeetingScreen recordId={'111'} />
      </ApolloProvider>
    );

    expect(queryByText('Call 2.0 calls', { exact: true })).toBeTruthy();
  });

  test('should render CustomProgress for loading status', async () => {
    useSelector.mockImplementation((cb) =>
      cb({
        meetingStore: { ...STATE_MOCK, loadingStatus: LOADING_STATUS.PENDING },
      })
    );
    const { UNSAFE_getByType } = render(
      <ApolloProvider>
        <MeetingScreen recordId={'111'} />
      </ApolloProvider>
    );

    await waitFor(() => {
      expect(UNSAFE_getByType(CustomProgress)).toBeTruthy();
    });
  });

  test('button on Call 2.0 calls table should open meeting attendees modal', async () => {
    const { queryByText, UNSAFE_getByType } = render(
      <ApolloProvider>
        <MeetingScreen recordId={'111'} />
      </ApolloProvider>
    );

    await waitFor(() => {
      expect(queryByText('Call 2.0 calls', { exact: true })).toBeTruthy();
    });

    act(() => {
      UNSAFE_getByType(CustomTable).props.onPressButton();
    });

    await waitFor(() => {
      expect(UNSAFE_getByType(ModalSelector)).toBeTruthy();
    });
  });

  test('should call openWEBCreateScreen() function on WEB after selecting meeting attendee on ModalSelector', async () => {
    utilsCommon.isWeb = true;
    window.open = jest.fn();

    const openWEBCreateScreenSpy = jest.spyOn(
      utilsNavigator,
      'openWEBCreateScreen'
    );
    const { queryByText, UNSAFE_getByType } = render(
      <ApolloProvider>
        <MeetingScreen recordId={'111'} />
      </ApolloProvider>
    );

    await waitFor(() => {
      expect(queryByText('Call 2.0 calls', { exact: true })).toBeTruthy();
    });

    act(() => {
      UNSAFE_getByType(CustomTable).props.onPressButton();
    });

    await waitFor(() => {
      expect(UNSAFE_getByType(ModalSelector)).toBeTruthy();
    });

    act(() => {
      UNSAFE_getByType(ModalSelector).props.handleNext({
        label: CALL_ATTENDEES_MAPPED_DATA[1].account,
        value: CALL_ATTENDEES_MAPPED_DATA[1].accountId,
      });
    });

    await waitFor(() => {
      expect(openWEBCreateScreenSpy).toHaveBeenCalled();
    });
  });

  test('should call openNativeCreateScreen() function on iOS platform after selecting meeting attendee on ModalSelector', async () => {
    utilsCommon.isWeb = false;

    const openNativeCreateScreenSpy = jest.spyOn(
      utilsNavigator,
      'openNativeCreateScreen'
    );
    const { queryByText, UNSAFE_getByType } = render(
      <ApolloProvider>
        <MeetingScreen recordId={'111'} />
      </ApolloProvider>
    );

    await waitFor(() => {
      expect(queryByText('Call 2.0 calls', { exact: true })).toBeTruthy();
    });

    act(() => {
      UNSAFE_getByType(CustomTable).props.onPressButton();
    });

    await waitFor(() => {
      expect(UNSAFE_getByType(ModalSelector)).toBeTruthy();
    });

    act(() => {
      UNSAFE_getByType(ModalSelector).props.handleNext({
        label: CALL_ATTENDEES_MAPPED_DATA[1].account,
        value: CALL_ATTENDEES_MAPPED_DATA[1].accountId,
      });
    });

    await waitFor(() => {
      expect(openNativeCreateScreenSpy).toHaveBeenCalled();
    });
  });

  test('should close ModalSelector if user press Close button', async () => {
    const { queryByText, UNSAFE_getByType, UNSAFE_queryByType } = render(
      <ApolloProvider>
        <MeetingScreen recordId={'111'} />
      </ApolloProvider>
    );

    await waitFor(() => {
      expect(queryByText('Call 2.0 calls', { exact: true })).toBeTruthy();
    });

    act(() => {
      UNSAFE_getByType(CustomTable).props.onPressButton();
    });

    await waitFor(() => {
      expect(UNSAFE_getByType(ModalSelector)).toBeTruthy();
    });

    act(() => {
      UNSAFE_getByType(ModalSelector).props.handleCancel({
        label: CALL_ATTENDEES_MAPPED_DATA[1].account,
        value: CALL_ATTENDEES_MAPPED_DATA[1].accountId,
      });
    });

    await waitFor(() => {
      expect(UNSAFE_getByType(ModalSelector).props.visible).toBeFalsy();
    });
  });
});
