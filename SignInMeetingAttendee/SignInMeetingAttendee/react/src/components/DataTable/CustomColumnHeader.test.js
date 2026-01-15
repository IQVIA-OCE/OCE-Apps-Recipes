import React from 'react';
jest.useFakeTimers();


jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));

const COLUMNS = [
    {
        header: 'Name',
        accessor: 'Name',
        sortFunction: null,
    },
];

describe('Custom Column Header Component', () => {

    it('custom column header should render properly', async () => {
        const CustomColumnHeader = jest.fn();
        COLUMNS[0].header = CustomColumnHeader('Name');
    })
});
