import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import NewActivityPlanChangeRequest from './NewActivityPlanChangeRequest';
import { ADD_ACTIVITY } from '../../constants/routes';

jest.mock('react-navigation', () => ({
  withNavigation: (Component) => (props) =>
    <Component navigation={{ navigate: jest.fn() }} {...props} />,
  SafeAreaView: ({ children }) => <>{children}</>,
}));

describe('NewActivityPlanChangeRequest', () => {
  it('should render correctly', () => {
    const { getByTestId } = render(<NewActivityPlanChangeRequest />);

    expect(getByTestId('NewActivityPlanChangeRequest')).toBeTruthy();
  });

  it('should proceed to next screen', async () => {
    const { getByTestId, container } = render(<NewActivityPlanChangeRequest />);

    const activityTypeRadioButton = getByTestId('ActivityTypeRadioButton')
      .children[0];
    const nextButton = getByTestId('HeaderSaveButton');

    await waitFor(() => {
      activityTypeRadioButton.props.onValueChange(ADD_ACTIVITY);
      fireEvent.press(nextButton);
    });

    expect(container.children[0].props.navigation.navigate).toHaveBeenCalled();
  });
});
