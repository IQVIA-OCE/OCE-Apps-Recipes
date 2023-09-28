import { act, render, waitFor } from '@testing-library/react-native';
import {
  Autocomplete,
  Button,
  Provider as ApolloProvider,
} from 'apollo-react-native';
import React from 'react';
import * as utilsCommon from '../utils/common';
import { ModalSelector } from './ModalSelector';

const ITEMS_MOCK = [
  {
    label: 'John Dou',
    value: '111',
  },
  {
    label: 'Mari Smith',
    value: '222',
  },
];

describe('ModalSelector', () => {
  test('should render properly', async () => {
    utilsCommon.isWeb = false;
    const { getByText, UNSAFE_getByType } = render(
      <ApolloProvider>
        <ModalSelector
          title="Test title"
          placeholder="Test autocomplete placeholder"
          visible={true}
          handleCancel={jest.fn()}
          handleNext={jest.fn()}
          items={ITEMS_MOCK}
        />
      </ApolloProvider>
    );

    await waitFor(() => {
      expect(getByText(/Test title/i)).toBeTruthy();
      expect(UNSAFE_getByType(Autocomplete).props.placeholder).toEqual(
        'Test autocomplete placeholder'
      );
    });
  });

  test('should render properly for WEB', async () => {
    utilsCommon.isWeb = true;
    const { getByText, UNSAFE_getByType } = render(
      <ApolloProvider>
        <ModalSelector
          title="Test title"
          placeholder="Test autocomplete placeholder"
          visible={true}
          handleCancel={jest.fn()}
          handleNext={jest.fn()}
          items={ITEMS_MOCK}
        />
      </ApolloProvider>
    );

    await waitFor(() => {
      expect(getByText(/Test title/i)).toBeTruthy();
      expect(UNSAFE_getByType(Autocomplete).props.placeholder).toEqual(
        'Test autocomplete placeholder'
      );
    });
  });

  test('should render empty placeholder in Autocomplete if user select item', async () => {
    const { getByText, UNSAFE_getByType } = render(
      <ApolloProvider>
        <ModalSelector
          title="Test title"
          placeholder="Test autocomplete placeholder"
          visible={true}
          handleCancel={jest.fn()}
          handleNext={jest.fn()}
          items={ITEMS_MOCK}
        />
      </ApolloProvider>
    );

    await waitFor(() => {
      expect(getByText(/Test title/i)).toBeTruthy();
      expect(UNSAFE_getByType(Autocomplete).props.placeholder).toEqual(
        'Test autocomplete placeholder'
      );
    });

    act(() => {
      UNSAFE_getByType(Autocomplete).props.onChange(ITEMS_MOCK[0]);
    });

    await waitFor(() => {
      expect(UNSAFE_getByType(Autocomplete).props.placeholder).toEqual('');
    });
  });

  test('should call handleCancel and handleNext function props if user press appropriate buttons', async () => {
    const handleCancelMock = jest.fn();
    const handleNextMock = jest.fn();
    const { getByText, UNSAFE_getAllByType } = render(
      <ApolloProvider>
        <ModalSelector
          title="Test title"
          placeholder="Test autocomplete placeholder"
          visible={true}
          handleCancel={handleCancelMock}
          handleNext={handleNextMock}
          items={ITEMS_MOCK}
        />
      </ApolloProvider>
    );

    await waitFor(() => {
      expect(getByText(/Test title/i)).toBeTruthy();
    });

    act(() => {
      UNSAFE_getAllByType(Button)[0].props.onPress();
    });

    await waitFor(() => {
      expect(handleCancelMock).toHaveBeenCalled();
    });

    act(() => {
      UNSAFE_getAllByType(Button)[1].props.onPress();
    });

    await waitFor(() => {
      expect(handleNextMock).toHaveBeenCalled();
    });
  });
});
