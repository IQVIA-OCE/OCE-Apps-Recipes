import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import SearchAttachments from './SearchAttachments';
import { useSelector, useDispatch } from 'react-redux';
import {
    getAttachmentsForSearchOwnedByMe,
    getAttachmentForSearchSharedWithMe,
} from "../../api/SearchAttachments";
import {
    normalizeAttachmentsByOrders,
} from "../../utils/utils";
import { NO_CONNECTION, OWNED_BY_ME, SHARED_WITH_ME } from '../../constants/constants';
import { FlatList } from 'react-native';
import { getAttachmentsByLinkedEntityId } from '../../api/Attachments';

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

const mockSearchAttachments = [
    {
        FileExtension: 'png',
        Id: '123',
        Title: 'Title',
        Added: true
    },
    {
        FileExtension: 'png',
        Id: '987',
        Title: 'Picture',
        Added: false
    }
]

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
}));

jest.mock('../../api/SearchAttachments', () => ({
    getAttachmentsForSearchOwnedByMe: jest.fn(),
    getAttachmentForSearchSharedWithMe: jest.fn(),
    addAttachmentAsync: jest.fn()
}));

jest.mock('../../api/Attachments', () => ({
    getAttachmentsByLinkedEntityId: jest.fn()
}));

jest.mock('../../utils/utils', () => ({
    normalizeAttachmentsByOrders: jest.fn(),
    normalizeSearchAttachmentOwnedByMe: jest.fn(),
    normalizeSearchAttachmentSharedWithMe: jest.fn()
}));

describe('Test SearchAttachments', () => {
    afterAll(() => {
        jest.restoreAllMocks();
    });
    beforeAll(() => {
        const records = {
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
        }
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
        getAttachmentsByLinkedEntityId.mockResolvedValue(records);
        getAttachmentsForSearchOwnedByMe.mockResolvedValue(records);
        getAttachmentForSearchSharedWithMe.mockResolvedValue(records);
    });

    const initMockStore = (searchAttachmentsReducers = {}, attachmentsListReducers = {}) => {
        useSelector.mockImplementation((cb) => cb({
            searchAttachmentsReducers: {
                searchAttachmentsListOwnedByMe: mockSearchAttachments,
                searchAttachmentsListSharedWithMe: mockSearchAttachments,
                loading: false,
                error: false,
                ownershipFilter: OWNED_BY_ME,
                searchText: '',
                ...searchAttachmentsReducers
            },
            attachmentsListReducers: {
                attachmentsList,
                recordId: '123',
                connectionStatus: null,
                localAttachmentsList: [attachmentsList[0].ContentDocument.synced],
                ...attachmentsListReducers
            }
        }));
    }


    test('Test SearchAttachments render with ownership filter ownerByMe', () => {
        initMockStore();
        const componentTree = render(<SearchAttachments />);
        expect(componentTree.UNSAFE_getAllByType(FlatList).length).toBe(1);
    });
    test('Test SearchAttachments render with ownership filter sharedWithMe', () => {
        initMockStore({ ownershipFilter: SHARED_WITH_ME });
        const { getByTestId } = render(<SearchAttachments />);
        const addAttachment = getByTestId('addAttachment');
        expect(addAttachment).toBeTruthy();
        fireEvent.press(addAttachment);
    });

    test('Test SearchAttachments render loading', () => {
        jest.useFakeTimers();
        initMockStore({ loading: true });
        const { getByTestId } = render(<SearchAttachments />);
        const loadingView = getByTestId('loading-view');
        expect(loadingView).toBeTruthy();
        jest.useRealTimers();
    });

    test('Test SearchAttachments render error', () => {
        initMockStore({ error: true });
        const { getByTestId } = render(<SearchAttachments />);
        const errorView = getByTestId('error-view');
        expect(errorView).toBeTruthy();
    });

    test('Test SearchAttachments render no internet connection view', () => {
        initMockStore({}, {
            connectionStatus: {
                currentStatus: NO_CONNECTION
            }
        });
        const { getByTestId } = render(<SearchAttachments />);
        const noConnectionView = getByTestId('no-connection-view');
        expect(noConnectionView).toBeTruthy();
    });

    test('Test AttachmentsHeader render empty list ', () => {
        initMockStore({ searchAttachmentsListOwnedByMe: [] });
        const { getByTestId } = render(<SearchAttachments />);
        const emptyView = getByTestId('emptyView');
        expect(emptyView).toBeTruthy();
    });

});


