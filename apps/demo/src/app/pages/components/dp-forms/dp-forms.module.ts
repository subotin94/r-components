import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DpFormsRoutingModule } from './dp-forms-routing.module';
import { DpSelectModule } from './dp-select/dp-select.module';

@NgModule({
  imports: [
    CommonModule,
    DpFormsRoutingModule,
    DpSelectModule,
  ]
})
export class DpFormsModule { }
