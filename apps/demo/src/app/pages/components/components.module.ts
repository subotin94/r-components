import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RLayoutModule } from '@r-components/theme';
import { ComponentsRoutingModule } from './components-routing.module';
import { ComponentsComponent } from './components.component';

@NgModule({
  declarations: [
    ComponentsComponent
  ],
  imports: [
    CommonModule,
    ComponentsRoutingModule,
    RLayoutModule
  ]
})
export class ComponentsModule { }
