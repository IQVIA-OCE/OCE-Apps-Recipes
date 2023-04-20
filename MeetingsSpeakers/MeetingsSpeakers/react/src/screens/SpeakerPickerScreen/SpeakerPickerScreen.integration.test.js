import React from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import { fireEvent, render, act } from '@testing-library/react-native';
import { configureStore } from '@reduxjs/toolkit';
import * as speakersApi from '../../api/speakersApi';
import * as commonApi from '../../api/commonApi';
import { FETCH_MORE_SPEAKERS_DATA, FETCH_SPEAKERS_DATA, SEARCH_SPEAKERS_DATA } from './utils/testData';
import * as commonUtils from '../../utils/common';
import {
  FETCH_MEETING_MEMBERS_RESPONSE,
  FETCH_MEETING_RESPONSE,
  FETCH_RECORD_TYPE_RESPONSE,
  NAMESPACE,
} from '../../constants';
import { SpeakerPickerScreen } from './SpeakerPickerScreen';
import { NotificationContainer } from '../../components/NotificationContainer/NotificationContainer';
import { FETCH_USER_PREFERRED_COUNTRIES_RESPONSE } from '../../constants/speakersTestData';
import { speakerPickerReducer } from '../../store/speakerPicker/speakerPickerSlice';
import { notificationSliceReducer } from '../../store/notification/notificationSlice';

const MockView = View;
jest.mock('apollo-react-native/lib/module/components/TouchableRipple', () =>
  jest.fn(({ children, ...props }) => <MockView {...props}>{children}</MockView>)
);
jest.mock('apollo-react-native/lib/module/components/ApolloProgress', () =>
  jest.fn(({ children, ...props }) => <MockView {...props}>{children}</MockView>)
);
//ToDo: with namespace does not work
jest.mock('oce-apps-bridges/lib/EnvironmentData/EnvironmentData.native', () => ({
  environment: {
    namespace: () => '',
    userID: () => ''
  },
}));
jest.mock('../../api/speakersApi');
jest.mock('../../api/commonApi');
jest.mock('../../api/meetingApi');

const makeStore = () => {
  return configureStore({
    reducer: {
      speakerPicker: speakerPickerReducer,
      notification: notificationSliceReducer,
    },
  });
};

describe('SpeakerPickerScreen integration tests', () => {
  beforeAll(() => {
    jest.useFakeTimers();

    speakersApi.fetchMeeting.mockResolvedValue(FETCH_MEETING_RESPONSE);
    speakersApi.fetchRecordType.mockResolvedValue(FETCH_RECORD_TYPE_RESPONSE);
    speakersApi.fetchMeetingMembers.mockResolvedValue(FETCH_MEETING_MEMBERS_RESPONSE);
    speakersApi.fetchUserPreferredCountries.mockResolvedValue(FETCH_USER_PREFERRED_COUNTRIES_RESPONSE);
  });

  let store;

  beforeEach(() => {
    store = makeStore();
  })

  afterAll(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('should display fetched data correctly (initial render, fetch more, filtering)', async () => {
    speakersApi.fetchSpeakers
      .mockResolvedValueOnce([FETCH_SPEAKERS_DATA])
      .mockResolvedValueOnce([FETCH_MORE_SPEAKERS_DATA])
      .mockResolvedValueOnce([SEARCH_SPEAKERS_DATA]);

    const promise = Promise.resolve();

    const { getByText, getByTestId, getByPlaceholderText } = render(
      <Provider store={store}>
        <SpeakerPickerScreen />
      </Provider>
    );

    expect(getByTestId('loader-wrap')).toBeTruthy();

    await act(() => promise);

    const list = getByTestId('speakers-list');

    expect(getByText(/speaker 1/i)).toBeTruthy();
    expect(getByText(/speaker 4/i)).toBeTruthy();

    await act(async () => {
      list.props.onScrollBeginDrag();
      list.props.onEndReached();
    });

    expect(getByText(/account customer12/i)).toBeTruthy();

    fireEvent.changeText(getByPlaceholderText(/search speakers.../i), 'test');
    act(() => {
      jest.runAllTimers();
    });
    await act(() => promise);

    expect(getByText(/ziad attar/i)).toBeTruthy();
  });

  it('should correctly add speaker to invited', async () => {
    commonUtils.isIphone = false;
    const promise = Promise.resolve();

    speakersApi.fetchSpeakers.mockResolvedValueOnce([FETCH_SPEAKERS_DATA]);

    const { getAllByText } = render(
      <Provider store={store}>
        <SpeakerPickerScreen />
      </Provider>
    );

    await act(() => promise);

    const [inviteButton] = getAllByText(/invite$/i);

    fireEvent.press(inviteButton);

    expect(inviteButton).toHaveTextContent('Invited');
  });

  it('should display success notification after clicking on Save button', async () => {
    commonUtils.isIphone = false;
    const promise = Promise.resolve();

    speakersApi.fetchSpeakers.mockResolvedValueOnce([FETCH_SPEAKERS_DATA]);
    commonApi.checkIfTriggerIsEnabled.mockResolvedValueOnce(false);
    commonApi.checkCanDeleteMeetingMember.mockResolvedValueOnce([true, []]);
    commonApi.checkAccountUtilizationEnabled.mockResolvedValueOnce(false);

    const { getByText, getAllByText } = render(
      <Provider store={store}>
        <NotificationContainer />
        <SpeakerPickerScreen />
      </Provider>
    );

    await act(() => promise);

    const [inviteButton] = getAllByText(/invited/i);

    fireEvent.press(inviteButton);

    const saveButton = getByText(/save$/i);
    fireEvent.press(saveButton);

    await act(() => promise);

    const successNotification = getByText(/All changes have been saved/i);
    expect(successNotification).toBeTruthy();
  });

  it('should display a warning during saving if workflow context conditions were ignored', async () => {
    commonUtils.isIphone = false;
    const promise = Promise.resolve();

    speakersApi.fetchMeetingMembers
      .mockReset()
      .mockResolvedValueOnce([
        [
          {
            CreatedDate: '2021-07-21T15:06:28.000+0000',
            Id: 'a3Y04000000Gq2oEAC',
            Name: 'test',
            [`${NAMESPACE}Speaker__c`]: 'a4v040000000MakAAE',
            uid: 'a3Y04000000Gq2oEAC',
          },
        ],
      ])
      .mockResolvedValueOnce([[]]);

    speakersApi.fetchSpeakers.mockResolvedValueOnce([FETCH_SPEAKERS_DATA]);
    commonApi.checkIfTriggerIsEnabled.mockResolvedValueOnce(false);
    commonApi.checkCanDeleteMeetingMember.mockResolvedValueOnce([true, [{ id: '1' }]]);
    commonApi.checkAccountUtilizationEnabled.mockResolvedValueOnce(false);

    const { getByText } = render(
      <Provider store={store}>
        <NotificationContainer />
        <SpeakerPickerScreen />
      </Provider>
    );

    await act(() => promise);

    const invitedButton = getByText(/invited$/i);
    fireEvent.press(invitedButton);

    const saveButton = getByText(/save$/i);
    fireEvent.press(saveButton);

    await act(() => promise);

    const warningNotification = getByText(
      /All changes have been saved, but 1 workflow context conditions were ignored/i
    );
    expect(warningNotification).toBeTruthy();
  });
});
