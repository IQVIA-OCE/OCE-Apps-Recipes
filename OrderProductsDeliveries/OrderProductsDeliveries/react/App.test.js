import React from 'react';
import App from './App';
import { render } from '@testing-library/react-native';
import { layoutBridge } from 'oce-apps-bridges';

jest.mock('oce-apps-bridges', () => ({
    sfNetAPI: {
        enablePromises: jest.fn()
    },
    environment: {
        namespace: () => 'OCE__',
        sfApiVersion: () => '1',
        userID: () => '1',
        territory: () => 'Atlanta',
    },
    layoutBridge: {
        setHeight: jest.fn()
    },
    localized: jest.fn()
}))

describe('Application', () => {
    beforeAll(() => {
        jest.useFakeTimers();
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    const layout = layoutBridge.setHeight;
    it('should render properly', () => {
        render(<App />);
        expect(layout).not.toHaveBeenCalled();
    })
    it('should render properly', () => {
        render(<App instanceId='001' />);
        const layout = layoutBridge.setHeight;
        expect(layout).toHaveBeenCalledWith(600);
    })
});
