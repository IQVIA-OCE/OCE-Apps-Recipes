import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fireEvent, render } from '@testing-library/react-native';
import { TopicsList } from './TopicsList';
import * as commonUtils from '../../../../utils/common';
import { View } from 'react-native';
import { FETCH_TOPICS_DATA, MOCK_MEETING } from '../../../../constants';

const MockView = View;
jest.mock('apollo-react-native/lib/module/components/TouchableRipple', () =>
  jest.fn(({ children, ...props }) => (
    <MockView {...props}>{children}</MockView>
  ))
);

jest.mock('../../../../api/topicsApi');

jest.mock('../../../../utils/dateTimeFormat', () => ({
  formatDate: (data) => data,
}));

const dispatch = jest.fn();

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock('../../../../store/topicPicker/topicPickerSlice', () => ({
  fetchTopics: jest.fn(),
  fetchMoreTopics: jest.fn(),
  toggleSelectTopic: jest.fn(),
}));

describe('TopicsList', () => {
  beforeEach(() => {
    useDispatch.mockImplementation(() => dispatch);
    useSelector.mockImplementation((cb) =>
      cb({
        topicPicker: {
          topics: FETCH_TOPICS_DATA,
          meeting: MOCK_MEETING,
          loadingStatus: 'idle',
          selectedTopicsMap: [],
          selectedTopicsIDsMap: [],
          params: {
            limit: 20,
            offset: 0,
            searchQuery: '',
          },
        },
      })
    );
  });

  it('should render correctly', () => {
    const { getByTestId } = render(<TopicsList />);
    expect(getByTestId(/topics-list/i)).toBeTruthy();
  });

  it('should call toggleSelectTopic by press Select Button', () => {
    commonUtils.isIphone = false;

    const { getAllByText } = render(<TopicsList />);

    const selectButtons = getAllByText(/Select/i);
    fireEvent.press(selectButtons[0]);
    expect(useDispatch).toHaveBeenCalled();
  });

  it('should call toggleSelectTopic by press Select Button', () => {
    useSelector.mockImplementation((cb) =>
      cb({
        topicPicker: {
          topics: [],
          meeting: MOCK_MEETING,
          loadingStatus: 'pending',
          selectedTopicsMap: [],
          selectedTopicsIDsMap: [],
          params: {
            limit: 20,
            offset: 0,
            searchQuery: '',
          },
        },
      })
    );

    const { getByTestId } = render(<TopicsList />);

    const topicsList = getByTestId('topics-list');
    expect(topicsList).toBeTruthy();
  });
});
