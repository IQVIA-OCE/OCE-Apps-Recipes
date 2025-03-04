

import React from 'react';
import { fireEvent, render } from "@testing-library/react-native";
import { Banner } from '@oce-apps/apollo-react-native';
import Error from './Error';
import { useSelector } from 'react-redux';

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));
describe('Error component', () => {
    it('should render Error', () => {
        useSelector.mockImplementation((cb) => cb({
                filters: {
                    error: 'error'
                },
                orders: {
                    error: 'error'
                }
            })
        );
        const { UNSAFE_getByType } = render(<Error/>);
        expect(UNSAFE_getByType(Banner)).toBeTruthy();
    });
});
