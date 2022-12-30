import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import AttachmentsItemPad from './AttachmentsItemPad';

const attachments = [
    {
        item: {
            ContentDocument: {
                Id: '0696g000000eJnbAAE',
                Title: 'OCE-BANNER_IMAGE',
                CreatedDate: '2019-11-27T08:57:19.000Z',
                Description: 'Short description',
                FileExtension: 'png',
                FileType: 'PNG',
                SharingOption: 'A',
                SharingPrivacy: 'N',
                Owner: 'Oce Admin',
            },
            Id: '123'
        }
    },
    {
        item: {
            ContentDocument: {
                Id: '0696g000000eJnbAAE',
                Title: 'OCE-BANNER_IMAGE',
                CreatedDate: '2019-11-27T08:57:19.000Z',
                Description: 'Short description',
                FileExtension: 'pdf',
                FileType: 'PDF',
                SharingOption: 'A',
                SharingPrivacy: 'N',
                Owner: 'Oce Admin',
            },
            Id: '123'
        }
    }
]

test('Render AttachmentItemPad', () => {
    const { getByTestId } = render(<AttachmentsItemPad attachment={attachments[0]} handleDelete={() => null} handleOpen={() => null} />);
    const touchableButton = getByTestId("touchableButton");
    const deleteIcon = getByTestId("deleteIcon");
    const infoIcon = getByTestId("infoIcon");

    fireEvent.press(deleteIcon);
    fireEvent.press(touchableButton);

    expect(touchableButton).toBeTruthy();
    expect(deleteIcon).toBeTruthy();
    expect(infoIcon).toBeTruthy();
});

test('Render AttachmentItemPad with another fileType', () => {
    const { getByTestId } = render(<AttachmentsItemPad attachment={attachments[0]} handleDelete={() => null} handleOpen={() => null} />);
    const touchableButton = getByTestId("touchableButton");
    const deleteIcon = getByTestId("deleteIcon");
    const infoIcon = getByTestId("infoIcon");

    fireEvent.press(deleteIcon);
    fireEvent.press(touchableButton);

    expect(touchableButton).toBeTruthy();
    expect(deleteIcon).toBeTruthy();
    expect(infoIcon).toBeTruthy();
});

