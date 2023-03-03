import Root from "./App";
import { render } from '@testing-library/react-native';
import React from 'react';
import Error from "./src/components/Error";
import Header from "./src/components/Header/Header";
import { OrdersTable } from "./src/components/OrdersTable/OrdersTable";
import { useDispatch } from "react-redux";
import * as utils from "./src/utils";
import { PAGE_TYPE } from "./src/utils/constants";
import * as ordersApi from "./src/api/ordersApi";

jest.mock('oce-apps-bridges', () => ({
    sfNetAPI: {
      describe: jest.fn(),
      metadata: jest.fn(),
      enablePromises: jest.fn()
    },
    environment: {
        namespace: () => 'OCE__',
    },
    databaseManager: {
        fetch: jest.fn()
    },
    localized: jest.fn()
}));

jest.mock('react-redux', () => {
    return {
      ...jest.requireActual('react-redux'),
      useDispatch: jest.fn(),
    };
  });

const dispatch = jest.fn();

describe('App', () => {
    it('should render App with orderId', () => {
        utils.definePageType = jest.fn().mockResolvedValueOnce(PAGE_TYPE.ORDER)
        ordersApi.fetchAccountIdByOrderId = jest.fn().mockResolvedValueOnce({
            records: [{
                [`OCE__Account__c`]: 'testid'
            }]
        })
        useDispatch.mockImplementation(() => dispatch);
        let { container } = render(<Root recordId={'123'}/>);
        expect(container.findAllByType(Error)[0]).toBeTruthy();
        expect(container.findAllByType(Header)[0]).toBeTruthy();
        expect(container.findAllByType(OrdersTable)[0]).toBeTruthy();
    });
    it('should render App with accountId', () => {
        utils.definePageType = jest.fn().mockResolvedValueOnce(PAGE_TYPE.ACCOUNT)
        ordersApi.fetchAccountIdByOrderId = jest.fn().mockResolvedValueOnce({
            records: [{
                [`OCE__Account__c`]: 'testid'
            }]
        })
        useDispatch.mockImplementation(() => dispatch);
        let { container } = render(<Root recordId={'123'}/>);
        expect(container.findAllByType(Error)[0]).toBeTruthy();
        expect(container.findAllByType(Header)[0]).toBeTruthy();
        expect(container.findAllByType(OrdersTable)[0]).toBeTruthy();
    });
    it('should render App with accountId with Error', () => {
        utils.definePageType = jest.fn().mockRejectedValue()
        ordersApi.fetchAccountIdByOrderId = jest.fn().mockRejectedValue()
        useDispatch.mockImplementation(() => dispatch);
        let { container } = render(<Root recordId={'123'}/>);
        expect(container.findAllByType(Error)[0]).toBeTruthy();
        expect(container.findAllByType(Header)[0]).toBeTruthy();
        expect(container.findAllByType(OrdersTable)[0]).toBeTruthy();
    });
});