import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { IResponse } from '../IResponse';

import { map } from 'rxjs/operators';

interface IQuery {
  key: string,
  value: string
}

@Injectable()
export class ApiService {

  constructor(private _http: HttpClient) { }

  get(url: string, query?: IQuery) {
    let { _url, params } = this.generateUrl(url, query);
    return this._http.get(_url, { observe: 'response', params }).pipe(
      map(res => ({ status: res.status, body: res.body }))
    )
  }

  post(data: JSON, url: string, query?: IQuery) {
    let { _url, params } = this.generateUrl(url, query);
    return this._http.post<IResponse>(_url, data, { observe: 'response', params }).pipe(
      map(res => ({ status: res.status, body: res.body }))
    )
  }

  put(data: JSON, url: string, query?: IQuery) {
    let { _url, params } = this.generateUrl(url, query);
    return this._http.put<IResponse>(_url, data, { observe: 'response', params }).pipe(
      map(res => ({ status: res.status, body: res.body }))
    )
  }

  delete(url: string, query?: IQuery) {
    let { _url, params } = this.generateUrl(url, query);
    return this._http.delete<IResponse>(_url, { observe: 'response', params }).pipe(
      map(res => ({ status: res.status, body: res.body }))
    )
  }

  generateUrl(url: string, query?: IQuery) {
    let _url: string = url;
    let params: HttpParams;
    let result = { _url, params }
    if (query && query.key) {
      const params = new HttpParams().set(query.key, query.value)
      result.params = params;
    }
    return result;
  }
}
