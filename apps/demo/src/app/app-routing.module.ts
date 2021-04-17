import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';

const routes: Routes = [
  {
    path: '',
    component: LandingComponent
  },
  {
    path: 'components',
    loadChildren: () => import('./pages/components/components.module').then(mod => mod.ComponentsModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {initialNavigation: 'enabled', anchorScrolling: 'enabled'})
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }