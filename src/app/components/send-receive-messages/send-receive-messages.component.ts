import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Constant} from '../../configurations/StringConstants';
import {RequestMethod, RequestOptions} from '@angular/http';
import {HttpService} from '../../services/http.service';
import {HttpClient} from '@angular/common/http';


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
  @Input() fileName: any;

  @Output() clickAttachmentButton: EventEmitter<any> = new EventEmitter<any>();

  constructor(private httpService: HttpService, private http: HttpClient) {
  }

  ngOnInit() {
    if (this.message === '*File*' && this.fileName) {
      this.getFileName(this.fileName);
    }
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

  getFileName(url: string) {
    const options = new RequestOptions();
    options.url = url;
    options.method = RequestMethod.Head;

    this.httpService.request(options).subscribe((response => {
      const temp = response.headers;
      console.log(temp);
    }), error => {
      console.log(error);
    });

    // const accessToken = JSON.parse(localStorage.getItem(Constant.WEBEX_TOKENS)).access_token;
    //
    // const Http = new XMLHttpRequest();
    // Http.setRequestHeader('Access-Control-Allow-Origin', '*');
    // Http.open('HEAD', url);
    // Http.setRequestHeader(Constant.AUTHORIZATION_HEADER, Constant.BEARER + ' ' + accessToken);
    // Http.send();
    // Http.onreadystatechange = (e) => {
    //   console.log(Http.getAllResponseHeaders());
    // };
  }
}
