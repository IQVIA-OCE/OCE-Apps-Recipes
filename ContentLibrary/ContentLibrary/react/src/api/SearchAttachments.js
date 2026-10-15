
import api from "../utils/api";

const getAttachmentsForSearchOwnedByMe = (OwnerId, title = '') => {
    return api.query(`SELECT Id, Filetype, Title FROM ContentDocument WHERE Title LIKE '%${title}%' AND OwnerId = '${OwnerId}'`);
};

const getAttachmentForSearchSharedWithMe = (userID, title = '') => {
    return api.query(`SELECT Id, ContentDocument.Id, ContentDocument.Title, ContentDocument.Filetype FROM ContentDocumentLink WHERE LinkedEntityId = '${userID}' AND  ContentDocument.OwnerId != '${userID}' AND ContentDocument.Title LIKE '%${title}%'`);
}

const addAttachmentAsync = (documentId, linkedId) => {
    return api.create('ContentDocumentLink', { ContentDocumentId: documentId, LinkedEntityId: linkedId });
}

export { getAttachmentsForSearchOwnedByMe, getAttachmentForSearchSharedWithMe, addAttachmentAsync };