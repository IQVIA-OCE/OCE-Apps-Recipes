import api from "../utils/api";
import { databaseManager } from '../../bridge/Database/DatabaseManager.native';

const getAttachmentsByLinkedEntityId = (recordId) => {
    return api.query(`SELECT Id, ContentDocument.Id, ContentDocument.Owner.Name, ContentDocument.ContentModifiedDate, ContentDocument.Description, ContentDocument.Title,\
    ContentDocument.FileExtension, ContentDocument.FileType, ContentDocument.LatestPublishedVersion.PathOnClient\
    FROM ContentDocumentLink WHERE LinkedEntityId = '${recordId}'`);
}

const deleteAttachmentByLinkedEntityId = (contentDocumentLinkId) => {
    return api.del('ContentDocumentLink', contentDocumentLinkId);
}

const getAttachmentsFromLocalAsync = (recordId) => {
    return databaseManager.fetch(
        `SELECT Id, LinkedEntityId FROM ContentDocumentLink WHERE LinkedEntityId = '${recordId}'`
    );
}

export { getAttachmentsByLinkedEntityId, deleteAttachmentByLinkedEntityId, getAttachmentsFromLocalAsync };