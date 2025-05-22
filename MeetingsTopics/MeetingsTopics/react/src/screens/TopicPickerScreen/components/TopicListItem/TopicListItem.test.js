import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TopicListItem } from './TopicListItem';
import * as commonUtils from '../../../../utils/common';
import { Provider } from 'react-redux';
import { store } from '../../../../store/store';
import { View as MockView } from 'react-native';

jest.mock('@oce-apps/apollo-react-native/lib/module/components/PressableRipple', () =>
  jest.fn(({ children, ...props }) => <MockView {...props}>{children}</MockView>)
);

const TOPIC = {
  id: 'a4v040000000kUSAAY',
  name: 'Meeting Topic 1',
  meetingRecordTypes: 'Speaker_meeting',
  meetingType: 'Speaker meeting',
  status: 'Draft',
  startDate: '17 May, 2021',
  endDate: '20 May, 2021',
};

const TOPIC_NULL = {
  id: 'a4v040000000kUSAAY',
  name: 'Meeting Topic 1',
  meetingType: null,
  status: null,
  startDate: null,
  endDate: null,
};

describe('TopicListItem', () => {
  it('should call onSelect prop after clicking on Select button (iPad)', () => {
    commonUtils.isIphone = false;

    const onSelect = jest.fn();
    const { getByText } = render(
      <Provider store={store}>
        <TopicListItem topic={TOPIC} onSelect={onSelect} />
      </Provider>
    );

    const selectButton = getByText(/select/i);

    fireEvent.press(selectButton);
    fireEvent.press(selectButton);

    expect(onSelect).toHaveBeenCalledTimes(2);
    expect(onSelect).toHaveBeenCalledWith(TOPIC);
  });

  it('should call onSelect prop after clicking on Select button (iPhone)', () => {
    commonUtils.isIphone = true;

    const onSelect = jest.fn();
    const { getByLabelText } = render(
      <Provider store={store}>
        <TopicListItem topic={TOPIC} onSelect={onSelect} />
      </Provider>
    );

    const selectButton = getByLabelText(/select-icon-button/i);

    fireEvent.press(selectButton);
    fireEvent.press(selectButton);

    expect(onSelect).toHaveBeenCalledTimes(2);
    expect(onSelect).toHaveBeenCalledWith(TOPIC);
  });

  it('should render separator between description items', () => {
    commonUtils.isIphone = false;

    const onSelect = jest.fn();
    const { queryByTestId, rerender } = render(
      <Provider store={store}>
        <TopicListItem topic={TOPIC_NULL} onSelect={onSelect} />
      </Provider>
    );

    expect(queryByTestId('description-separator')).toBeNull();

    rerender(
      <Provider store={store}>
        <TopicListItem
          topic={{ ...TOPIC_NULL, status: 'test' }}
          onSelect={onSelect}
        />
      </Provider>
    );

    expect(queryByTestId('description-separator')).toBeTruthy();
  });
});
