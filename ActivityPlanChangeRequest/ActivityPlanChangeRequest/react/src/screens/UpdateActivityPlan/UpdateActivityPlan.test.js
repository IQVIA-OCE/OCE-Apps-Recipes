import React from 'react';
import { render, fireEvent, waitFor} from '@testing-library/react-native';
import UpdateActivityPlan from './UpdateActivityPlan';
import { useDispatch, useSelector } from 'react-redux';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => jest.fn(),
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

jest.mock('oce-apps-bridges', () => ({
  sfNetAPI: {
    describe: jest.fn()
  },
  environment: {
    namespace: jest.fn()
  }
}));

describe('UpdateActivityPlan', () => {
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
      <UpdateActivityPlan />
    );

    expect(getByTestId('Container')).toBeTruthy();
  });

  it('should submit form', async () => {
    let { getByTestId } = render(
      <UpdateActivityPlan />
    );

    const activityTypeSelect = getByTestId('ActivityTypeSelect').children[0];
    const valueInput = getByTestId('ValueInput').children[0];
    const reasonSelect = getByTestId('ReasonSelect').children[0];

    const saveButton = getByTestId('HeaderSaveButton');
    const formikElement = getByTestId('Container').children[1];

    await waitFor(() => {
      activityTypeSelect.props.onChange([{ label: 'test', value: 'test' }]);
      fireEvent.changeText(valueInput, '5');
      reasonSelect.props.onChange([{ label: 'other', value: 'other' }]);
      fireEvent.press(saveButton);
      formikElement.props.onSubmit();
    });

    expect(useDispatch).toHaveBeenCalled();
  });

})
