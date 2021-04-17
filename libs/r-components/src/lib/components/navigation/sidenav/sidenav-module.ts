import {PlatformModule} from '@angular/cdk/platform';
import {CdkScrollableModule} from '@angular/cdk/scrolling';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RDrawer, RDrawerContainer, RDrawerContent} from './drawer';
import {RSidenav, RSidenavContainer, RSidenavContent} from './sidenav';

@NgModule({
  imports: [
    CommonModule,
    PlatformModule,
    CdkScrollableModule,
  ],
  exports: [
    CdkScrollableModule,
    RDrawer,
    RDrawerContainer,
    RDrawerContent,
    RSidenav,
    RSidenavContainer,
    RSidenavContent,
  ],
  declarations: [
    RDrawer,
    RDrawerContainer,
    RDrawerContent,
    RSidenav,
    RSidenavContainer,
    RSidenavContent,
  ],
})
export class RSidenavModule { }
