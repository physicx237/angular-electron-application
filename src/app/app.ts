import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnInit,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import Peer from 'peerjs';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit {
  peerId!: string;

  isShowVideo = false;

  private readonly peer = new Peer({
    host: 'localhost',
    port: 80,
    path: '/app',
    config: {
      iceServers: [
        {
          urls: 'http:/localhost:80',
          username: 'username',
          credential: 'strongpassword',
        },
      ],
    },
  });

  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  private readonly videoElement = viewChild<ElementRef<HTMLVideoElement>>('video');
  private readonly callButtonElement = viewChild<ElementRef<HTMLButtonElement>>('callButton');

  ngOnInit() {
    this.peer.on('open', (peerId) => {
      this.peerId = peerId;

      this.changeDetectorRef.markForCheck();
    });

    this.answer();
  }

  call(peerId: string) {
    this.callButtonElement()!.nativeElement.value = '';

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      const call = this.peer.call(peerId, stream);

      this.isShowVideo = true;

      this.changeDetectorRef.markForCheck();

      call.on('stream', (remoteStream) => {
        this.videoElement()!.nativeElement.srcObject = remoteStream;
      });
    });
  }

  answer() {
    this.peer.on('call', (call) => {
      this.isShowVideo = true;

      this.changeDetectorRef.markForCheck();

      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
        call.answer(stream);

        call.on('stream', (remoteStream) => {
          this.videoElement()!.nativeElement.srcObject = remoteStream;
        });
      });
    });
  }
}
