

import React from 'react';
import { fireEvent, render } from "@testing-library/react-native";
import { Banner } from 'apollo-react-native';
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
        const { container } = render(<Error/>);
        expect(container.findAllByType(Banner)).toBeTruthy();
    });
});