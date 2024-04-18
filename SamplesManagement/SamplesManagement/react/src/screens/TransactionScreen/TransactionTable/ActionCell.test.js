import React from 'react';
import ActionCell from './ActionCell';
import { IconButton } from '@oce-apps/apollo-react-native';
import { render, act } from '@testing-library/react-native';

describe('ActionCell', () => {
  it('should render properly', () => {
    const onPress = jest.fn();
    const Component = props => <ActionCell {...props} />;

    const { rerender, UNSAFE_root } = render(
      <Component onPress={onPress} row={{ Id: '1', locked: false }} />
    )

    act(() => UNSAFE_root.findByType(IconButton).props.onPress());

    expect(onPress).toHaveBeenCalledTimes(1);

    expect(UNSAFE_root.findByType(IconButton).props.icon).toBe('delete');

    rerender(
      <Component onPress={onPress} row={{ Id: '1', locked: true }} />
    );

    expect(UNSAFE_root.findByType(IconButton).props.icon).toBe('lock');

  });
});
