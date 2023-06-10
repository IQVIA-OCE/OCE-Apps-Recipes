import { render, act } from '@testing-library/react-native';
import { CallToDoModal } from './CallToDoModal';
import { View as MockView, TouchableWithoutFeedback as MockTouchableWithoutFeedback } from 'react-native';
import { saveToDo } from '../../store/callToDos/callToDosSlice';
import { callSelector, formLoadingStatusSelector } from '../../store/callToDos/callToDosSelectors';
import { LOADING_STATUS } from '../../constants';
import { Provider } from 'apollo-react-native';
import { Formik } from 'formik';
import { useDispatch } from 'react-redux';
import { CALL_MAPPED } from '../../__mocks__/callMocks';

jest.mock('apollo-react-native/lib/module/components/TouchableRipple', () =>
  jest.fn(({ children, ...props }) => (
    <MockTouchableWithoutFeedback {...props}>{children}</MockTouchableWithoutFeedback>
  ))
);

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn((selector) => selector()),
}));

jest.mock('../../store/callToDos/callToDosSelectors', () => ({
  callSelector: jest.fn(),
  formLoadingStatusSelector: jest.fn(),
}));

jest.mock('../CallToDoForm/CallToDoForm', () => ({
  CallToDoForm: () => <MockView />,
}));

jest.mock('../../store/callToDos/callToDosSlice', () => ({
  saveToDo: jest.fn(),
}));

const mockDispatch = () => ({
  unwrap: () => Promise.resolve(),
});

describe('CallToDoModal', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('should handle form submit', () => {
    it('create', async () => {
      callSelector.mockReturnValue(CALL_MAPPED);
      formLoadingStatusSelector.mockReturnValue(LOADING_STATUS.IDLE);
      useDispatch.mockImplementation(() => mockDispatch);
      const onClose = jest.fn();
      const { container } = render(
        <Provider>
          <CallToDoModal isOpen={true} onClose={onClose} />
        </Provider>
      );

      const formikEl = container.findByType(Formik);

      await act(() => {
        formikEl.props.onSubmit({
          compliance: { label: 'Compliance EPPV 1', value: 'a2f0k0000006r0pAAA' },
          complianceType: 'EPPV',
          interviewee: { label: 'IS BC Contact #1', value: '0010k00001UXI2AAAX' },
          otherInterviewee: 'Test',
          surveyType: { active: true, defaultValue: false, label: 'Face To Face', value: 'Face To Face' },
        });
      });

      expect(saveToDo).toHaveBeenCalledTimes(1);
      expect(saveToDo).toHaveBeenCalledWith({
        id: null,
        callId: 'a2W0k000002LNqnEAG',
        compliance: 'a2f0k0000006r0pAAA',
        complianceType: 'EPPV',
        interviewee: '0010k00001UXI2AAAX',
        otherInterviewee: 'Test',
        surveyType: 'Face To Face',
      });
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('edit', async () => {
      callSelector.mockReturnValue(CALL_MAPPED);
      formLoadingStatusSelector.mockReturnValue(LOADING_STATUS.IDLE);
      useDispatch.mockImplementation(() => mockDispatch);
      const onClose = jest.fn();
      const { container } = render(
        <Provider>
          <CallToDoModal existingRecord={{ id: '1' }} isOpen={true} onClose={onClose} />
        </Provider>
      );

      const formikEl = container.findByType(Formik);

      await act(() => {
        formikEl.props.onSubmit({
          compliance: { label: 'Compliance EPPV 1', value: 'a2f0k0000006r0pAAA' },
          complianceType: 'EPPV',
          interviewee: { label: 'IS BC Contact #1', value: '0010k00001UXI2AAAX' },
          otherInterviewee: 'Test',
          surveyType: { active: true, defaultValue: false, label: 'Face To Face', value: 'Face To Face' },
        });
      });

      expect(saveToDo).toHaveBeenCalledTimes(1);
      expect(saveToDo).toHaveBeenCalledWith({
        id: '1',
        callId: 'a2W0k000002LNqnEAG',
        compliance: 'a2f0k0000006r0pAAA',
        complianceType: 'EPPV',
        interviewee: '0010k00001UXI2AAAX',
        otherInterviewee: 'Test',
        surveyType: 'Face To Face',
      });
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});
