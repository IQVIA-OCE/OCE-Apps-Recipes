import { sfNetAPI } from '@oce-apps/oce-apps-bridges';
import { getAttachmentsForSearchOwnedByMe, getAttachmentForSearchSharedWithMe, addAttachmentAsync } from "./SearchAttachments";

describe("Attachments api", () => {
    beforeAll(() => {
        jest.mock('./Attachments', () => ({
            getAttachmentsForSearchOwnedByMe: jest.fn(),
            getAttachmentForSearchSharedWithMe: jest.fn(),
            addAttachmentAsync: jest.fn(),
        }));
    })
    it("should query search attachments owned by me from sf", () => {
        const spy = jest.spyOn(sfNetAPI, "query").mockImplementation();
        getAttachmentsForSearchOwnedByMe('123');
        expect(spy).toHaveBeenCalled();
    });
    it("should query search attachments owned by me from sf with title filter", () => {
        const spy = jest.spyOn(sfNetAPI, "query").mockImplementation();
        getAttachmentsForSearchOwnedByMe('123', 'test');
        expect(spy).toHaveBeenCalled();
    });
    it("should query search attachments shared with me from sf", () => {
        const spy = jest.spyOn(sfNetAPI, "query").mockImplementation();
        getAttachmentForSearchSharedWithMe('123');
        expect(spy).toHaveBeenCalled();
    });
    it("should query search attachments shared with me from sf with title filter", () => {
        const spy = jest.spyOn(sfNetAPI, "query").mockImplementation();
        getAttachmentForSearchSharedWithMe('123', 'test');
        expect(spy).toHaveBeenCalled();
    });
    it("should add attachment to sf", () => {
        const spy = jest.spyOn(sfNetAPI, "create").mockImplementation();
        addAttachmentAsync('123', '987');
        expect(spy).toHaveBeenCalled();
    });
});
