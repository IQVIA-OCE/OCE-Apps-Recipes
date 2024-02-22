import { render, act } from '@testing-library/react-native';
import { SurveyTypeSelect } from './SurveyTypeSelect';
import { fetchSurveyTypes } from '../../api/callToDoApi';

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
  useFormikContext: jest.fn(() => MOCK_FORMIK_CONTEXT),
}));

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

jest.mock('../../api/callToDoApi', () => ({
  fetchSurveyTypes: jest.fn(),
}));

describe('SurveyTypeSelect', () => {
  afterEach(() => {
    fetchSurveyTypes.mockClear();
  });

  it('should render properly', async () => {
    fetchSurveyTypes.mockResolvedValueOnce([[{ value: '1', label: 'test' }]]);
    const { getByTestId } = render(<SurveyTypeSelect />);

    const promise = Promise.resolve();

    await act(() => promise);

    expect(getByTestId('surveyTypeSelect')).toBeTruthy();
  });

  it('should handle fetch error', async () => {
    const fetchError = new Error('survey types fetch error');
    fetchSurveyTypes.mockRejectedValueOnce(fetchError);
    const onFetchError = jest.fn();
    render(<SurveyTypeSelect onFetchError={onFetchError} />);

    const promise = Promise.resolve();

    await act(() => promise);

    expect(onFetchError).toHaveBeenCalledTimes(1);
    expect(onFetchError).toHaveBeenCalledWith(fetchError);
  });
});
