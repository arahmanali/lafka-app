import { Component, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { SessionStorageService } from 'ngx-webstorage';

import { HomeService } from './home.service';
import { SocketService } from '../core/services/socket.service';
import { IResponse, IResponseError, IValidateResponse, ISocketResponse } from './ITypes';
import { LoggerService } from '../core/services/logger.service';

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
    private sessionStorage: SessionStorageService,
    private _logger: LoggerService
  ) {
    this.isAuthenticated = this._homeService.isAuthenticated()
  }

  ngOnInit() {
    if (this.isAuthenticated) {
      this._socketService.connectionInit();
      this._logger.log = 'Authenticated'
    } else {
      this._logger.log = 'Please Authenticate and Start Process';
    }
  }

  handleAuthenticate() {
    this._homeService.signin()
      .subscribe((res: IResponse) => {
        if (res.status === 200 || res.status === 201) {
          this.sessionStorage.store('token', res.body.token);
          this.isAuthenticated = true;
          if (!this._socketService.isConnected) {
            this._socketService.connectionInit();
          }
          this._logger.log = 'Authenticated'
          this._logger.log = 'SOCKET CONNECTED';
          this._toastr.success('You are now Logged in');
        }
      }, (error: IResponseError) => {
        this._toastr.error(error.message || 'Error Occurred');
      });
  }

  handleStartProcess() {
    if (!this._socketService.isConnected) {
      this._socketService.connect();
      this._logger.log = 'SOCKET CONNECTED';
    }
    this._logger.log = 'STARTED LISTENING CHANNEL';
    this.inProgress = true;
    this._socketService.listen('channel')
      .subscribe((res: ISocketResponse) => {
        this._socketService.emit('join-room', res.message);
        this._logger.log = `EMITTING ON JOIN ROOM WITH CHANNEL ID, ${res.message}`
      },
        this._handleError
      );

    this._logger.log = 'STARTED LISTENING ITEM';
    this._socketService.listen('item')
      .subscribe((res: ISocketResponse) => {
        const uuid = res.uuid;
        const counter = JSON.parse(res.message)[0];
        this._logger.log = `COUNTER: ${counter}`
        this._logger.log = `MESSAGE: ${uuid}`
        if (counter === 10) {
          this._logger.log = `STARTING VALIDATION WITH ${uuid}`
          this._handleValidate(uuid);
        }
      },
        this._handleError
      );

    this._logger.log = 'EMITTING ON CHANNEL'
    this._socketService.emit('channel', '')

    this._logger.log = 'EMITTING ON COUNTER'
    this._socketService.emit('counter', '')
  }

  handleLogout() {
    this._homeService.signout()
      .subscribe((res: boolean) => {
        if (res) {
          this.isAuthenticated = false;
          this._logger.log = 'LOGGED OUT SUCCESSFULLY'
          this._toastr.success('You are now Logged out');
        }
      },
        this._handleError
      );
  }

  private _handleValidate(uuid: string) {
    this._homeService.validate(uuid)
      .subscribe((res: IValidateResponse) => {
        if (res.status === 200 || res.status === 201) {
          if (res.body) {
            this._socketService.disconnect();
            this.inProgress = false;
            this._logger.log = 'MESSAGE VALIDATED SUCCESSFULLY'
            this._toastr.success('Process Completed');
            this._logger.log = 'SOCKET DISCONNECTED';
          }
        }
      },
        this._handleError
      );
  }

  private _handleError(error: IResponseError) {
    this._socketService.disconnect();
    this.inProgress = false;
    this._toastr.error(error.message || 'Error Occurred');
  }

}
