import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import AttachmentsHeader from './AttachmentsHeader';
import { useSelector } from 'react-redux';

const attachmentsList = [
    {
        ContentDocument: {
            ContentModifiedDate: '2021-05-05T14:39:53.000+0000',
            Description: null,
            FileExtension: 'pdf',
            FileType: 'PDF',
            Id: '069040000001jsrAAA',
            Owner: { Name: 'OCE Admin Avenga' },
            Title: 'export/export',
            synced: {
                Id: "123",
                LinkedEntityId: "a3c04000000GseFAAS",
                uid: "06A04000001BHuPEAW"
            }
        },
        Id: '123'
    }
];

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
}));

jest.mock('react-navigation', () => ({
    withNavigation: Component => props => (
        <Component navigation={{ navigate: jest.fn() }} {...props} />
    ),
    SafeAreaView: ({ children }) => <>{children}</>,
}));


describe('Test AttachmentsHeader', () => {
    useSelector.mockImplementation((cb) => cb({
        attachmentsListReducers: {
            attachmentsList
        }
    }));
    afterAll(() => {
        jest.restoreAllMocks();
    });

    test('Test AttachmentsHeader render', () => {
        const { getByTestId } = render(<AttachmentsHeader />);
        const navigateToSearchButton = getByTestId("navigateToSearchButton");
        const headerContainer = getByTestId("headerContainer");
        fireEvent.press(navigateToSearchButton);
        expect(headerContainer).toBeTruthy();
    });
});


