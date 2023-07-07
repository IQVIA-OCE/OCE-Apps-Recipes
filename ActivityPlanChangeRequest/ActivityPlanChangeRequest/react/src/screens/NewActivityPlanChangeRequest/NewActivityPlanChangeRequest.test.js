import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import NewActivityPlanChangeRequest from './NewActivityPlanChangeRequest';
import { ADD_ACTIVITY } from '../../constants/routes';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('NewActivityPlanChangeRequest', () => {
  it('should render correctly', () => {
    const { getByTestId } = render(<NewActivityPlanChangeRequest />);

    expect(getByTestId('NewActivityPlanChangeRequest')).toBeTruthy();
  });

  it('should proceed to next screen', async () => {
    const { getByTestId } = render(<NewActivityPlanChangeRequest />);

    const activityTypeRadioButton = getByTestId('ActivityTypeRadioButton')
      .children[0];
    const nextButton = getByTestId('HeaderSaveButton');

    await waitFor(() => {
      activityTypeRadioButton.props.onValueChange(ADD_ACTIVITY);
      fireEvent.press(nextButton);
    });

    expect(mockNavigate).toHaveBeenCalled();
  });
});
