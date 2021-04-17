import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RLayoutComponent } from './layout.component';
import { RNavbarModule } from '../../navigation';
import { RSelectModule } from '../../forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RCheckboxModule } from '../../forms/checkbox/checkbox.module';
import { RDialogModule } from '../../popups/dialog';
import { RSidenavModule } from '../../navigation/sidenav';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    RLayoutComponent
  ],
  imports: [
    CommonModule,
    RSidenavModule,
    RNavbarModule,
    RSelectModule,
    ReactiveFormsModule,
    RCheckboxModule,
    RDialogModule,
    RouterModule,
  ],
  exports: [
    RLayoutComponent
  ]
})
export class RLayoutModule { }
