import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './home.component';
import { HomeService } from './home.service';
import { LoggerComponent } from './logger/logger.component';
import { LoggerService } from '../core/services/logger.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [HomeService, LoggerService],
  declarations: [HomeComponent, LoggerComponent],
  exports: [HomeComponent]
})

export class HomeModule { }
