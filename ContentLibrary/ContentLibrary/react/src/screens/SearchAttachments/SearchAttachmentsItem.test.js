import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import SearchAttachmentItem from './SearchAttachmentsItem';

const data = [
    {
        item: {
            FileType: 'PNG',
            Id: '123',
            Title: 'Title',
            Added: true
        }
    },
    {
        item: {
            FileType: 'PDF',
            Id: '987',
            Title: 'Picture',
            Added: false
        }
    }
]

test('Render SearchAttachmentItem Added', () => {
    const { getByTestId } = render(<SearchAttachmentItem attachment={data[0]} addAttachment={() => null} />);
    const checkIcon = getByTestId("checkIcon");
    const fileIcon = getByTestId("fileIcon");
    const fileTitle = getByTestId("fileTitle");

    expect(checkIcon).toBeTruthy();
    expect(fileIcon).toBeTruthy();
    expect(fileTitle).toBeTruthy();
});

test('Render SearchAttachmentItem Not Added', () => {
    const { getByTestId } = render(<SearchAttachmentItem attachment={data[1]} addAttachment={() => null} />);
    const addAttachment = getByTestId("addAttachment");
    const fileIcon = getByTestId("fileIcon");
    const fileTitle = getByTestId("fileTitle");
    fireEvent.press(addAttachment);

    expect(addAttachment).toBeTruthy();
    expect(fileIcon).toBeTruthy();
    expect(fileTitle).toBeTruthy();
});

