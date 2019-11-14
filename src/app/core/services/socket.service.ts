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
          "x-token": token,
          "content-type": "application/json"
        }
      }
    };
    this.socket = io(environment.baseUrl, { transportOptions })
  }

  // INIT
  connectionInit() {
    this.socket.on('connect', () => {
      console.log('SOCKET CONNECTED');
    });

    this.socket.on('disconnect', () => {
      console.log('SOCKET DISCONNECTED');
    });
  }
  
  disconnect() {
    this.socket.close();
  }

  // EMITTER
  emit(event: string, message: string) {
    this.socket.emit(event, { message });
  }

  // LISTENER
  listen(event: string) {
    return Observable.create((observer: Observer<object>) => {
      this.socket.on(event, (message: string, uuid?: string) => {
        observer.next({ message, uuid });
      });
    });
  }
}
