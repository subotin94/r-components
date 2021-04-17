import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DpSelectComponent } from './dp-select/dp-select.component';

const routes: Routes = [
  {
    path: 'select',
    component: DpSelectComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DpFormsRoutingModule { }
