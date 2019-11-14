import { Injectable } from '@angular/core';

import * as io from 'socket.io-client'
import { Observable, Observer } from 'rxjs';
import { SessionStorageService } from 'ngx-webstorage';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: SocketIOClient.Socket;
  private connected: boolean = false;

  constructor(
    private _sessionStorage: SessionStorageService
  ) {
    const token = this._sessionStorage.retrieve('token');
    let transportOptions = {
      polling: {
        extraHeaders: {
          "x-token": token,
          "content-type": "application/json"
        }
      }
    };
    this.socket = io(environment.baseUrl, { transportOptions })
  }

  get isConnected() {
    return this.connected;
  }

  // INIT
  connectionInit() {
    this.socket.on('connect', () => {
      console.log('SOCKET CONNECTED');
      this.connected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('SOCKET DISCONNECTED');
      this.connected = false;
    });
  }

  disconnect() {
    this.socket.close();
  }

  connect() {
    this.socket.connect();
  }

  // EMITTER
  emit(event: string, message: string) {
    this.socket.emit(event, { message });
  }

  // LISTENER
  listen(event: string) {
    return Observable.create((observer: Observer<object>) => {
      this.socket.off(event);
      this.socket.on(event, (message: string, uuid?: string) => {
        observer.next({ message, uuid });
      });
    });
  }
}
