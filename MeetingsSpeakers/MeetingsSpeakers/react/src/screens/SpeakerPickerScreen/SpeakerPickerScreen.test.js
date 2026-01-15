import { SpeakerPickerScreen } from './SpeakerPickerScreen';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import * as selectors from '../../store/speakerPicker/speakerPickerSelectors';
import { LOADING_STATUS } from '../../constants';
import { isInvitedSelector, searchQuerySelector } from '../../store/speakerPicker/speakerPickerSelectors';
import {
  fetchMoreSpeakers,
  fetchSpeakers,
  saveInvitedSpeakers,
  setSearchQuery,
  toggleInviteSpeaker,
  toggleSystemGeneratedFilter,
} from '../../store/speakerPicker/speakerPickerSlice';
import * as commonUtils from '../../utils/common';
import React from 'react';
import { Provider } from '@oce-apps/apollo-react-native';
import { MAPPED_MORE_SPEAKERS, MAPPED_SEARCH_SPEAKERS, MAPPED_SPEAKERS } from '../../constants/speakersTestData';

jest.mock('../../store/speakerPicker/speakerPickerSlice');

jest.mock('react-redux', () => ({
  useSelector: jest.fn((selector) => selector()),
  useDispatch: jest.fn(() => () => {}),
}));

jest.mock('@oce-apps/oce-apps-bridges/lib/EnvironmentData/EnvironmentData.native', () => ({
  environment: {
    namespace: () => '',
    userID: () => '',
    profileId: () => '1',
  },
}));

jest.mock('@oce-apps/apollo-react-native/lib/module/components/PressableRipple', () =>
  jest.fn(({ children, ...props }) => <div {...props}>{children}</div>)
);

describe('SpeakerPickerScreen', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render loading state', () => {
    jest.spyOn(selectors, 'speakersSelector').mockReturnValue([]);
    jest.spyOn(selectors, 'loadingStatusSelector').mockReturnValue(LOADING_STATUS.BOOTSTRAPPING);
    jest.spyOn(selectors, 'isSystemGeneratedFilterEnabledSelector').mockReturnValue(false);
    jest.spyOn(selectors, 'userPreferredCountriesSelector').mockReturnValue(['AT']);
    jest.spyOn(selectors, 'searchQuerySelector').mockReturnValue('');
    render(<SpeakerPickerScreen />);

    expect(screen.getByTestId('loader-wrap')).toBeTruthy();
  });

  it('should display fetched data correctly (initial render, fetch more, filtering)', async () => {
    jest
      .spyOn(selectors, 'speakersSelector')
      .mockReturnValueOnce(MAPPED_SPEAKERS)
      .mockReturnValueOnce(MAPPED_MORE_SPEAKERS)
      .mockReturnValueOnce(MAPPED_SEARCH_SPEAKERS);
    jest.spyOn(selectors, 'loadingStatusSelector').mockReturnValue(LOADING_STATUS.SUCCESS);
    jest.spyOn(selectors, 'isSystemGeneratedFilterEnabledSelector').mockReturnValue(false);
    jest.spyOn(selectors, 'userPreferredCountriesSelector').mockReturnValue(['AT']);
    jest.spyOn(selectors, 'searchQuerySelector').mockReturnValue('');
    jest.spyOn(selectors, 'isInvitedSelector').mockImplementation(() => () => false);
    render(<SpeakerPickerScreen />);

    const list = screen.getByTestId('speakers-list');

    expect(fetchSpeakers).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/speaker 1/i)).toBeTruthy();
    expect(screen.getByText(/speaker 4/i)).toBeTruthy();

    act(() => {
      list.props.onScrollBeginDrag();
      list.props.onEndReached();
      jest.runAllTimers();
    });

    expect(fetchMoreSpeakers).toHaveBeenCalled();

    await act(async () => {
      await fireEvent.changeText(screen.getByPlaceholderText(/search speakers.../i), 'test');
      jest.runOnlyPendingTimers();
    });

    expect(setSearchQuery).toHaveBeenCalledTimes(1);
    expect(setSearchQuery).toHaveBeenCalledWith('test');
  });

  it('should call saveInvitedSpeakers action on save', async () => {
    commonUtils.isIphone = false;
    jest.spyOn(selectors, 'speakersSelector').mockReturnValue(MAPPED_SPEAKERS);
    jest.spyOn(selectors, 'loadingStatusSelector').mockReturnValue(LOADING_STATUS.SUCCESS);
    jest.spyOn(selectors, 'isSystemGeneratedFilterEnabledSelector').mockReturnValue(false);
    jest.spyOn(selectors, 'userPreferredCountriesSelector').mockReturnValue(['AT']);
    jest.spyOn(selectors, 'searchQuerySelector').mockReturnValue('');
    jest.spyOn(selectors, 'isInvitedSelector').mockImplementation(() => () => false);

    render(<SpeakerPickerScreen />);

    const saveButton = screen.getByText(/save/i);
    fireEvent.press(saveButton);

    expect(saveInvitedSpeakers).toHaveBeenCalled();
  });

  it('should call toggleSystemGeneratedFilter action on toggle system generated filter', () => {
    commonUtils.isIphone = false;
    jest.spyOn(selectors, 'speakersSelector').mockReturnValue(MAPPED_SPEAKERS);
    jest.spyOn(selectors, 'loadingStatusSelector').mockReturnValue(LOADING_STATUS.SUCCESS);
    jest.spyOn(selectors, 'isSystemGeneratedFilterEnabledSelector').mockReturnValue(false);
    jest.spyOn(selectors, 'userPreferredCountriesSelector').mockReturnValue(['AT']);
    jest.spyOn(selectors, 'searchQuerySelector').mockReturnValue('');
    jest.spyOn(selectors, 'isInvitedSelector').mockImplementation(() => () => false);

    render(<SpeakerPickerScreen />);

    const SGFButton = screen.getByText(/system generated filter/i);

    fireEvent.press(SGFButton);
    fireEvent.press(SGFButton);
    expect(toggleSystemGeneratedFilter).toHaveBeenCalledTimes(2);
  });

  it('should call toggleInviteSpeaker action on tapping on Invite button', () => {
    commonUtils.isIphone = false;
    jest.spyOn(selectors, 'speakersSelector').mockReturnValue(MAPPED_SPEAKERS);
    jest.spyOn(selectors, 'loadingStatusSelector').mockReturnValue(LOADING_STATUS.SUCCESS);
    jest.spyOn(selectors, 'isSystemGeneratedFilterEnabledSelector').mockReturnValue(false);
    jest.spyOn(selectors, 'userPreferredCountriesSelector').mockReturnValue(['AT']);
    jest.spyOn(selectors, 'searchQuerySelector').mockReturnValue('');
    jest.spyOn(selectors, 'isInvitedSelector').mockImplementation(() => () => false);

    render(<SpeakerPickerScreen />);

    const [inviteButton] = screen.getAllByText(/invite$/i);

    fireEvent.press(inviteButton);
    expect(toggleInviteSpeaker).toHaveBeenCalledTimes(1);
    expect(toggleInviteSpeaker).toHaveBeenCalledWith({
      speaker: MAPPED_SPEAKERS[0],
      speakerId: 'a4v040000000MakAAE',
    });
  });

  it('should display tooltip description', async () => {
    commonUtils.isIphone = false;
    jest.spyOn(selectors, 'speakersSelector').mockReturnValue(MAPPED_SPEAKERS);
    jest.spyOn(selectors, 'loadingStatusSelector').mockReturnValue(LOADING_STATUS.SUCCESS);
    jest.spyOn(selectors, 'isSystemGeneratedFilterEnabledSelector').mockReturnValue(false);
    jest.spyOn(selectors, 'userPreferredCountriesSelector').mockReturnValue(['AT']);
    jest.spyOn(selectors, 'searchQuerySelector').mockReturnValue('');
    jest.spyOn(selectors, 'isInvitedSelector').mockImplementation(() => () => false);

    render(
      <Provider>
        <SpeakerPickerScreen />
      </Provider>
    );

    const tooltipTrigger = screen.getByTestId('sgf-tooltip');

    fireEvent.press(tooltipTrigger);

    const tooltipText = await screen.findByText(/Speaker Country = "AT"/i);

    expect(tooltipText).toBeTruthy();
  });
});
