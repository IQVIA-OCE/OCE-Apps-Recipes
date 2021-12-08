import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { IconButton, Provider } from 'apollo-react-native';
import TooltipContent from 'apollo-react-native/lib/module/components/Tooltip/TooltipContent';
import React from 'react';
import CustomTooltip from './CustomTooltip';

describe('CustomTooltip', () => {
  test('should render correctly', () => {
    const { getByTestId } = render(
      <Provider>
        <CustomTooltip title={'Test tooltip text'} open={true} />
      </Provider>
    );

    expect(getByTestId('customTooltip')).toBeTruthy();
  });

  test('should display button', async () => {
    const { UNSAFE_getByType } = render(
      <Provider>
        <CustomTooltip title={'Test tooltip text'} open={true} />
      </Provider>
    );
    const iconButton = UNSAFE_getByType(IconButton);

    fireEvent.press(iconButton);

    await waitFor(() => expect(UNSAFE_getByType(TooltipContent)).toBeDefined());
  });
});
