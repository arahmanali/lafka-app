import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ToastrService } from 'ngx-toastr';
import { SessionStorageService } from 'ngx-webstorage';

import { environment } from '../../../environments/environment';

@Injectable()
export class InterceptorService {

  token: string;

  constructor(private _sessionStorage: SessionStorageService, private toastr: ToastrService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    this.token = this._sessionStorage.retrieve('token');

    let options = {
      url: environment.baseUrl + req.url
    };

    if (this.token !== null) {
      options['headers'] = req.headers.set('x-token', this.token);
    }

    let request = req.clone(options);

    return next.handle(request).pipe(
      tap(
        event => this.handleResponse(request, event),
        error => this.handleError(request, error)
      )
    )
  }

  handleResponse(req: HttpRequest<any>, event) {
    if (event instanceof HttpResponse) {
      console.log('::Response::', event);
    } else if (event instanceof HttpErrorResponse) {
      console.log('::Error::', event);
      this.toastr.error(event.message);
    }
  }

  handleError(req: HttpRequest<any>, event) {
    console.log('::Error::', event);
    this.toastr.error(event.message);
  }

}
