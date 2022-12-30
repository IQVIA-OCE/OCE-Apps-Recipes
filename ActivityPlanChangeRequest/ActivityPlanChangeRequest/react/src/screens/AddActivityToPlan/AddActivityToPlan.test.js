import React from 'react';
import { render, fireEvent, waitFor} from '@testing-library/react-native';
import AddActivityToPlan from './AddActivityToPlan';
import { useDispatch, useSelector } from 'react-redux';

jest.mock('react-navigation', () => ({
  withNavigation: Component => props => (
    <Component navigation={{ navigate: jest.fn() }} {...props} />
  ),
  SafeAreaView: ({ children }) => <>{children}</>,
}));

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn()
}));

jest.mock('react-native-keyboard-aware-scroll-view', () => {
  return {
    KeyboardAwareScrollView: jest.fn().mockImplementation(({ children }) => children)
  }
})

describe('AddActivityToPlan', () => {
  beforeEach(() => {
    useSelector
      .mockImplementationOnce(() => [{ label: 'test', value: 'test' }])
      .mockImplementationOnce(() => ({
        firstName: 'FirstName',
        fullName: 'FullName',
        address: 'Address',
        activityPlan: {
          HQGoal: 30,
          allowedThreshold: 4
        }
      }));

    useDispatch
      .mockImplementation(() => jest.fn())
  });

  it('should render correctly', () => {
    const { getByTestId } = render(
      <AddActivityToPlan />
    );

    expect(getByTestId('Container')).toBeTruthy();
  });

  it('should submit form', async () => {
    let { getByTestId } = render(
      <AddActivityToPlan />
    );

    const activityTypeSelect = getByTestId('ActivityTypeSelect').children[0];
    const accountNameSelect = getByTestId('AccountNameSelect').children[0];
    const reasonSelect = getByTestId('ReasonSelect').children[0];

    const saveButton = getByTestId('HeaderSaveButton');
    const formikElement = getByTestId('Container').children[1];

    await waitFor(() => {
      activityTypeSelect.props.onChange([{ label: 'test', value: 'test' }]);
      accountNameSelect.props.onChange([{ label: 'test', value: 'test' }]);
      reasonSelect.props.onChange([{ label: 'other', value: 'other' }]);
      fireEvent.press(saveButton);
      formikElement.props.onSubmit();
    });

    expect(useDispatch).toHaveBeenCalled();
  });

})
