import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  forwardRef,
  Inject,
  Input,
  ViewEncapsulation,
  QueryList,
  ElementRef,
  NgZone,
} from '@angular/core';
import {RDrawer, RDrawerContainer, RDrawerContent, R_DRAWER_CONTAINER} from './drawer';
import {rDrawerAnimations} from './drawer-animations';
import {
  BooleanInput,
  coerceBooleanProperty,
  coerceNumberProperty,
  NumberInput
} from '@angular/cdk/coercion';
import {ScrollDispatcher} from '@angular/cdk/scrolling';


@Component({
  selector: 'r-sidenav-content',
  template: '<ng-content></ng-content>',
  host: {
    'class': 'r-drawer-content r-sidenav-content',
    '[style.margin-left.px]': '_container._contentMargins.left',
    '[style.margin-right.px]': '_container._contentMargins.right',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class RSidenavContent extends RDrawerContent {
  constructor(
      changeDetectorRef: ChangeDetectorRef,
      @Inject(forwardRef(() => RSidenavContainer)) container: RSidenavContainer,
      elementRef: ElementRef<HTMLElement>,
      scrollDispatcher: ScrollDispatcher,
      ngZone: NgZone) {
    super(changeDetectorRef, container, elementRef, scrollDispatcher, ngZone);
  }
}


@Component({
  selector: 'r-sidenav',
  exportAs: 'matSidenav',
  templateUrl: 'drawer.html',
  animations: [rDrawerAnimations.transformDrawer],
  host: {
    'class': 'r-drawer r-sidenav',
    'tabIndex': '-1',
    // must prevent the browser from aligning text based on value
    '[attr.align]': 'null',
    '[class.r-drawer-end]': 'position === "end"',
    '[class.r-drawer-over]': 'mode === "over"',
    '[class.r-drawer-push]': 'mode === "push"',
    '[class.r-drawer-side]': 'mode === "side"',
    '[class.r-drawer-opened]': 'opened',
    '[class.r-sidenav-fixed]': 'fixedInViewport',
    '[style.top.px]': 'fixedInViewport ? fixedTopGap : null',
    '[style.bottom.px]': 'fixedInViewport ? fixedBottomGap : null',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class RSidenav extends RDrawer {
  /** Whether the sidenav is fixed in the viewport. */
  @Input()
  get fixedInViewport(): boolean { return this._fixedInViewport; }
  set fixedInViewport(value) { this._fixedInViewport = coerceBooleanProperty(value); }
  private _fixedInViewport = false;

  /**
   * The gap between the top of the sidenav and the top of the viewport when the sidenav is in fixed
   * mode.
   */
  @Input()
  get fixedTopGap(): number { return this._fixedTopGap; }
  set fixedTopGap(value) { this._fixedTopGap = coerceNumberProperty(value); }
  private _fixedTopGap = 0;

  /**
   * The gap between the bottom of the sidenav and the bottom of the viewport when the sidenav is in
   * fixed mode.
   */
  @Input()
  get fixedBottomGap(): number { return this._fixedBottomGap; }
  set fixedBottomGap(value) { this._fixedBottomGap = coerceNumberProperty(value); }
  private _fixedBottomGap = 0;

  static ngAcceptInputType_fixedInViewport: BooleanInput;
  static ngAcceptInputType_fixedTopGap: NumberInput;
  static ngAcceptInputType_fixedBottomGap: NumberInput;
}

@Component({
  selector: 'r-sidenav-container',
  exportAs: 'matSidenavContainer',
  templateUrl: 'sidenav-container.html',
  styleUrls: ['drawer.scss'],
  host: {
    'class': 'r-drawer-container r-sidenav-container',
    '[class.r-drawer-container-explicit-backdrop]': '_backdropOverride',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{
    provide: R_DRAWER_CONTAINER,
    useExisting: RSidenavContainer
  }]

})
export class RSidenavContainer extends RDrawerContainer {
  @ContentChildren(RSidenav, {
    // We need to use `descendants: true`, because Ivy will no longer match
    // indirect descendants if it's left as false.
    descendants: true
  })
  _allDrawers: QueryList<RSidenav>;

  @ContentChild(RSidenavContent) _content: RSidenavContent;
  static ngAcceptInputType_hasBackdrop: BooleanInput;
}
