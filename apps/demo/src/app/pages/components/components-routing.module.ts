import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComponentsComponent } from './components.component';

const routes: Routes = [
  {
    path: '',
    component: ComponentsComponent,
    children: [
      {
        path: 'layout',
        loadChildren: () => import('./layout/dp-layout/dp-layout.module').then(mod => mod.DpLayoutModule)
      },
      {
        path: 'forms',
        loadChildren: () => import('./dp-forms/dp-forms.module').then(mod => mod.DpFormsModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentsRoutingModule { }
