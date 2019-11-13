import { Component, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { SessionStorageService } from 'ngx-webstorage';

import { HomeService } from './home.service';
import { SocketService } from '../core/services/socket.service';
import { IResponse } from '../core/IResponse';
import { IResponseError } from './ITypes';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  isAuthenticated: boolean = false;

  constructor(
    private _homeService: HomeService,
    private _socketService: SocketService,
    private _toastr: ToastrService,
    private sessionStorage: SessionStorageService
  ) {
    this.isAuthenticated = this._homeService.isAuthenticated()
  }

  ngOnInit() {

  }

  handleAuthenticate() {
    this._homeService.signin()
      .subscribe((res: IResponse) => {
        if (res.status === 200 || res.status === 201) {
          this.sessionStorage.store('token', res.body.token);
        }
      }, (error: IResponseError) => {
        this._toastr.error(error.message || 'Error Occurred');
      });
  }

  handleRegister() {
    this._socketService.emit('channel', '')
  }

  handleListener() {
    this._socketService.listen('channel')
      .subscribe((channelId: string) => {
        console.log('channelId: ', channelId);
      }, (error: IResponseError) => {
        this._toastr.error(error.message || 'Error Occurred');
      });
  }

  handleJoinRoom() {
    this._socketService.listen('join-room')
      .subscribe((channelId: string) => {
        console.log('handleJoinRoom: ', channelId);
      }, (error: IResponseError) => {
        this._toastr.error(error.message || 'Error Occurred');
      });
  }

}
