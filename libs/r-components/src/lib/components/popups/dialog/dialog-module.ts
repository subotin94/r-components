import {OverlayModule} from '@angular/cdk/overlay';
import {PortalModule} from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import {NgModule} from '@angular/core';
import {R_DIALOG_SCROLL_STRATEGY_PROVIDER, RDialog} from './dialog';
import {RDialogContainer} from './dialog-container';
import {
  RDialogActions,
  RDialogClose,
  RDialogContent,
  RDialogTitle,
} from './dialog-content-directives';


@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
    PortalModule,
  ],
  exports: [
    RDialogContainer,
    RDialogClose,
    RDialogTitle,
    RDialogContent,
    RDialogActions,
  ],
  declarations: [
    RDialogContainer,
    RDialogClose,
    RDialogTitle,
    RDialogActions,
    RDialogContent,
  ],
  providers: [
    RDialog,
    R_DIALOG_SCROLL_STRATEGY_PROVIDER,
  ],
  entryComponents: [RDialogContainer],
})
export class RDialogModule {}
