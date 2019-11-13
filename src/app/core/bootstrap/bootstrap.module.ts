import { NgModule } from '@angular/core';
import { 
  ModalModule, 
  AlertModule, 
  TooltipModule, 
  BsDropdownModule, 
  BsDatepickerModule, 
  PaginationModule 
} from 'ngx-bootstrap';

@NgModule({
  imports: [
    ModalModule.forRoot(),
    AlertModule.forRoot(),
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot()

  ],
  exports: [
    ModalModule,
    AlertModule,
    TooltipModule,
    BsDropdownModule,
    BsDatepickerModule,
    PaginationModule
  ]
})
export class BootstrapModule { }
