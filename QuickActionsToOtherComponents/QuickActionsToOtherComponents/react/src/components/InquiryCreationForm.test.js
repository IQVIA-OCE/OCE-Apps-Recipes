import { act, render, waitFor } from '@testing-library/react-native';
import {
  Button,
  Provider as ApolloProvider,
  Select,
  Switch,
  TextInput,
} from 'apollo-react-native';
import React from 'react';
import {
  INQUIRY_CHANNEL_MAPPED_DATA,
  INQUIRY_TYPE_MAPPED_DATA,
} from '../mocks/callTestData';
import * as utilsCommon from '../utils/common';
import { InquiryCreationForm } from './InquiryCreationForm';

const ACCOUNTS_MOCK = [
  {
    label: 'Mark Smith',
    value: '111',
  },
  {
    label: 'Terry Crews',
    value: '222',
  },
  {
    label: 'Josh Brolin',
    value: '333',
  },
];

const CALL_MOCK = { id: 'call111', name: 'CALL-111' };

describe('InquiryCreationForm', () => {
  test('should render properly', async () => {
    utilsCommon.isIphone = false;
    utilsCommon.isWeb = false;
    const { getByText, UNSAFE_getAllByType } = render(
      <ApolloProvider>
        <InquiryCreationForm
          visible={true}
          handleCancel={jest.fn()}
          handleSave={jest.fn()}
          account={ACCOUNTS_MOCK[0]}
          accountsList={ACCOUNTS_MOCK}
          call={CALL_MOCK}
          inquiryTypes={INQUIRY_TYPE_MAPPED_DATA}
          inquiryChannels={INQUIRY_CHANNEL_MAPPED_DATA}
        />
      </ApolloProvider>
    );

    await waitFor(() => {
      expect(getByText(/New Inquiry/i)).toBeTruthy();
      expect(UNSAFE_getAllByType(Select)[0].props.value).toEqual(
        ACCOUNTS_MOCK[0]
      );
    });
  });

  test('should render properly for iPhone', async () => {
    utilsCommon.isIphone = true;
    utilsCommon.isWeb = false;
    const { getByText, UNSAFE_getAllByType } = render(
      <ApolloProvider>
        <InquiryCreationForm
          visible={true}
          handleCancel={jest.fn()}
          handleSave={jest.fn()}
          account={ACCOUNTS_MOCK[0]}
          accountsList={ACCOUNTS_MOCK}
          call={CALL_MOCK}
          inquiryTypes={INQUIRY_TYPE_MAPPED_DATA}
          inquiryChannels={INQUIRY_CHANNEL_MAPPED_DATA}
        />
      </ApolloProvider>
    );

    await waitFor(() => {
      expect(getByText(/New Inquiry/i)).toBeTruthy();
      expect(UNSAFE_getAllByType(Select)[0].props.value).toEqual(
        ACCOUNTS_MOCK[0]
      );
    });
  });

  test('should render properly for WEB', async () => {
    utilsCommon.isIphone = false;
    utilsCommon.isWeb = true;
    const { getByText, UNSAFE_getAllByType } = render(
      <ApolloProvider>
        <InquiryCreationForm
          visible={true}
          handleCancel={jest.fn()}
          handleSave={jest.fn()}
          account={ACCOUNTS_MOCK[0]}
          accountsList={ACCOUNTS_MOCK}
          call={CALL_MOCK}
          inquiryTypes={INQUIRY_TYPE_MAPPED_DATA}
          inquiryChannels={INQUIRY_CHANNEL_MAPPED_DATA}
        />
      </ApolloProvider>
    );

    await waitFor(() => {
      expect(getByText(/New Inquiry/i)).toBeTruthy();
      expect(UNSAFE_getAllByType(Select)[0].props.value).toEqual(
        ACCOUNTS_MOCK[0]
      );
    });
  });

  test('should show error if response contact is invalid or response preference is not selected', async () => {
    const { getByText, UNSAFE_getAllByType } = render(
      <ApolloProvider>
        <InquiryCreationForm
          visible={true}
          handleCancel={jest.fn()}
          handleSave={jest.fn()}
          account={ACCOUNTS_MOCK[0]}
          accountsList={ACCOUNTS_MOCK}
          call={CALL_MOCK}
          inquiryTypes={INQUIRY_TYPE_MAPPED_DATA}
          inquiryChannels={INQUIRY_CHANNEL_MAPPED_DATA}
        />
      </ApolloProvider>
    );

    await waitFor(() => {
      expect(getByText(/New Inquiry/i)).toBeTruthy();
    });

    act(() => {
      UNSAFE_getAllByType(Select)
        .find((el) => el.props.label === 'Response Preference')
        .props.onChange(null);
    });

    await waitFor(() => {
      expect(getByText(/Cannot be empty/i)).toBeTruthy();
    });

    act(() => {
      UNSAFE_getAllByType(Select)
        .find((el) => el.props.label === 'Response Preference')
        .props.onChange({
          label: 'Email',
          value: 'Email',
        });
    });

    await waitFor(() => {
      expect(getByText(/Cannot be empty/i)).toBeTruthy();
    });

    act(() => {
      UNSAFE_getAllByType(TextInput)
        .find((el) => el.props.label === 'Email')
        .props.onChangeText('abc');
    });

    await waitFor(() => {
      expect(getByText(/Incorrect email/i)).toBeTruthy();
    });

    act(() => {
      UNSAFE_getAllByType(Select)
        .find((el) => el.props.label === 'Response Preference')
        .props.onChange({
          label: 'Fax',
          value: 'Fax',
        });
    });

    await waitFor(() => {
      expect(getByText(/Cannot be empty/i)).toBeTruthy();
    });

    act(() => {
      UNSAFE_getAllByType(TextInput)
        .find((el) => el.props.label === 'Fax')
        .props.onChangeText('abc');
    });

    await waitFor(() => {
      expect(getByText(/Incorrect fax number/i)).toBeTruthy();
    });

    act(() => {
      UNSAFE_getAllByType(Select)
        .find((el) => el.props.label === 'Response Preference')
        .props.onChange({
          label: 'Phone',
          value: 'Phone',
        });
    });

    await waitFor(() => {
      expect(getByText(/Cannot be empty/i)).toBeTruthy();
    });

    act(() => {
      UNSAFE_getAllByType(TextInput)
        .find((el) => el.props.label === 'Phone')
        .props.onChangeText('abc');
    });

    await waitFor(() => {
      expect(getByText(/Incorrect phone number/i)).toBeTruthy();
    });

    act(() => {
      UNSAFE_getAllByType(TextInput)
        .find((el) => el.props.label === 'Phone')
        .props.onBlur();
    });

    await waitFor(() => {
      expect(getByText(/Incorrect phone number/i)).toBeTruthy();
    });
  });

  test('should show error if account is not selected', async () => {
    const { getByText, UNSAFE_getAllByType } = render(
      <ApolloProvider>
        <InquiryCreationForm
          visible={true}
          handleCancel={jest.fn()}
          handleSave={jest.fn()}
          account={ACCOUNTS_MOCK[0]}
          accountsList={ACCOUNTS_MOCK}
          call={CALL_MOCK}
          inquiryTypes={INQUIRY_TYPE_MAPPED_DATA}
          inquiryChannels={INQUIRY_CHANNEL_MAPPED_DATA}
        />
      </ApolloProvider>
    );

    await waitFor(() => {
      expect(getByText(/New Inquiry/i)).toBeTruthy();
    });

    act(() => {
      UNSAFE_getAllByType(Select)
        .find((el) => el.props.label === 'Account')
        .props.onChange(null);
    });

    await waitFor(() => {
      expect(getByText(/Cannot be empty/i)).toBeTruthy();
    });
  });

  test('should change priority status if user click on priority swatch', async () => {
    const { getByText, UNSAFE_getByType } = render(
      <ApolloProvider>
        <InquiryCreationForm
          visible={true}
          handleCancel={jest.fn()}
          handleSave={jest.fn()}
          account={ACCOUNTS_MOCK[0]}
          accountsList={ACCOUNTS_MOCK}
          call={CALL_MOCK}
          inquiryTypes={INQUIRY_TYPE_MAPPED_DATA}
          inquiryChannels={INQUIRY_CHANNEL_MAPPED_DATA}
        />
      </ApolloProvider>
    );

    await waitFor(() => {
      expect(getByText(/New Inquiry/i)).toBeTruthy();
    });

    act(() => {
      UNSAFE_getByType(Switch).props.onChange();
    });

    await waitFor(() => {
      expect(UNSAFE_getByType(Switch).props.value).toBe(true);
    });
  });

  test('should change inquiry type if user select another option', async () => {
    const { getByText, UNSAFE_getAllByType } = render(
      <ApolloProvider>
        <InquiryCreationForm
          visible={true}
          handleCancel={jest.fn()}
          handleSave={jest.fn()}
          account={ACCOUNTS_MOCK[0]}
          accountsList={ACCOUNTS_MOCK}
          call={CALL_MOCK}
          inquiryTypes={INQUIRY_TYPE_MAPPED_DATA}
          inquiryChannels={INQUIRY_CHANNEL_MAPPED_DATA}
        />
      </ApolloProvider>
    );

    await waitFor(() => {
      expect(getByText(/New Inquiry/i)).toBeTruthy();
    });

    act(() => {
      UNSAFE_getAllByType(Select)
        .find((el) => el.props.label === 'Inquiry Type')
        .props.onChange(INQUIRY_TYPE_MAPPED_DATA[2]);
    });

    await waitFor(() => {
      expect(getByText(INQUIRY_TYPE_MAPPED_DATA[2].label)).toBeTruthy();
    });
  });

  test('should change inquiry chanel if user select another option', async () => {
    const { getByText, UNSAFE_getAllByType } = render(
      <ApolloProvider>
        <InquiryCreationForm
          visible={true}
          handleCancel={jest.fn()}
          handleSave={jest.fn()}
          account={ACCOUNTS_MOCK[0]}
          accountsList={ACCOUNTS_MOCK}
          call={CALL_MOCK}
          inquiryTypes={INQUIRY_TYPE_MAPPED_DATA}
          inquiryChannels={INQUIRY_CHANNEL_MAPPED_DATA}
        />
      </ApolloProvider>
    );

    await waitFor(() => {
      expect(getByText(/New Inquiry/i)).toBeTruthy();
    });

    act(() => {
      UNSAFE_getAllByType(Select)
        .find((el) => el.props.label === 'Inquiry Chanel')
        .props.onChange(INQUIRY_CHANNEL_MAPPED_DATA[3]);
    });

    await waitFor(() => {
      expect(getByText(INQUIRY_CHANNEL_MAPPED_DATA[3].label)).toBeTruthy();
    });
  });

  test('should handle changing if user enter special handling instruction', async () => {
    const { getByText, UNSAFE_getAllByType } = render(
      <ApolloProvider>
        <InquiryCreationForm
          visible={true}
          handleCancel={jest.fn()}
          handleSave={jest.fn()}
          account={ACCOUNTS_MOCK[0]}
          accountsList={ACCOUNTS_MOCK}
          call={CALL_MOCK}
          inquiryTypes={INQUIRY_TYPE_MAPPED_DATA}
          inquiryChannels={INQUIRY_CHANNEL_MAPPED_DATA}
        />
      </ApolloProvider>
    );

    await waitFor(() => {
      expect(getByText(/New Inquiry/i)).toBeTruthy();
    });

    act(() => {
      UNSAFE_getAllByType(TextInput)
        .find((el) => el.props.label === 'Special Handling Instruction')
        .props.onChangeText(
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
        );
    });

    await waitFor(() => {
      expect(
        UNSAFE_getAllByType(TextInput).find(
          (el) => el.props.label === 'Special Handling Instruction'
        ).props.value
      ).toBe('Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
    });
  });

  test('should handle cancel form event', async () => {
    const handleCancelMock = jest.fn();
    const { getByText, UNSAFE_getAllByType } = render(
      <ApolloProvider>
        <InquiryCreationForm
          visible={true}
          handleCancel={handleCancelMock}
          handleSave={jest.fn()}
          account={ACCOUNTS_MOCK[0]}
          accountsList={ACCOUNTS_MOCK}
          call={CALL_MOCK}
          inquiryTypes={INQUIRY_TYPE_MAPPED_DATA}
          inquiryChannels={INQUIRY_CHANNEL_MAPPED_DATA}
        />
      </ApolloProvider>
    );

    await waitFor(() => {
      expect(getByText(/New Inquiry/i)).toBeTruthy();
    });

    act(() => {
      UNSAFE_getAllByType(Button)[0].props.onPress();
    });

    await waitFor(() => {
      expect(handleCancelMock).toHaveBeenCalled();
      expect(getByText(ACCOUNTS_MOCK[0].label)).toBeTruthy();
      expect(
        UNSAFE_getAllByType(Select).find(
          (el) => el.props.label === 'Response Preference'
        ).props.value
      ).toBeNull();
    });
  });

  test('should handle save form event if form is valid', async () => {
    const handleSaveMock = jest.fn();
    const { getByText, UNSAFE_getAllByType } = render(
      <ApolloProvider>
        <InquiryCreationForm
          visible={true}
          handleCancel={jest.fn()}
          handleSave={handleSaveMock}
          account={ACCOUNTS_MOCK[0]}
          accountsList={ACCOUNTS_MOCK}
          call={CALL_MOCK}
          inquiryTypes={INQUIRY_TYPE_MAPPED_DATA}
          inquiryChannels={INQUIRY_CHANNEL_MAPPED_DATA}
        />
      </ApolloProvider>
    );

    await waitFor(() => {
      expect(getByText(/New Inquiry/i)).toBeTruthy();
    });

    act(() => {
      UNSAFE_getAllByType(Select)
        .find((el) => el.props.label === 'Response Preference')
        .props.onChange({
          label: 'Fax',
          value: 'Fax',
        });
    });

    await waitFor(() => {
      expect(getByText(/Cannot be empty/i)).toBeTruthy();
    });

    act(() => {
      UNSAFE_getAllByType(TextInput)
        .find((el) => el.props.label === 'Fax')
        .props.onChangeText('1234567890');
    });

    await waitFor(() => {
      expect(
        UNSAFE_getAllByType(TextInput).find((el) => el.props.label === 'Fax')
          .props.error
      ).toBeNull();
    });

    act(() => {
      UNSAFE_getAllByType(Button)[1].props.onPress();
    });

    await waitFor(() => {
      expect(handleSaveMock).toHaveBeenCalled();
      expect(getByText(ACCOUNTS_MOCK[0].label)).toBeTruthy();
      expect(
        UNSAFE_getAllByType(Select).find(
          (el) => el.props.label === 'Response Preference'
        ).props.value
      ).toBeNull();
    });
  });

  test('should show errors if user try to save, but form is invalid', async () => {
    const handleSaveMock = jest.fn();
    const { getAllByText, getByText, UNSAFE_getAllByType } = render(
      <ApolloProvider>
        <InquiryCreationForm
          visible={true}
          handleCancel={jest.fn()}
          handleSave={handleSaveMock}
          account={null}
          accountsList={ACCOUNTS_MOCK}
          call={CALL_MOCK}
          inquiryTypes={INQUIRY_TYPE_MAPPED_DATA}
          inquiryChannels={INQUIRY_CHANNEL_MAPPED_DATA}
        />
      </ApolloProvider>
    );

    await waitFor(() => {
      expect(getByText(/New Inquiry/i)).toBeTruthy();
    });

    act(() => {
      UNSAFE_getAllByType(Button)[1].props.onPress();
    });

    await waitFor(() => {
      expect(handleSaveMock).not.toHaveBeenCalled();
      expect(getAllByText(/Cannot be empty/i).length).toBe(2);
    });
  });
});
