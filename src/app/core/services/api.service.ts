import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { IResponse } from '../IResponse';

import { map } from 'rxjs/operators';

@Injectable()
export class ApiService {

  constructor(private _http: HttpClient) { }

  get(url: string, query?: string) {
    let _url = this.generateUrl(url, query);
    return this._http.get(_url, { observe: 'response' }).pipe(
      map(res => ({ status: res.status, body: res.body }))
    )
  }

  post(data, url: string, query?: string) {
    let _url = this.generateUrl(url, query);
    return this._http.post<IResponse>(_url, data, { observe: 'response' }).pipe(
      map(res => ({ status: res.status, body: res.body }))
    )
  }

  put(data, url: string, query?: string) {
    let _url = this.generateUrl(url, query);
    return this._http.put<IResponse>(_url, data, { observe: 'response' }).pipe(
      map(res => ({ status: res.status, body: res.body }))
    )
  }

  delete(url: string, query?: string) {
    let _url = this.generateUrl(url, query);
    return this._http.delete<IResponse>(_url, { observe: 'response' }).pipe(
      map(res => ({ status: res.status, body: res.body}))
    )
  }

  generateUrl(url: string, query?: string) {
    let _url: string = url;
    _url += query ? '?' + query : '';
    return _url;
  }
}
