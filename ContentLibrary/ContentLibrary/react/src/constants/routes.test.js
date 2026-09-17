import { ATTACHMENTS_LIST, SEARCH_ATTACHMENTS } from './routes';

test('Constants', () => {
    expect(ATTACHMENTS_LIST).toEqual('AttachmentsList');
    expect(SEARCH_ATTACHMENTS).toEqual('SearchAttachments');
});