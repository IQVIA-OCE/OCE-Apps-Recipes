import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import AttachmentsList from './AttachmentsList';
import { useSelector, useDispatch } from 'react-redux';
import {
    getAttachmentsByLinkedEntityId, getAttachmentsFromLocalAsync
} from "../../api/Attachments";
import { normalizeAttachmentsByOrders } from "../../utils/utils";
import { NO_CONNECTION } from '../../constants/constants';
import { NoConnectionView } from '../../components';

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
    useDispatch: jest.fn(),
}));

jest.mock('../../api/Attachments', () => ({
    getAttachmentsByLinkedEntityId: jest.fn(),
    getAttachmentsFromLocalAsync: jest.fn(),
    deleteAttachmentByLinkedEntityId: jest.fn()
}));

jest.mock('../../utils/utils', () => ({
    normalizeAttachmentsByOrders: jest.fn(),
}));

describe('Test AttachmentsHeader', () => {
    afterAll(() => {
        jest.restoreAllMocks();
    });
    beforeAll(() => {
        useDispatch.mockReturnValue(jest.fn());
        normalizeAttachmentsByOrders.mockResolvedValue([
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
        ]);
        getAttachmentsByLinkedEntityId.mockResolvedValue({
            records: [
                {
                    ContentDocument: {
                        "ContentModifiedDate": "2021-05-05T14:39:53.000+0000",
                        "Description": null,
                        "FileExtension": "pdf",
                        "FileType": "PDF",
                        "Id": "069040000001jsrAAA",
                        "Owner": {
                            "Name": "OCE Admin Avenga",
                        },
                        "Title": "export/export",
                    },
                    Id: '123'
                }
            ]
        });
        getAttachmentsFromLocalAsync.mockResolvedValue({
            records: [
                {
                    Id: "123",
                    LinkedEntityId: "a3c04000000GseFAAS",
                    uid: "06A04000001BHuPEAW"
                }
            ]
        })
    });


    test('Test AttachmentsList render', () => {
        useSelector.mockImplementation((cb) => cb({
            attachmentsListReducers: {
                attachmentsList,
                recordId: '123',
                error: false,
                loading: false
            }
        }));
        const { getByTestId } = render(<AttachmentsList />);
        const touchableButton = getByTestId('touchableButton');
        const deleteIcon = getByTestId('deleteIcon');
        fireEvent.press(deleteIcon);
        fireEvent.press(touchableButton);

        expect(touchableButton).toBeTruthy();
    });

    test('Test AttachmentsList render isPad', () => {
        jest.mock('react-native/Libraries/Utilities/Platform', () => ({
            isPad: true,
        }));
        const { getByTestId } = render(<AttachmentsList />);
        const touchableButton = getByTestId('touchableButton');
        expect(touchableButton).toBeTruthy();
    });

    test('Test AttachmentsList render loading', () => {
        useSelector.mockImplementation((cb) => cb({
            attachmentsListReducers: {
                attachmentsList,
                recordId: '123',
                error: false,
                loading: true
            }
        }));
        const { getByTestId } = render(<AttachmentsList />);
        const loadingView = getByTestId('loading-view');
        expect(loadingView).toBeTruthy();
    });

    test('Test AttachmentsList render error', () => {
        useSelector.mockImplementation((cb) => cb({
            attachmentsListReducers: {
                attachmentsList,
                recordId: '123',
                error: true,
                loading: false
            }
        }));
        const { getByTestId } = render(<AttachmentsList />);
        const errorView = getByTestId('error-view');
        expect(errorView).toBeTruthy();
    });

    test('Test AttachmentsList render no internet connection view', () => {
        useSelector.mockImplementation((cb) => cb({
            attachmentsListReducers: {
                attachmentsList,
                recordId: '123',
                error: false,
                loading: false,
                connectionStatus: {
                    currentStatus: NO_CONNECTION
                }
            }
        }));
        const { getByTestId } = render(<AttachmentsList />);
        const noConnectionView = getByTestId('no-connection-view');
        expect(noConnectionView).toBeTruthy();
    });

    test('Test AttachmentsList render empty list ', () => {
        useSelector.mockImplementation((cb) => cb({
            attachmentsListReducers: {
                attachmentsList: [],
                recordId: '123',
                error: false,
                loading: false
            }
        }));
        const { getByTestId } = render(<AttachmentsList />);
        const emptyView = getByTestId('emptyView');
        expect(emptyView).toBeTruthy();
    });

});


