import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';
import { NgxWebstorageModule } from 'ngx-webstorage';

import { HomeModule } from './home/home.module';

import { AppComponent } from './app.component';

import { ApiService } from './core/services/api.service';
import { SocketService } from './core/services/socket.service';
import { BootstrapModule } from './core/bootstrap/bootstrap.module';
import { InterceptorService } from './core/services/interceptor.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    BootstrapModule,
    HomeModule,
    BrowserAnimationsModule,
    NgxWebstorageModule.forRoot(),
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      closeButton: true
    })
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: InterceptorService,
    multi: true
  },
    ApiService,
    SocketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
