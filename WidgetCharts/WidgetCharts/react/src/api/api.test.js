import { sfNetAPI } from 'oce-apps-bridges';
import { fetchMarketData, fetchMarkets, fetchCall } from './api';

jest.mock('oce-apps-bridges', () => {
    const originalModule = jest.requireActual('oce-apps-bridges');
    return {
        ...originalModule,
        sfNetAPI: {
            ...originalModule.sfNetAPI,
            enablePromises: jest.fn(),
        }
    }
});

describe('Widget Charts api', () => {
    beforeAll(() => {
        sfNetAPI.enablePromises = jest.fn();
    });

    it('fetchMarkets', () => {
        const spy = jest.spyOn(sfNetAPI, 'query').mockImplementation();
        fetchMarkets();
        expect(spy).toHaveBeenCalled();
    });

    it('fetchMarketData', () => {
        const spy = jest.spyOn(sfNetAPI, 'query').mockImplementation();
        fetchMarketData();
        expect(spy).toHaveBeenCalled();
    });

    it('fetchCall', () => {
        const spy = jest.spyOn(sfNetAPI, 'query').mockImplementation();
        fetchCall();
        expect(spy).toHaveBeenCalled();
    });
});
