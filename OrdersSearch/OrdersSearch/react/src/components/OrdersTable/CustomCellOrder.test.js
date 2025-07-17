import { render, fireEvent } from '@testing-library/react-native';
import React from 'react';
import CustomCellOrder from './CustomCellOrder';
import * as constants from "../../utils/constants";
import { useSelector, useDispatch } from "react-redux";
import { navigator } from '@oce-apps/oce-apps-bridges';

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));

jest.mock('@oce-apps/oce-apps-bridges', () => ({
    navigator: {
      navigate: jest.fn(),
    },
    environment: {
        namespace: () => 'OCE__',
    },
}));

const dispatch = jest.fn();

describe('CustomCellOrder', () => {
    it('should render CustomCellOrder on Home page', () => {
        useSelector.mockImplementation((cb) => cb({
            orders: {
                pageType: constants.PAGE_TYPE.HOME
            }
        }));
        let { getByTestId } = render(<CustomCellOrder title="test title" id="test id"/>);
        expect(getByTestId('touchableCell')).toBeTruthy();
    });

    it('should render CustomCellOrder on Home page', () => {
        useSelector.mockImplementation((cb) => cb({
            orders: {
                pageType: constants.PAGE_TYPE.ACCOUNT
            }
        }));
        let { getByTestId } = render(<CustomCellOrder title="" id="test id"/>);
        expect(getByTestId('touchableCell')).toBeTruthy();
    });

    it('should success onPress Touchable on Home page', () => {
        useSelector.mockImplementation((cb) => cb({
            orders: {
                pageType: constants.PAGE_TYPE.HOME
            }
        }));
        let { getByTestId } = render(<CustomCellOrder id="test id"/>);
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
        useDispatch.mockImplementation(() => dispatch);
        navigator.navigate.mockRejectedValue('error')
        let { getByTestId } = render(<CustomCellOrder title="test title" id="test id"/>);
        expect(getByTestId('touchableCell')).toBeTruthy();
        const touchable = getByTestId('touchableCell');
        fireEvent(touchable, 'press');
        expect(navigator.navigate).rejects.toMatch('error');
    });

    it('should render CustomCellOrder on Order page', () => {
        useSelector.mockImplementation((cb) => cb({
            orders: {
                pageType: constants.PAGE_TYPE.ORDER
            }
        }));
        let { getByTestId } = render(<CustomCellOrder title="test title" id="test id"/>);
        expect(getByTestId('textCell')).toBeTruthy();
    });
});
