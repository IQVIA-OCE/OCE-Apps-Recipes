import React from 'react';
import { render, waitFor, act, fireEvent } from '@testing-library/react-native';
import { Autocomplete, DarkTheme, Provider, Select } from '@oce-apps/apollo-react-native';
import { Appearance } from 'react-native';
import { layoutBridge } from '@oce-apps/oce-apps-bridges';
import { CompleteToDo } from './CompleteToDo';
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
import {
  fetchAccountComplianceCycleMetadata,
  fetchAllAccounts,
  fetchInProgressACCNumber,
  saveToDo,
} from '../../api';
import { Formik } from 'formik';

jest.mock('react-native-keyboard-aware-scroll-view', () => {
  const KeyboardAwareScrollView = ({ children }) => children;
  return { KeyboardAwareScrollView };
});

jest.mock('../../api', () => ({
  fetchAccountComplianceCycleMetadata: jest.fn(),
  fetchAllAccounts: jest.fn(),
  fetchInProgressACCNumber: jest.fn(),
  saveToDo: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: jest.fn(),
    navigate: jest.fn(),
  }),
  useRoute: jest.fn().mockReturnValue({ refreshToDoList: true }),
  useFocusEffect: jest.fn(),
}));

jest.mock('@oce-apps/oce-apps-bridges', () => ({
  environment: {
    namespace: () => 'OCE__',
    locale: () => 'test',
  },
}));

const params = {
  accountComplianceId: 'accountComplianceId',
  accountName: 'accountName',
  accountId: 'accountId',
  compliance: 'compliance',
  cycle: 'cycle',
};
describe('CompleteToDo screen', () => {
  beforeEach(() => {
    fetchAccountComplianceCycleMetadata.mockReturnValue({
      fields: [
        {
          name: 'OCE__SurveyType__c',
          picklistValues: [{ active: true, value: 'EPPV', label: 'EPPV' }],
        },
      ],
    });
    fetchAllAccounts.mockReturnValue([]);
    fetchInProgressACCNumber.mockReturnValue({
      done: true,
      queryLocator: null,
      records: [],
      totalSize: 1,
    });
    saveToDo.mockReturnValue({
      done: true,
      queryLocator: null,
      records: [],
    });
  });

  it('should render properly and call save form', async () => {
    const promise = Promise.resolve();
    const { UNSAFE_root, getByTestId } = await waitFor(() =>
      render(<CompleteToDo route={{ params: params }} />)
    );
    await act(() => promise);

    const formikElement = await UNSAFE_root.findByType(Formik);

    const surveyTypeContainer = await getByTestId('surveyTypeContainer');
    const surveyTypeSelect = surveyTypeContainer.findByType(Select);

    const intervieweeContainer = await getByTestId('intervieweeContainer');
    const intervieweeSelect = intervieweeContainer.findByType(Autocomplete);

    const completeButton = await getByTestId('completeButton');

    expect(formikElement).toBeTruthy();

    await act(async () => {
      surveyTypeSelect.props.onChange([{ label: 'test', value: 'test' }]);
      intervieweeSelect.props.onChange([{ label: 'test', value: 'test' }]);

      fireEvent(completeButton, 'press', { nativeEvent: {} });
      formikElement.props.onSubmit({ surveyType: { value: 'test' } });
    });
  });

  it('should render properly and call save form without completing AccountCompliance__c', async () => {
    fetchInProgressACCNumber.mockReturnValue({
      done: true,
      queryLocator: null,
      records: [],
      totalSize: 2,
    });

    const promise = Promise.resolve();
    const { UNSAFE_root } = await waitFor(() =>
      render(<CompleteToDo route={{ params: params }} />)
    );
    await act(() => promise);

    const formikElement = await UNSAFE_root.findByType(Formik);

    await act(async () => {
      formikElement.props.onSubmit({ surveyType: { value: 'test' } });
    });
  });
});
