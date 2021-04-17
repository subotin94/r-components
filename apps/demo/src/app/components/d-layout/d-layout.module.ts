import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DLayoutComponent } from './d-layout.component';
import { RLayoutModule } from '@r-components/theme';

@NgModule({
  declarations: [
    DLayoutComponent
  ],
  imports: [
    CommonModule,
    RLayoutModule,
  ],
  exports: [
    DLayoutComponent
  ]
})
export class DLayoutModule { }
