import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import SearchAttachmentsHeader from './SearchAttachmentsHeader';
import { useSelector, useDispatch } from 'react-redux';
import { OWNED_BY_ME } from '../../constants/constants';
import { isTablet } from '../../helpers';

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

const mockDimensions = ({ width, height }) => {
  jest.resetModules()
  jest.doMock('react-native/Libraries/Utilities/Dimensions', () => ({
    get: jest.fn().mockReturnValue({ width, height })
  }))
}

describe('Test SearchAttachmentsHeader', () => {
    useSelector.mockImplementation((cb) => cb({
        searchAttachmentsReducers: {
            searchText: "",
            ownershipFilter: OWNED_BY_ME
        }
    }));
    afterAll(() => {
        jest.restoreAllMocks();
    });

    test('Test SearchAttachmentsHeader render', () => {
        useDispatch.mockReturnValue(jest.fn());
        mockDimensions({ width: 300, height: 200 });
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


