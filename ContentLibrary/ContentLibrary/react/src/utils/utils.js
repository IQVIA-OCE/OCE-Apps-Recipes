
const normalizeAttachmentsByOrders = (response, localAttachments = []) => {
    const data = [];
    response.map(item => {
        if (!item.done) {
            item.map(element => {
                data.push({
                    ContentDocument: {
                        ...element.ContentDocument,
                        synced: localAttachments.find(el => el.Id === element.Id)
                    },
                    Id: element.Id,
                });
            });
        }
    })
    return data;
};

const normalizeSearchAttachmentOwnedByMe = (response, attachmentsList) => {
    return response[0].map(item => ({
        ...item,
        Added: attachmentsList.some(el => el.ContentDocument.Id === item.Id),
    }));
}

const normalizeSearchAttachmentSharedWithMe = (response, attachmentsList) => {
    return response[0].map(item => {
        return {
            FileExtension: item.ContentDocument.FileType,
            Id: item.ContentDocument.Id,
            Title: item.ContentDocument.Title,
            Added: attachmentsList.some(el => el.ContentDocument.Id === item.ContentDocument.Id)
        }
    });
}

export { normalizeAttachmentsByOrders, normalizeSearchAttachmentOwnedByMe, normalizeSearchAttachmentSharedWithMe };