import { Component, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { SessionStorageService } from 'ngx-webstorage';

import { HomeService } from './home.service';
import { SocketService } from '../core/services/socket.service';
import { IResponse } from '../core/IResponse';
import { IResponseError, IValidateResponse } from './ITypes';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  isAuthenticated: boolean = false;
  inProgress: boolean = false;

  constructor(
    private _homeService: HomeService,
    private _socketService: SocketService,
    private _toastr: ToastrService,
    private sessionStorage: SessionStorageService
  ) {
    this.isAuthenticated = this._homeService.isAuthenticated()
  }

  ngOnInit() {
    if (this.isAuthenticated) {
      this._socketService.connectionInit();
    }
  }

  handleAuthenticate() {
    this._homeService.signin()
      .subscribe((res: IResponse) => {
        if (res.status === 200 || res.status === 201) {
          this.sessionStorage.store('token', res.body.token);
          this._socketService.connectionInit();
          this.isAuthenticated = true;
          this._toastr.success('You are now Logged in');
        }
      }, (error: IResponseError) => {
        this._toastr.error(error.message || 'Error Occurred');
      });
  }

  handleValidate(uuid: string) {
    this._homeService.validate(uuid)
      .subscribe((res: IValidateResponse) => {
        console.log('handleValidate res: ', res);
        if (res.status === 200 || res.status === 201) {
          if (res.body) {
            this._socketService.disconnect();
            this.inProgress = false;
            console.log('MESSAGE VALIDATED SUCCESSFULLY');
            this._toastr.success('Process Completed');
          }
        }
      },
        this.handleError
      );
  }

  handleLogout() {
    this._homeService.signout()
      .subscribe((res: IValidateResponse) => {
        console.log('handleLogout res: ', res);
        if (res) {
          this.isAuthenticated = false;
          console.log('LOGGED OUT SUCCESSFULLY');
          this._toastr.success('You are now Logged out');
        }
      },
        this.handleError
      );
  }

  handleStartProcess() {
    console.log('STARTED LISTENING CHANNEL');
    this.inProgress = true;
    this._socketService.listen('channel')
      .subscribe((res: { message: string }) => {
        console.log('EMITTING ON JOIN ROOM WITH CHANNEL ID', res.message);
        this._socketService.emit('join-room', res.message);
      },
        this.handleError
      );

    console.log('STARTED LISTENING ITEM');
    this._socketService.listen('item')
      .subscribe((res: { message: string, uuid: string }) => {
        const uuid = res.uuid;
        const counter = JSON.parse(res.message)[0];
        console.log('counter: ', counter);
        console.log('uuid: ', uuid);
        if (counter === 10) {
          console.log('STARTING VALIDATION WITH ', uuid);
          this.handleValidate(uuid);
        }
      },
        this.handleError
      );

    console.log('EMITTING ON CHANNEL');
    this._socketService.emit('channel', '')

    console.log('EMITTING ON COUNTER');
    this._socketService.emit('counter', '')
  }

  handleError(error: IResponseError) {
    this._socketService.disconnect();
    this.inProgress = false;
    this._toastr.error(error.message || 'Error Occurred');
  }

}
