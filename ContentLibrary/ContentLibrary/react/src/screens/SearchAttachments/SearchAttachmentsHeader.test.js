import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import SearchAttachmentsHeader from './SearchAttachmentsHeader';
import { useSelector, useDispatch } from 'react-redux';
import { OWNED_BY_ME } from '../../constants/constants';
import { Dimensions } from 'react-native';

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));

jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native");
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    }),
  };
});

describe('Test SearchAttachmentsHeader', () => {
    useSelector.mockImplementation((cb) => cb({
        searchAttachmentsReducers: {
            searchText: "",
            ownershipFilter: OWNED_BY_ME
        }
    }));

    afterEach(() => {
      jest.restoreAllMocks();
    });

    test('Test SearchAttachmentsHeader render', () => {
      jest.spyOn(Dimensions, 'get').mockReturnValue({ width: 300, height: 200 });
      useDispatch.mockImplementation(() => jest.fn());

      const { getByTestId } = render(<SearchAttachmentsHeader/>);
      const headerBackButton = getByTestId("headerBackButton");
      const openSearchButton = getByTestId("openSearchButton");
      fireEvent.press(openSearchButton);
      const seatchInput = getByTestId("seatchInput");
      fireEvent.changeText(seatchInput, { target: { value: 'test' }});
      expect(headerBackButton).toBeTruthy();
      fireEvent.press(headerBackButton);
    });

    test('Test SearchAttachmentsHeader render isPad', () => {
      const { getByTestId } = render(<SearchAttachmentsHeader/>);
      const headerBackButton = getByTestId("headerBackButton");
      fireEvent.press(headerBackButton);

      expect(headerBackButton).toBeTruthy();
    });

    test('Test SearchAttachmentsHeader render with search text', () => {
      useDispatch.mockImplementation(() => jest.fn());
      useSelector.mockImplementation((cb) => cb({
          searchAttachmentsReducers: {
              searchText: "test",
              ownershipFilter: OWNED_BY_ME
          }
      }));

      const { getByTestId } = render(<SearchAttachmentsHeader/>);
      const headerBackButton = getByTestId("headerBackButton");
      const clearButton = getByTestId("clearButton");

      fireEvent.press(clearButton);
      expect(clearButton).toBeTruthy();
      expect(headerBackButton).toBeTruthy();
    });
});


