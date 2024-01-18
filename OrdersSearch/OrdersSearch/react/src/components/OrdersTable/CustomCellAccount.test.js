import { render, fireEvent } from '@testing-library/react-native';
import React from 'react';
import CustomCellAccount from './CustomCellAccount';
import * as constants from "../../utils/constants";
import { useSelector } from "react-redux";
import { navigator } from 'oce-apps-bridges';

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));

jest.mock('oce-apps-bridges', () => ({
    navigator: {
      navigate: jest.fn(),
    },
    environment: {
        namespace: () => 'OCE__',
    },
}));

describe('CustomCellAccount', () => {
    it('should render CustomCellAccount on Home page', () => {
        useSelector.mockImplementation((cb) => cb({
            orders: {
                pageType: constants.PAGE_TYPE.HOME
            }
        }));
        let { getByTestId } = render(<CustomCellAccount title="test title" id="test id"/>);
        expect(getByTestId('touchableCell')).toBeTruthy();
    });

    it('should render CustomCellAccount on Home page with empty title', () => {
        useSelector.mockImplementation((cb) => cb({
            orders: {
                pageType: constants.PAGE_TYPE.HOME
            }
        }));
        let { getByTestId } = render(<CustomCellAccount id="test id"/>);
        expect(getByTestId('touchableCell')).toBeTruthy();
    });

    it('should success onPress Touchable on Home page', () => {
        useSelector.mockImplementation((cb) => cb({
            orders: {
                pageType: constants.PAGE_TYPE.HOME
            }
        }));
        let { getByTestId } = render(<CustomCellAccount title="test title" id="test id"/>);
        expect(getByTestId('touchableCell')).toBeTruthy();
        const touchable = getByTestId('touchableCell');
        fireEvent(touchable, 'press');
        expect(navigator.navigate).toHaveBeenCalledTimes(1);
    });

    it('should fail onPress Touchable on Home page', () => {
        useSelector.mockImplementation((cb) => cb({
            orders: {
                pageType: constants.PAGE_TYPE.HOME
            }
        }));
        navigator.navigate.mockRejectedValue('error')
        let { getByTestId } = render(<CustomCellAccount title="test title" id="test id"/>);
        expect(getByTestId('touchableCell')).toBeTruthy();
        const touchable = getByTestId('touchableCell');
        fireEvent(touchable, 'press');
        expect(navigator.navigate).rejects.toMatch('error');
    });

    it('should render CustomCellAccount on Account page', () => {
        useSelector.mockImplementation((cb) => cb({
            orders: {
                pageType: constants.PAGE_TYPE.ACCOUNT
            }
        }));
        let { getByTestId } = render(<CustomCellAccount title="test title" id="test id"/>);
        expect(getByTestId('textCell')).toBeTruthy();
    });
});