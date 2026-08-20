import { normalizeAttachmentsByOrders, normalizeSearchAttachmentOwnedByMe, normalizeSearchAttachmentSharedWithMe } from './utils';

const response = [
    [
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
];

const localAttachments = [
    {
        Id: "123",
        LinkedEntityId: "a3c04000000GseFAAS",
        uid: "06A04000001BHuPEAW"
    },
];

const normalizedResponse = [
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

const normalizedResponseWithNoSync = [
    {
        ContentDocument: {
            ContentModifiedDate: '2021-05-05T14:39:53.000+0000',
            Description: null,
            FileExtension: 'pdf',
            FileType: 'PDF',
            Id: '069040000001jsrAAA',
            Owner: { Name: 'OCE Admin Avenga' },
            Title: 'export/export',
            synced: undefined
        },
        Id: '123'
    }
];

const searchAttachmentOwnedByMeResponse = [
    [
        {
            "FileType": "PDF",
            "Id": "069040000001jsrAAA",
            "Title": "export/export",
        }
    ]
];

const normalizedSearchAttachmentOwnedByMe = [
    {
        "FileType": "PDF",
        "Id": "069040000001jsrAAA",
        "Title": "export/export",
        "Added": true
    }
];

const searchAttachmentsSharedWithMeRepsonse = [
    [
        {
            ContentDocument: {
                "FileType": "PDF",
                "Id": "069040000001jsrAAA",
                "Title": "export/export",
            }
        }
    ]
];

const normalizedSearchAttachmentSharedWithMe = [
    {
        "FileExtension": "PDF",
        "Id": "069040000001jsrAAA",
        "Title": "export/export",
        "Added": true
    }
];

test('Test normalizeAttachmentsByOrders', () => {
    const data = normalizeAttachmentsByOrders(response, localAttachments);
    expect(data).toEqual(normalizedResponse);
});

test('Test normalizeAttachmentsByOrders with no local', () => {
    const data = normalizeAttachmentsByOrders(response);
    expect(data).toEqual(normalizedResponseWithNoSync);
});

test('Test normalizeSearchAttachmentOwnedByMe', () => {
    const data = normalizeSearchAttachmentOwnedByMe(searchAttachmentOwnedByMeResponse, normalizedResponse);
    expect(data).toEqual(normalizedSearchAttachmentOwnedByMe);
});

test('Test normalizeSearchAttachmentSharedWithMe', () => {
    const data = normalizeSearchAttachmentSharedWithMe(searchAttachmentsSharedWithMeRepsonse, normalizedResponse);
    expect(data).toEqual(normalizedSearchAttachmentSharedWithMe);
});


