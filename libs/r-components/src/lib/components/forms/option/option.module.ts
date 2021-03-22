import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RCheckboxModule } from '../checkbox/checkbox.module';
import { ROptionGroupComponent } from './option-group.component';
import { ROptionListComponent } from './option-list.component';
import { ROptionComponent } from './option.component';

export const R_OPTION_LIST_COMPONENTS = [
  ROptionListComponent,
  ROptionGroupComponent,
  ROptionComponent
];

@NgModule({
  declarations: R_OPTION_LIST_COMPONENTS,
  imports: [
    CommonModule,
    A11yModule,
    RCheckboxModule
  ],
  exports: R_OPTION_LIST_COMPONENTS
})
export class ROptionModule { }
