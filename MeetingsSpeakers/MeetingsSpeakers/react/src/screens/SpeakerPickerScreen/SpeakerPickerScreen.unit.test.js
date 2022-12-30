import { fireEvent, render } from '@testing-library/react-native';
import * as commonUtils from '../../utils/common';
import React from 'react';
import { saveInvitedSpeakers, toggleSystemGeneratedFilter } from '../../store/speakerPicker/speakerPickerSlice';
import { useDispatch, useSelector } from 'react-redux';
import { LOADING_STATUS } from '../../constants';
import { SpeakerPickerScreen } from './SpeakerPickerScreen';
import * as speakersApi from '../../api/speakersApi';
import { FETCH_SPEAKERS_DATA } from './utils/testData';
import { Provider } from 'apollo-react-native';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock('apollo-react-native/lib/module/components/TouchableRipple', () =>
  jest.fn(({ children, ...props }) => <div {...props}>{children}</div>)
);

jest.mock('../../store/speakerPicker/speakerPickerSlice', () => ({
  saveInvitedSpeakers: jest.fn(),
  fetchSpeakers: jest.fn(),
  bootstrap: jest.fn(),
  toggleSystemGeneratedFilter: jest.fn(),
}));

describe('SpeakerPickerScreen unit tests', () => {
  beforeEach(() => {
    useDispatch.mockImplementation(() => () => {});

    useSelector
      .mockImplementationOnce(cb =>
        cb({
          speakerPicker: {
            speakers: [],
          },
        })
      )
      .mockImplementationOnce(cb =>
        cb({
          speakerPicker: {
            loadingStatus: LOADING_STATUS.SUCCESS,
          },
        })
      )
      .mockImplementationOnce(cb =>
        cb({
          speakerPicker: {
            isSystemGeneratedFilterEnabled: false,
          },
        })
      )
      .mockImplementationOnce(cb =>
        cb({
          speakerPicker: {
            params: {
              userPreferredCountries: ['AT'],
            },
          },
        })
      );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should call saveInvitedSpeakers action on save', async () => {
    commonUtils.isIphone = false;

    const { getByText } = render(<SpeakerPickerScreen />);

    const saveButton = getByText(/save/i);
    fireEvent.press(saveButton);

    expect(saveInvitedSpeakers).toHaveBeenCalled();
  });

  it('should call toggleSystemGeneratedFilter action on toggle system generated filter', () => {
    commonUtils.isIphone = false;

    const { getByText } = render(<SpeakerPickerScreen />);

    const SGFButton = getByText(/system generated filter/i);

    fireEvent.press(SGFButton);
    fireEvent.press(SGFButton);
    expect(toggleSystemGeneratedFilter).toHaveBeenCalledTimes(2);
  });

  it('should display not found text', async () => {
    commonUtils.isIphone = false;

    const { findByText } = render(<SpeakerPickerScreen />);

    const notFoundText = await findByText(/no active speakers found/i);

    expect(notFoundText).toBeTruthy();
  });

  it('should display tooltip description', async () => {
    commonUtils.isIphone = false;

    const { findByText, getByTestId } = render(
      <Provider>
        <SpeakerPickerScreen />
      </Provider>
    );

    const tooltipTrigger = getByTestId('sgf-tooltip');

    fireEvent.press(tooltipTrigger);

    const tooltipText = await findByText(/Speaker Country = "AT"/i);

    expect(tooltipText).toBeTruthy();
  });
});
