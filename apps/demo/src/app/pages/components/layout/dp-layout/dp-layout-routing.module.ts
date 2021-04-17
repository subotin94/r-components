import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DpLayoutComponent } from './dp-layout.component';

const routes: Routes = [
  {
    path: '',
    component: DpLayoutComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DpLayoutRoutingModule { }
