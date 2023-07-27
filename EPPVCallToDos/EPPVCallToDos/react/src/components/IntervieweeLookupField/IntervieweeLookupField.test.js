import { render, act, fireEvent, waitFor } from '@testing-library/react-native';
import { IntervieweeLookupField } from './IntervieweeLookupField';
import { Provider, RadioButton, TextInput } from 'apollo-react-native';
import { fetchAccounts, fetchByQueryLocator } from '../../api/callToDoApi';
import { TouchableWithoutFeedback as MockTouchableWithoutFeedback } from 'react-native';
import { ACCOUNTS_MAPPED, ACCOUNTS_RAW, MORE_ACCOUNTS_RAW } from '../../__mocks__/accountMocks';

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

jest.mock('apollo-react-native/lib/module/components/TouchableRipple', () =>
  jest.fn(({ children, ...props }) => (
    <MockTouchableWithoutFeedback {...props}>{children}</MockTouchableWithoutFeedback>
  ))
);

jest.mock('oce-apps-bridges', () => {
  const module = jest.requireActual('oce-apps-bridges');

  return {
    ...module,
    environment: {
      ...module.environment,
      namespace: () => 'OCE__',
    },
  };
});

jest.mock('../../api/callToDoApi', () => ({
  fetchAccounts: jest.fn(),
  fetchByQueryLocator: jest.fn(),
}));

describe('IntervieweeLookupField', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render properly', async () => {
    fetchAccounts.mockResolvedValueOnce({ records: ACCOUNTS_RAW });
    const { getByTestId } = render(
      <Provider>
        <IntervieweeLookupField />
      </Provider>
    );

    const promise = Promise.resolve();

    await act(() => promise);

    const intervieweeInputEl = getByTestId('intervieweeLookupTextInput');
    expect(intervieweeInputEl).toBeTruthy();
  });

  it('should handle fetching accounts and selecting the interviewee', async () => {
    fetchAccounts.mockResolvedValueOnce({ records: ACCOUNTS_RAW, done: false, queryLocator: 'ql' });
    fetchByQueryLocator.mockResolvedValueOnce({ records: MORE_ACCOUNTS_RAW });
    const onChange = jest.fn();
    const { getByTestId, container, update, queryByTestId, getByText } = render(
      <Provider>
        <IntervieweeLookupField interviewee={null} onChange={onChange} />
      </Provider>
    );

    const promise = Promise.resolve();

    await act(() => promise);

    const intervieweeInputEl = getByTestId('intervieweeLookupTextInput');
    expect(queryByTestId('selectedIntervieweeLabel')).toBeNull();
    fireEvent.press(intervieweeInputEl);

    await act(() => promise);

    expect(getByTestId('intervieweeLookupModalContainer')).toBeTruthy();

    act(() => {
      getByTestId('listContainer').props.onLayout({
        nativeEvent: {
          layout: {
            width: 200,
            height: 100,
          },
        },
      });
    });

    await act(async () => {
      getByTestId('callTodoList').props.onEndReached({ distanceFromEnd: 1 });
    });

    const firstRadioButtonEl = container.findAllByType(RadioButton)[0];

    act(() => {
      firstRadioButtonEl.props.onChange();
    });

    update(
      <Provider>
        <IntervieweeLookupField
          interviewee={{ label: ACCOUNTS_MAPPED[0].name, value: ACCOUNTS_MAPPED[0].id }}
          onChange={onChange}
        />
      </Provider>
    );

    expect(getByTestId('selectedIntervieweeLabel')).toBeTruthy();

    const saveButtonEl = getByText('Save');
    fireEvent.press(saveButtonEl);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({ label: 'IS BC Contact #1', value: '0010k00001UXI2AAAX' });
  });

  it('should properly clear the selected value', async () => {
    fetchAccounts.mockResolvedValueOnce({ records: ACCOUNTS_RAW, done: false, queryLocator: 'ql' });
    const onChange = jest.fn();
    const { container } = render(
      <Provider>
        <IntervieweeLookupField
          interviewee={{ label: ACCOUNTS_MAPPED[0].name, value: ACCOUNTS_MAPPED[0].id }}
          onChange={onChange}
        />
      </Provider>
    );
    const promise = Promise.resolve();

    await act(() => promise);

    const intervieweeInputEl = container.findByType(TextInput);

    act(() => {
      intervieweeInputEl.props.onIconPress();
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('should handle sorting', async () => {
    fetchAccounts.mockResolvedValue({ records: ACCOUNTS_RAW, done: false, queryLocator: 'ql' });
    fetchByQueryLocator.mockResolvedValueOnce({ records: MORE_ACCOUNTS_RAW });
    const onChange = jest.fn();
    const { getByTestId, getAllByTestId } = await waitFor(async () =>
      render(
        <Provider>
          <IntervieweeLookupField interviewee={null} onChange={onChange} />
        </Provider>
      )
    );

    const intervieweeInputEl = getByTestId('intervieweeLookupTextInput');
    fireEvent.press(intervieweeInputEl);

    expect(fetchAccounts).toHaveBeenCalledTimes(1);
    const listHeaderCell = getAllByTestId('listHeaderCell')[1];
    await act(async () => {
      fireEvent.press(listHeaderCell);
    });
    expect(fetchAccounts).toHaveBeenCalledTimes(2);
    await act(async () => {
      fireEvent.press(listHeaderCell);
    });
    expect(fetchAccounts).toHaveBeenCalledTimes(3);
  });
});
