import React from 'react';
import { render, fireEvent, waitFor} from '@testing-library/react-native';
import RemoveActivityPlan from './RemoveActivityPlan';
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

describe('RemoveActivityPlan', () => {
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
      <RemoveActivityPlan />
    );

    expect(getByTestId('RemoveActivityPlan')).toBeTruthy();
  });

  it('should submit form', async () => {
    let { getByTestId } = render(
      <RemoveActivityPlan />
    );

    const confirmChekcbox = getByTestId('ConfirmCheckbox').children[0];
    const reasonSelect = getByTestId('ReasonSelect').children[0];

    const saveButton = getByTestId('HeaderSaveButton');
    const formikElement = getByTestId('Container').children[1];

    await waitFor(() => {
      confirmChekcbox.props.onChange(true)
      reasonSelect.props.onChange([{ label: 'other', value: 'other' }]);
      fireEvent.press(saveButton);
      formikElement.props.onSubmit();
    });

    expect(useDispatch).toHaveBeenCalled();
  });

})
