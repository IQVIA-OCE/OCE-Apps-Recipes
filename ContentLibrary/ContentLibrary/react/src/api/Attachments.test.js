import { databaseManager, sfNetAPI } from '@oce-apps/oce-apps-bridges';
import { getAttachmentsByLinkedEntityId, deleteAttachmentByLinkedEntityId, getAttachmentsFromLocalAsync } from "./Attachments";

describe("Attachments api", () => {
  beforeAll(() => {
    jest.mock('./Attachments', () => ({
        getAttachmentsByLinkedEntityId: jest.fn(),
    }));
  })
  it("should query attachments from sf", () => {
    const spy = jest.spyOn(sfNetAPI, "query").mockImplementation();
    getAttachmentsByLinkedEntityId('123');
    expect(spy).toHaveBeenCalled();
  });

  it("should delete attachment on sf", () => {
    const spy = jest.spyOn(sfNetAPI, "query").mockImplementation();
    deleteAttachmentByLinkedEntityId('123');
    expect(spy).toHaveBeenCalled();
  });

  it("should fetch local attachments", () => {
    const spy = jest.spyOn(databaseManager, "fetch").mockImplementation();
    getAttachmentsFromLocalAsync('123');
    expect(spy).toHaveBeenCalled();
  });
});
