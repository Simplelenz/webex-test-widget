export class Attachment {
  index: number;
  url: string;
  fileName: string;

  constructor(index, url, fileName) {
    this.index = index;
    this.url = url;
    this.fileName = fileName;
  }
}
