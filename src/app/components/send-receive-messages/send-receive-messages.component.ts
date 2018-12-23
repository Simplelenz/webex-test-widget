import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Constant} from '../../configurations/StringConstants';

@Component({
  selector: 'app-send-receive-messages',
  templateUrl: './send-receive-messages.component.html',
  styleUrls: ['./send-receive-messages.component.css']
})
export class SendReceiveMessagesComponent implements OnInit {

  @Input() me = false;
  @Input() message = '';
  @Input() name = '';
  @Input() time = '';
  @Input() object: any;

  @Output() clickAttachmentButton: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit() {
  }

  clickAttachment() {
    this.clickAttachmentButton.emit();
    fetch(this.object.files[0], {
      headers: {
        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem(Constant.WEBEX_TOKENS)).access_token
      }
    }).then((response) => response.blob())
      .then((blob) => {
        const contentType = blob.type;
        this.downloadFile(blob, contentType);
      })
      .catch((error) => console.log('error:', error));
  }

  downloadFile(data: any, contentType: string): void {
    const blob: Blob = new Blob([data], {type: contentType});
    const fileName = 'my-' + contentType.split('/')[1] + '.' + contentType.split('/')[1];
    const objectUrl: string = URL.createObjectURL(blob);
    const a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;

    a.href = objectUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(objectUrl);
  }

  public blobToFile = (theBlob: Blob, fileName: string): File => {
    const b: any = theBlob;
    b.lastModifiedDate = new Date();
    b.name = fileName;

    return <File>theBlob;
  }
}
