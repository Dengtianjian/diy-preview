import ApiModule from "..";

class AttachmentApi extends ApiModule {
  public prefix = "attachment";
  deleteAttachment(fileId: string) {
    return this.delete("", {
      fileId: escape(fileId)
    });
  }
}

export default new AttachmentApi();