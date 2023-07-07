import React from 'react';
import { useDispatch } from 'react-redux';
import { render, waitFor } from '@testing-library/react-native';
import { SearchFilter } from './SearchFilter';
import { TRANSACTION_SEARCH_FIELDS } from '../../constants';




jest.mock('oce-apps-bridges', () => ({
    sfNetAPI: {
        enablePromises: jest.fn()
    },
    environment: {
        locale: () => '',
        namespace: () => '',
        territory: () => '',
        userId: () => ''
    },
}));


jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
}));

const dispatch = jest.fn();


describe('SearchFilter', () => {
    beforeEach(() => {
        useDispatch.mockImplementation(() => dispatch);
    });
    it('should select a product from product dropdown', async () => {
        const { getByTestId } = render(<SearchFilter searchOptions={TRANSACTION_SEARCH_FIELDS} />);
        const productSelectContainer = getByTestId('productfilterContainer').children[0];
        await waitFor(() => {
            productSelectContainer.props.onChange([{ label: 'test', value: 'test' }]);
        });
    });
    it('should search for an account in search textbox', async () => {
        const { getByTestId } = render(<SearchFilter searchOptions={TRANSACTION_SEARCH_FIELDS} />);
        const searchContainer = getByTestId('searchContainer').children[0];
        await waitFor(() => {
            searchContainer.props.onSearch('test');
        });
    });
    it('should fetch all the records on clear the search input', async () => {
        const onClear = jest.fn();
        const { getByTestId } = render(<SearchFilter onClear={onClear} searchOptions={TRANSACTION_SEARCH_FIELDS} />);
        const searchContainer = getByTestId('searchContainer').children[0];
        await waitFor(() => {
            searchContainer.props.onIconPress();
        });
    });
});