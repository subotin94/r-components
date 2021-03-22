
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RIconModule } from '../../icon/icon.module';
import { RCheckboxComponent } from './checkbox.component';

@NgModule({
  imports: [
    CommonModule,
    RIconModule,
  ],
  declarations: [RCheckboxComponent],
  exports: [RCheckboxComponent],
})
export class RCheckboxModule { }
