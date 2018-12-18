import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MockService } from './services/mock.service';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  spark: any;
  accessToken: string;
  callerId: string;
  constraints = {
    audio: true,
    video: false
  };
  @ViewChild('videoElem') videoElem: ElementRef;
  @ViewChild('viewAudioElem') viewAudioElem: ElementRef;
  @ViewChild('viewVideoElem') viewVideoElem: ElementRef;

  constructor(private ms: MockService, private dataService: DataService) {
    ms.getMockJson('mocks/conversations.json');
  }

  ngOnInit(): void {

  }

  writeLocalStorage(type: string, value: string, event) {
    event.preventDefault();
    localStorage.setItem(type, value);
    if (type === 'access-token') {
      this.accessToken = value;
      this.connect();
    }
    if (type === 'invitee') {
      this.callerId = value;
      this.connect()
        .then(() => {
          const call = this.spark.phone.dial(this.callerId, this.constraints);

          // Call our helper function for binding events to calls
          this.bindCallEvents(call);
        });
    }
  }

  initSpark() {
    this.spark = this.dataService.getSpark();
    if (!this.spark) {
      this.spark = ciscospark.init({
        config: {
          phone: {
            // Turn on group calling; there's a few minor breaking changes with
            // regards to how single-party calling works (hence, the opt-in), but
            // this is how things are going to work in 2.0 and if you plan on
            // doing any group calls, you'll need this turned on for your entire
            // app anyway.
            enableExperimentalGroupCallingSupport: true
          }
        },
        credentials: {
          access_token: this.accessToken
        }
      });
      this.dataService.setSpark(this.spark);
    }
  }

  connect() {
    this.initSpark();

    if (!this.spark.phone.registered) {
      // we want to start listening for incoming calls *before* registering with
      // the cloud so that we can join any calls that may already be in progress.
      this.spark.phone.on('call:incoming', (call) => {
        Promise.resolve()
          .then(() => {
            // Let's render the name of the person calling us. Note that calls
            // from external sources (some SIP URIs, PSTN numbers, etc) may not
            // have personIds, so we can't assume that field will exist.
            if (call.from && call.from.personId) {
              // In production, you'll want to cache this so you don't have to do
              // a fetch on every incoming call.
              return this.spark.people.get(call.from.personId);
            }

            return Promise.resolve();
          })
          .then((person) => {
            const str = person ? `Anwser incoming call from ${person.displayName}` : 'Answer incoming call';
            if (confirm(str)) {
              call.answer();
              this.bindCallEvents(call);
            }
            else {
              call.decline();
            }
          })
          .catch((err) => {
            console.error(err);
            alert(err);
          });
      });

      return this.spark.phone.register()
        .then(() => {
          // This is just a little helper for our selenium tests and doesn't
          // really matter for the example
          document.body.classList.add('listening');

          document.getElementById('connection-status').innerHTML = 'connected';
        })
        // This is a terrible way to handle errors, but anything more specific is
        // going to depend a lot on your app
        .catch((err) => {
          console.error(err);
          alert(err.stack);
          // we'll rethrow here since we didn't really *handle* the error, we just
          // reported it
          throw err;
        });
    }

    return Promise.resolve();
  }

  bindCallEvents(call) {
    // call is a call instance, not a promise, so to know if things break,
    // we'll need to listen for the error event. Again, this is a rather naive
    // handler.
    call.on('error', (err) => {
      console.error(err);
      alert(err.stack);
    });

    // We can start rendering local and remote video before the call is
    // officially connected but not right when it's dialed, so we'll need to
    // listen for the streams to become available. We'll use `.once` instead
    // of `.on` because those streams will not change for the duration of
    // the call and it's one less event handler to worry about later.

    call.once('localMediaStream:change', () => {
      this.videoElem.nativeElement.srcObject = call.localMediaStream;
    });

    call.on('remoteMediaStream:change', () => {
      // Ok, yea, this is a little weird. There's a Chrome behavior that prevents
      // audio from playing from a video tag if there is no corresponding video
      // track.
      [
        'audio',
        'video'
      ].forEach((kind) => {
        if (call.remoteMediaStream) {
          const track = call.remoteMediaStream.getTracks().find((t) => t.kind === kind);
          if (track) {
            if (kind === 'audio') {
              this.viewAudioElem.nativeElement.srcObject = new MediaStream([track]);
            }
            if (kind === 'video') {
              this.viewVideoElem.nativeElement.srcObject = new MediaStream([track]);
            }
          }
        }
      });
    });

    // Once the call ends, we'll want to clean up our UI a bit
    call.on('inactive', () => {
      // Remove the streams from the UI elements
      this.videoElem.nativeElement.srcObject = undefined;
      this.viewAudioElem.nativeElement.srcObject = undefined;
      this.viewVideoElem.nativeElement.srcObject = undefined;
    });

    // Of course, we'd also like to be able to end the call:
    document.getElementById('hangup').addEventListener('click', () => {
      call.hangup();
    });
  }

  call() {
    this.connect()
      .then(() => {
        const call = this.spark.phone.dial(this.callerId, this.constraints);

        // Call our helper function for binding events to calls
        this.bindCallEvents(call);
      });
  }
}

declare var ciscospark: any;
