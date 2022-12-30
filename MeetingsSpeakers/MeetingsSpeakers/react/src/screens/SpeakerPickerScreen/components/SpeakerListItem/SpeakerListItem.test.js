import React from 'react';
import { View as MockView } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { SpeakerListItem } from './SpeakerListItem';
import * as commonUtils from '../../../../utils/common';
import { store } from '../../../../store/store';
import { Provider } from 'react-redux';

jest.mock('apollo-react-native/lib/module/components/TouchableRipple', () =>
  jest.fn(({ children, ...props }) => <MockView {...props}>{children}</MockView>)
);
const SPEAKER = {
  id: 'a4v040000000kUSAAY',
  name: 'Account Customer11',
  professionalDesignation: null,
  specialty: 'Adolescent medicine',
  status: null,
};

describe('SpeakerListItem', () => {
  it('should call onInvite prop after clicking on Invite button (iPad)', () => {
    commonUtils.isIphone = false;

    const onInvite = jest.fn();
    const { getByText } = render(
      <Provider store={store}>
        <SpeakerListItem speaker={SPEAKER} onInvite={onInvite} />
      </Provider>
    );

    const inviteButton = getByText(/invite/i);

    fireEvent.press(inviteButton);

    expect(onInvite).toHaveBeenCalledTimes(1);
    expect(onInvite).toHaveBeenCalledWith(SPEAKER);

    fireEvent.press(inviteButton);
    expect(onInvite).toHaveBeenCalledTimes(2);
    expect(onInvite).toHaveBeenLastCalledWith(SPEAKER);
  });

  it('should render separator between description items', () => {
    commonUtils.isIphone = false;

    const onInvite = jest.fn();
    const { queryByTestId, rerender } = render(
      <Provider store={store}>
        <SpeakerListItem speaker={SPEAKER} onInvite={onInvite} />
      </Provider>
    );

    expect(queryByTestId('description-separator')).toBeNull();

    rerender(
      <Provider store={store}>
        <SpeakerListItem speaker={{ ...SPEAKER, professionalDesignation: 'test' }} onInvite={onInvite} />
      </Provider>
    );

    expect(queryByTestId('description-separator')).toBeTruthy();
  });

  it('should call onInvite prop after clicking on Invite button (iPhone)', () => {
    commonUtils.isIphone = true;

    const onInvite = jest.fn();
    const { getByLabelText } = render(
      <Provider store={store}>
        <SpeakerListItem speaker={SPEAKER} onInvite={onInvite} />
      </Provider>
    );

    const inviteButton = getByLabelText(/select-icon-button/i);

    fireEvent.press(inviteButton);

    expect(onInvite).toHaveBeenCalledTimes(1);
    expect(onInvite).toHaveBeenCalledWith(SPEAKER);

    fireEvent.press(inviteButton);

    expect(onInvite).toHaveBeenCalledTimes(2);
    expect(onInvite).toHaveBeenLastCalledWith(SPEAKER);
  });
});
