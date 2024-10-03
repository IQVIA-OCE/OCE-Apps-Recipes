import { render, act, fireEvent } from '@testing-library/react-native';
import { CallToDoForm } from './CallToDoForm';
import { COMPLIANCE_RECORDS_RAW_EPPV, COMPLIANCE_TYPES, SURVEY_TYPES } from '../../__mocks__/complianceMocks';
import { callSelector, complianceTypesSelector } from '../../store/callToDos/callToDosSelectors';
import { fetchAccounts, fetchAllComplianceRecords, fetchSurveyTypes } from '../../api/callToDoApi';
import { Provider, RadioButton, Select, TextInput } from '@oce-apps/apollo-react-native';
import { useFormikContext } from 'formik';
import { IntervieweeLookupField } from '../IntervieweeLookupField/IntervieweeLookupField';
import { ACCOUNTS_RAW } from '../../__mocks__/accountMocks';
import { CALL_MAPPED } from '../../__mocks__/callMocks';

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

jest.mock('@oce-apps/oce-apps-bridges', () => {
  const module = jest.requireActual('@oce-apps/oce-apps-bridges');

  return {
    ...module,
    environment: {
      ...module.environment,
      namespace: () => 'OCE__',
    },
  };
});

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn((selector) => selector()),
}));

const MOCK_FORMIK_CONTEXT = {
  values: {
    complianceType: null,
    compliance: null,
    surveyType: null,
    interviewee: null,
    otherInterviewee: '',
  },
  errors: {},
  touched: {},
  setFieldValue: jest.fn(),
  setFieldTouched: jest.fn(),
};

jest.mock('formik', () => ({
  useFormikContext: jest.fn(),
}));

jest.mock('../../store/callToDos/callToDosSelectors', () => ({
  complianceTypesSelector: jest.fn(),
  callSelector: jest.fn(),
}));

jest.mock('../../api/callToDoApi', () => ({
  fetchSurveyTypes: jest.fn(),
  fetchAccounts: jest.fn(),
  fetchAllComplianceRecords: jest.fn(),
}));

describe('CallToDoForm', () => {
  it('should render properly if call account is not HCO or Pharmacy', async () => {
    complianceTypesSelector.mockReturnValue(COMPLIANCE_TYPES);
    callSelector.mockReturnValue({
      ...CALL_MAPPED,
      account: {
        isPersonAccount: 1,
        recordType: {
          developerName: 'BC',
        },
      },
    });
    fetchSurveyTypes.mockResolvedValue(SURVEY_TYPES);
    useFormikContext.mockReturnValue(MOCK_FORMIK_CONTEXT);
    const { getByTestId, queryByTestId } = render(
      <Provider>
        <CallToDoForm />
      </Provider>
    );

    const promise = Promise.resolve();

    await act(() => promise);

    expect(getByTestId('complianceTypeFieldContainer')).toBeTruthy();
    expect(getByTestId('complianceFieldContainer')).toBeTruthy();
    expect(getByTestId('surveyTypeFieldContainer')).toBeTruthy();
    expect(queryByTestId('intervieweeFieldContainer')).toBeNull();
    expect(queryByTestId('otherIntervieweeFieldContainer')).toBeNull();
  });

  it('should render properly if call account is Ins-Doc', async () => {
    complianceTypesSelector.mockReturnValue(COMPLIANCE_TYPES);
    callSelector.mockReturnValue({
      ...CALL_MAPPED,
      account: {
        isPersonAccount: 0,
        recordType: {
          developerName: 'Ins_Doc',
        },
      },
    });
    fetchSurveyTypes.mockResolvedValue(SURVEY_TYPES);
    useFormikContext.mockReturnValue(MOCK_FORMIK_CONTEXT);
    const { getByTestId, queryByTestId } = render(
      <Provider>
        <CallToDoForm />
      </Provider>
    );

    const promise = Promise.resolve();

    await act(() => promise);

    expect(getByTestId('complianceTypeFieldContainer')).toBeTruthy();
    expect(getByTestId('complianceFieldContainer')).toBeTruthy();
    expect(getByTestId('surveyTypeFieldContainer')).toBeTruthy();
    expect(queryByTestId('intervieweeFieldContainer')).toBeNull();
    expect(queryByTestId('otherIntervieweeFieldContainer')).toBeNull();
  });

  it('should render properly if call account HCO or Pharmacy and handle form actions', async () => {
    const setFieldValue = jest.fn();
    useFormikContext.mockReturnValue({
      ...MOCK_FORMIK_CONTEXT,
      setFieldValue,
    });
    complianceTypesSelector.mockReturnValue(COMPLIANCE_TYPES);
    callSelector.mockReturnValue({
      ...CALL_MAPPED,
      account: {
        isPersonAccount: 0,
        recordType: {
          developerName: 'Institution',
        },
      },
    });
    fetchSurveyTypes.mockResolvedValue(SURVEY_TYPES);
    fetchAccounts.mockResolvedValue({ records: ACCOUNTS_RAW, done: true });
    fetchAllComplianceRecords.mockResolvedValue(COMPLIANCE_RECORDS_RAW_EPPV);
    const { getByTestId, UNSAFE_getByType, update } = render(
      <Provider>
        <CallToDoForm />
      </Provider>
    );

    const promise = Promise.resolve();
    await act(() => promise);

    expect(setFieldValue).toHaveBeenNthCalledWith(1, 'complianceType', 'EPPV');

    const complianceTypeFieldContainerEl = getByTestId('complianceTypeFieldContainer');
    const complianceFieldContainerEl = getByTestId('complianceFieldContainer');
    const surveyTypeFieldContainerEl = getByTestId('surveyTypeFieldContainer');
    const intervieweeFieldContainerEl = getByTestId('intervieweeFieldContainer');
    const otherIntervieweeFieldContainerEl = getByTestId('otherIntervieweeFieldContainer');

    expect(complianceTypeFieldContainerEl).toBeTruthy();
    expect(complianceFieldContainerEl).toBeTruthy();
    expect(surveyTypeFieldContainerEl).toBeTruthy();
    expect(intervieweeFieldContainerEl).toBeTruthy();
    expect(otherIntervieweeFieldContainerEl).toBeTruthy();

    const complianceTypeRadioButtonGroupEl = UNSAFE_getByType(RadioButton.Group);
    const complianceSelectEl = complianceFieldContainerEl.findByType(Select);
    const surveyTypeSelectEl = surveyTypeFieldContainerEl.findByType(Select);
    const intervieweeFieldEl = intervieweeFieldContainerEl.findByType(IntervieweeLookupField);
    const otherIntervieweeFieldEl = otherIntervieweeFieldContainerEl.findByType(TextInput);

    await act(async () => {
      complianceTypeRadioButtonGroupEl.props.onChange('MID');
      complianceSelectEl.props.onChange({ label: 'Compliance EPPV 1', value: 'a2f0k0000006r0pAAA' });
      surveyTypeSelectEl.props.onChange({
        defaultValue: false,
        label: 'Face To Face',
        active: true,
        value: 'Face To Face',
      });
      intervieweeFieldEl.props.onChange({ value: '0010k00001UXI2AAAX', label: 'IS BC Contact #1' });
      fireEvent.changeText(otherIntervieweeFieldEl, 'Other Interviewee');
    });

    expect(setFieldValue).toHaveBeenNthCalledWith(2, 'complianceType', 'MID');
    expect(setFieldValue).toHaveBeenNthCalledWith(3, 'compliance', {
      label: 'Compliance EPPV 1',
      value: 'a2f0k0000006r0pAAA',
    });
    expect(setFieldValue).toHaveBeenNthCalledWith(4, 'surveyType', {
      defaultValue: false,
      label: 'Face To Face',
      active: true,
      value: 'Face To Face',
    });
    expect(setFieldValue).toHaveBeenNthCalledWith(5, 'interviewee', {
      value: '0010k00001UXI2AAAX',
      label: 'IS BC Contact #1',
    });
    expect(setFieldValue).toHaveBeenNthCalledWith(6, 'otherInterviewee', 'Other Interviewee');

    useFormikContext.mockClear().mockReturnValue({
      ...MOCK_FORMIK_CONTEXT,
      setFieldValue,
      values: {
        ...MOCK_FORMIK_CONTEXT.values,
        complianceType: 'MID',
      },
      touched: {
        complianceType: true,
      },
    });

    await act(async () => {
      update(
        <Provider>
          <CallToDoForm />
        </Provider>
      );
    });

    expect(setFieldValue).toHaveBeenNthCalledWith(7, 'compliance', null);
  });

  it('should handle form errors', async () => {
    useFormikContext.mockReturnValue({
      ...MOCK_FORMIK_CONTEXT,
      errors: { compliance: 'Field is required', surveyType: 'Field is required' },
      touched: { compliance: true, complianceType: true, surveyType: true },
    });
    complianceTypesSelector.mockReturnValue(COMPLIANCE_TYPES);
    callSelector.mockReturnValue({
      ...CALL_MAPPED,
      account: {
        isPersonAccount: 1,
        recordType: {
          developerName: 'BC',
        },
      },
    });
    fetchSurveyTypes.mockResolvedValue(SURVEY_TYPES);
    const { getAllByText } = render(
      <Provider>
        <CallToDoForm />
      </Provider>
    );

    const promise = Promise.resolve();
    await act(() => promise);

    expect(getAllByText('Field is required').length).toBe(2);
  });
});
