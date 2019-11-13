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

  constructor(
    private _sessionStorage: SessionStorageService
  ) {
    const token = this._sessionStorage.retrieve('token');
    let transportOptions = {
      polling: {
        extraHeaders: {
          "x-token": token
        }
      }
    };
    this.socket = io(environment.baseUrl, { transportOptions })
    this.connect();
  }

  // INIT
  private connect() {
    this.socket.on('connect', () => {
      console.log('SOCKET CONNECTED');
    });

    this.socket.on('disconnect', () => {
      console.log('SOCKET DISCONNECTED');
    });
  }

  // EMITTER
  emit(event: string, message: string) {
    this.socket.emit(event, { message });
  }

  // LISTENER
  listen(event: string) {
    return Observable.create((observer: Observer<JSON>) => {
      this.socket.on(event, (message: any) => {
        observer.next(message);
      });
    });
  }
}
