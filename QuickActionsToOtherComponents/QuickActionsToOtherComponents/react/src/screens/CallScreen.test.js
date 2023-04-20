import { act, render, waitFor } from '@testing-library/react-native';
import { Provider as ApolloProvider } from 'apollo-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { CustomProgress } from '../components/CustomProgress';
import { CustomTable } from '../components/CustomTable';
import { InquiryCreationForm } from '../components/InquiryCreationForm';
import { ModalSelector } from '../components/ModalSelector';
import { LOADING_STATUS } from '../constants';
import {
  CALL_ATTENDEES_MAPPED_DATA,
  CALL_MAPPED_DATA,
  INQUIRIES_MAPPED_DATA,
  INQUIRY_CHANNEL_MAPPED_DATA,
  INQUIRY_FROM_FORM,
  INQUIRY_TYPE_MAPPED_DATA,
  ORDERS_MAPPED_DATA,
  STORE_CHECK_MAPPED_DATA,
} from '../mocks/callTestData';
import * as utilsCommon from '../utils/common';
import * as utilsNavigator from '../utils/navigator';
import { CallScreen } from './CallScreen';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

const STATE_MOCK = {
  loadingStatus: LOADING_STATUS.SUCCESS,
  callObj: CALL_MAPPED_DATA,
  callAttendees: CALL_ATTENDEES_MAPPED_DATA,
  orders: {
    data: ORDERS_MAPPED_DATA,
    totalSize: ORDERS_MAPPED_DATA.length,
  },
  inquiries: {
    data: INQUIRIES_MAPPED_DATA,
    totalSize: INQUIRIES_MAPPED_DATA.length,
  },
  storeCheck: {
    data: STORE_CHECK_MAPPED_DATA,
    totalSize: STORE_CHECK_MAPPED_DATA.length,
  },
  permissions: {
    canCreateOrder: true,
    canCreateInquiry: true,
    canCreateStoreCheck: true,
  },
  inquiryFormData: {
    inquiryTypes: INQUIRY_TYPE_MAPPED_DATA,
    inquiryChannels: INQUIRY_CHANNEL_MAPPED_DATA,
  },
};

describe('CallScreen', () => {
  beforeEach(() => {
    useDispatch.mockReturnValue(() => jest.fn());
    useSelector.mockImplementation((cb) => cb({ callStore: STATE_MOCK }));
  });

  test('should render properly', () => {
    utilsCommon.isIphone = false;
    utilsCommon.isWeb = false;
    const { queryByText } = render(
      <ApolloProvider>
        <CallScreen recordId={'111'} />
      </ApolloProvider>
    );

    expect(queryByText('Orders', { exact: true })).toBeTruthy();
    expect(queryByText('Inquiry', { exact: true })).toBeTruthy();
    expect(queryByText('Store Check', { exact: true })).toBeTruthy();
  });

  test('should render properly for WEB', () => {
    utilsCommon.isIphone = false;
    utilsCommon.isWeb = true;
    const { queryByText } = render(
      <ApolloProvider>
        <CallScreen recordId={'111'} />
      </ApolloProvider>
    );

    expect(queryByText('Orders', { exact: true })).toBeTruthy();
    expect(queryByText('Inquiry', { exact: true })).toBeTruthy();
    expect(queryByText('Store Check', { exact: true })).toBeTruthy();
  });

  test('should render properly for iPhone', () => {
    utilsCommon.isIphone = true;
    utilsCommon.isWeb = false;
    const { queryByText } = render(
      <ApolloProvider>
        <CallScreen recordId={'111'} />
      </ApolloProvider>
    );

    expect(queryByText('Orders', { exact: true })).toBeTruthy();
    expect(queryByText('Inquiry', { exact: true })).toBeTruthy();
    expect(queryByText('Store Check', { exact: true })).toBeTruthy();
  });

  test('should render CustomProgress for loading status', async () => {
    useSelector.mockImplementation((cb) =>
      cb({
        callStore: { ...STATE_MOCK, loadingStatus: LOADING_STATUS.PENDING },
      })
    );
    const { UNSAFE_getByType } = render(
      <ApolloProvider>
        <CallScreen recordId={'111'} />
      </ApolloProvider>
    );

    await waitFor(() => {
      expect(UNSAFE_getByType(CustomProgress)).toBeTruthy();
    });
  });

  describe('button on Order table should open creation screen', () => {
    test('should call openWEBCreateScreen() function on WEB', async () => {
      utilsCommon.isWeb = true;
      window.open = jest.fn();

      const openWEBCreateScreenSpy = jest.spyOn(
        utilsNavigator,
        'openWEBCreateScreen'
      );
      const { queryByText, UNSAFE_getAllByType } = render(
        <ApolloProvider>
          <CallScreen recordId={'111'} />
        </ApolloProvider>
      );

      await waitFor(() => {
        expect(queryByText('Orders', { exact: true })).toBeTruthy();
      });

      act(() => {
        UNSAFE_getAllByType(CustomTable)
          .find((el) => el.props.title === 'Orders')
          .props.onPressButton();
      });

      await waitFor(() => {
        expect(openWEBCreateScreenSpy).toHaveBeenCalled();
      });
    });

    test('should call openNativeCreateScreen() function on iOS platform', async () => {
      utilsCommon.isWeb = false;

      const openNativeCreateScreenSpy = jest.spyOn(
        utilsNavigator,
        'openNativeCreateScreen'
      );
      const { queryByText, UNSAFE_getAllByType } = render(
        <ApolloProvider>
          <CallScreen recordId={'111'} />
        </ApolloProvider>
      );

      await waitFor(() => {
        expect(queryByText('Orders', { exact: true })).toBeTruthy();
      });

      act(() => {
        UNSAFE_getAllByType(CustomTable)
          .find((el) => el.props.title === 'Orders')
          .props.onPressButton();
      });

      await waitFor(() => {
        expect(openNativeCreateScreenSpy).toHaveBeenCalled();
      });
    });
  });

  test('button on Store Check table should call openNativeCreateScreen() function on iOS platform', async () => {
    utilsCommon.isIOS = true;

    const openNativeCreateScreenSpy = jest.spyOn(
      utilsNavigator,
      'openNativeCreateScreen'
    );
    const { queryByText, UNSAFE_getAllByType } = render(
      <ApolloProvider>
        <CallScreen recordId={'111'} />
      </ApolloProvider>
    );

    await waitFor(() => {
      expect(queryByText('Store Check', { exact: true })).toBeTruthy();
    });

    act(() => {
      UNSAFE_getAllByType(CustomTable)
        .find((el) => el.props.title === 'Store Check')
        .props.onPressButton();
    });

    await waitFor(() => {
      expect(openNativeCreateScreenSpy).toHaveBeenCalled();
    });
  });

  test('button on Inquiry table should open ModalSelector component if call attendees is not empty', async () => {
    const { queryByText, UNSAFE_getAllByType, UNSAFE_getByType } = render(
      <ApolloProvider>
        <CallScreen recordId={'111'} />
      </ApolloProvider>
    );

    await waitFor(() => {
      expect(queryByText('Inquiry', { exact: true })).toBeTruthy();
    });

    act(() => {
      UNSAFE_getAllByType(CustomTable)
        .find((el) => el.props.title === 'Inquiry')
        .props.onPressButton();
    });

    await waitFor(() => {
      expect(UNSAFE_getByType(ModalSelector)).toBeTruthy();
    });
  });

  test('button on Inquiry table should open InquiryCreationForm component if call attendees is empty', async () => {
    useSelector.mockImplementation((cb) =>
      cb({
        callStore: { ...STATE_MOCK, callAttendees: [] },
      })
    );
    const { queryByText, UNSAFE_getAllByType, UNSAFE_getByType } = render(
      <ApolloProvider>
        <CallScreen recordId={'111'} />
      </ApolloProvider>
    );

    await waitFor(() => {
      expect(queryByText('Inquiry', { exact: true })).toBeTruthy();
    });

    act(() => {
      UNSAFE_getAllByType(CustomTable)
        .find((el) => el.props.title === 'Inquiry')
        .props.onPressButton();
    });

    await waitFor(() => {
      expect(UNSAFE_getByType(InquiryCreationForm)).toBeTruthy();
    });
  });

  test('ModalSelector component Next button should open InquiryCreationForm component', async () => {
    const { queryByText, UNSAFE_getAllByType, UNSAFE_getByType } = render(
      <ApolloProvider>
        <CallScreen recordId={'111'} />
      </ApolloProvider>
    );

    await waitFor(() => {
      expect(queryByText('Inquiry', { exact: true })).toBeTruthy();
    });

    act(() => {
      UNSAFE_getAllByType(CustomTable)
        .find((el) => el.props.title === 'Inquiry')
        .props.onPressButton();
    });

    await waitFor(() => {
      expect(UNSAFE_getByType(ModalSelector)).toBeTruthy();
    });

    act(() => {
      UNSAFE_getByType(ModalSelector).props.handleNext({
        label: CALL_ATTENDEES_MAPPED_DATA[1].account,
        value: CALL_ATTENDEES_MAPPED_DATA[1].accountId,
      });
    });

    await waitFor(() => {
      expect(UNSAFE_getByType(InquiryCreationForm)).toBeTruthy();
    });
  });

  test('ModalSelector component Close button should close ModalSelector component', async () => {
    const {
      queryByText,
      UNSAFE_getAllByType,
      UNSAFE_getByType,
      UNSAFE_queryByType,
    } = render(
      <ApolloProvider>
        <CallScreen recordId={'111'} />
      </ApolloProvider>
    );

    await waitFor(() => {
      expect(queryByText('Inquiry', { exact: true })).toBeTruthy();
    });

    act(() => {
      UNSAFE_getAllByType(CustomTable)
        .find((el) => el.props.title === 'Inquiry')
        .props.onPressButton();
    });

    await waitFor(() => {
      expect(UNSAFE_getByType(ModalSelector)).toBeTruthy();
    });

    act(() => {
      UNSAFE_getByType(ModalSelector).props.handleCancel();
    });

    await waitFor(() => {
      expect(UNSAFE_queryByType(ModalSelector)).toBeNull();
    });
  });

  test('InquiryCreationForm component Save button should call store dispatch event for saving', async () => {
    utilsCommon.isWeb = true;
    useSelector.mockImplementation((cb) =>
      cb({
        callStore: { ...STATE_MOCK, callAttendees: [] },
      })
    );
    const {
      queryByText,
      UNSAFE_getAllByType,
      UNSAFE_getByType,
      UNSAFE_queryByType,
    } = render(
      <ApolloProvider>
        <CallScreen recordId={'111'} />
      </ApolloProvider>
    );

    await waitFor(() => {
      expect(queryByText('Inquiry', { exact: true })).toBeTruthy();
    });

    act(() => {
      UNSAFE_getAllByType(CustomTable)
        .find((el) => el.props.title === 'Inquiry')
        .props.onPressButton();
    });

    await waitFor(() => {
      expect(UNSAFE_getByType(InquiryCreationForm)).toBeTruthy();
    });

    act(() => {
      UNSAFE_getByType(InquiryCreationForm).props.handleSave(INQUIRY_FROM_FORM);
    });

    await waitFor(() => {
      expect(UNSAFE_queryByType(InquiryCreationForm)).toBeNull();
      expect(useDispatch).toHaveBeenCalled();
    });
  });

  test('InquiryCreationForm component Close button should close InquiryCreationForm component', async () => {
    useSelector.mockImplementation((cb) =>
      cb({
        callStore: { ...STATE_MOCK, callAttendees: [] },
      })
    );
    const {
      queryByText,
      UNSAFE_getAllByType,
      UNSAFE_getByType,
      UNSAFE_queryByType,
    } = render(
      <ApolloProvider>
        <CallScreen recordId={'111'} />
      </ApolloProvider>
    );

    await waitFor(() => {
      expect(queryByText('Inquiry', { exact: true })).toBeTruthy();
    });

    act(() => {
      UNSAFE_getAllByType(CustomTable)
        .find((el) => el.props.title === 'Inquiry')
        .props.onPressButton();
    });

    await waitFor(() => {
      expect(UNSAFE_getByType(InquiryCreationForm)).toBeTruthy();
    });

    act(() => {
      UNSAFE_getByType(InquiryCreationForm).props.handleCancel();
    });

    await waitFor(() => {
      expect(UNSAFE_queryByType(InquiryCreationForm)).toBeNull();
    });
  });
});
