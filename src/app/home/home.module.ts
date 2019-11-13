import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './home.component';
import { HomeService } from './home.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [HomeService],
  declarations: [HomeComponent],
  exports: [HomeComponent]
})

export class HomeModule { }
