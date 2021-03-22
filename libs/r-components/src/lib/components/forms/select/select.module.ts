import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { RSelectComponent } from './select.component';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { RIconModule } from '../../icon/icon.module';
import { ROptionModule } from '../option/option.module';

@NgModule({
  declarations: [
    RSelectComponent,
  ],
  imports: [
    CommonModule,
    OverlayModule,
    PortalModule,
    ReactiveFormsModule,
    ROptionModule,
    RIconModule,
  ],
  exports: [
    RSelectComponent,
    ROptionModule,
  ],
  providers: [
    FocusKeyManager
  ]
})
export class RSelectModule { }
