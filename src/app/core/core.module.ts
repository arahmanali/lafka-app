import { NgModule } from '@angular/core';

import { BootstrapModule } from './bootstrap/bootstrap.module';

const modules = [
  BootstrapModule
];

@NgModule({
  imports: modules,
  exports: modules,
  declarations: []
})

export class CoreModule { }
