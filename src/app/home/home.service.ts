import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import { SessionStorageService } from 'ngx-webstorage';

import { ApiService } from '../core/services/api.service';


@Injectable()
export class HomeService {

  // store the URL so we can redirect after logging in
  redirectUrl: string;

  constructor(
    private api: ApiService,
    private _sessionStorage: SessionStorageService,
  ) { }

  signin() {
    let url = '/token';
    return this.api.post({}, url).pipe(map((res) => res))
  }

  signout(): void {
    this._sessionStorage.clear();
  }

  isAuthenticated() {
    if (this._sessionStorage.retrieve('token')) {
      return true;
    }
    return false;
  }

}