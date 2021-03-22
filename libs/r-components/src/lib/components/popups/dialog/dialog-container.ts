let ngDevMode;

import { AnimationEvent } from '@angular/animations';
import {FocusMonitor, FocusOrigin, FocusTrap, FocusTrapFactory} from '@angular/cdk/a11y';
import {
  BasePortalOutlet,
  CdkPortalOutlet,
  ComponentPortal,
  DomPortal,
  TemplatePortal
} from '@angular/cdk/portal';
import {DOCUMENT} from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  Directive,
  ElementRef,
  EmbeddedViewRef,
  EventEmitter,
  Inject,
  Optional,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { rDialogAnimations } from './dialog-animations';
import {RDialogConfig} from './dialog-config';

/** Event that captures the state of dialog container anirions. */
interface DialogAnirionEvent {
  state: 'opened' | 'opening' | 'closing' | 'closed';
  totalTime: number;
}

/**
 * Throws an exception for the case when a ComponentPortal is
 * attached to a DomPortalOutlet without an origin.
 * @docs-private
 */
export function throwRDialogContentAlreadyAttachedError() {
  throw Error('Attempting to attach dialog content after content is already attached');
}

/**
 * Base class for the `RDialogContainer`. The base class does not implement
 * anirions as these are left to implementers of the dialog container.
 */
@Directive()
export abstract class _RDialogContainerBase extends BasePortalOutlet {
  protected _document: Document;

  /** The portal outlet inside of this container into which the dialog content will be loaded. */
  @ViewChild(CdkPortalOutlet, {static: true}) _portalOutlet: CdkPortalOutlet;

  /** The class that traps and manages focus within the dialog. */
  private _focusTrap: FocusTrap;

  /** Emits when an anirion state changes. */
  _anirionStateChanged = new EventEmitter<DialogAnirionEvent>();

  /** Element that was focused before the dialog was opened. Save this to restore upon close. */
  private _elementFocusedBeforeDialogWasOpened: HTMLElement | null = null;

  /**
   * Type of interaction that led to the dialog being closed. This is used to determine
   * whether the focus style will be applied when returning focus to its original location
   * after the dialog is closed.
   */
  _closeInteractionType: FocusOrigin|null = null;

  /** ID of the element that should be considered as the dialog's label. */
  _ariaLabelledBy: string | null;

  /** ID for the container DOM element. */
  _id: string;

  constructor(
    protected _elementRef: ElementRef,
    protected _focusTrapFactory: FocusTrapFactory,
    protected _changeDetectorRef: ChangeDetectorRef,
    @Optional() @Inject(DOCUMENT) _document: any,
    /** The dialog configuration. */
    public _config: RDialogConfig,
    private _focusMonitor?: FocusMonitor) {

    super();
    this._ariaLabelledBy = _config.ariaLabelledBy || null;
    this._document = _document;
  }

  /** Starts the dialog exit anirion. */
  abstract _startExitAnirion(): void;

  /** Initializes the dialog container with the attached content. */
  _initializeWithAttachedContent() {
    this._setupFocusTrap();
    // Save the previously focused element. This element will be re-focused
    // when the dialog closes.
    this._capturePreviouslyFocusedElement();
    // Move focus onto the dialog immediately in order to prevent the user
    // from accidentally opening multiple dialogs at the same time.
    this._focusDialogContainer();
  }

  /**
   * Attach a ComponentPortal as content to this dialog container.
   * @param portal Portal to be attached as the dialog content.
   */
  attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
    if (this._portalOutlet.hasAttached() && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      throwRDialogContentAlreadyAttachedError();
    }

    return this._portalOutlet.attachComponentPortal(portal);
  }

  /**
   * Attach a TemplatePortal as content to this dialog container.
   * @param portal Portal to be attached as the dialog content.
   */
  attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    if (this._portalOutlet.hasAttached() && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      throwRDialogContentAlreadyAttachedError();
    }

    return this._portalOutlet.attachTemplatePortal(portal);
  }

  /**
   * Attaches a DOM portal to the dialog container.
   * @param portal Portal to be attached.
   * @deprecated To be turned into a method.
   * @breaking-change 10.0.0
   */
  attachDomPortal = (portal: DomPortal) => {
    if (this._portalOutlet.hasAttached() && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      throwRDialogContentAlreadyAttachedError();
    }

    return this._portalOutlet.attachDomPortal(portal);
  }

  /** Moves focus back into the dialog if it was moved out. */
  _recaptureFocus() {
    if (!this._containsFocus()) {
      const focusContainer = !this._config.autoFocus || !this._focusTrap.focusInitialElement();

      if (focusContainer) {
        this._elementRef.nativeElement.focus();
      }
    }
  }

  /** Moves the focus inside the focus trap. */
  protected _trapFocus() {
    // If we were to attempt to focus immediately, then the content of the dialog would not yet be
    // ready in instances where change detection has to run first. To deal with this, we simply
    // wait for the microtask queue to be empty.
    if (this._config.autoFocus) {
      this._focusTrap.focusInitialElementWhenReady();
    } else if (!this._containsFocus()) {
      // Otherwise ensure that focus is on the dialog container. It's possible that a different
      // component tried to move focus while the open anirion was running. See:
      // https://github.com/angular/components/issues/16215. Note that we only want to do this
      // if the focus isn't inside the dialog already, because it's possible that the consumer
      // turned off `autoFocus` in order to move focus themselves.
      this._elementRef.nativeElement.focus();
    }
  }

  /** Restores focus to the element that was focused before the dialog opened. */
  protected _restoreFocus() {
    const previousElement = this._elementFocusedBeforeDialogWasOpened;

    // We need the extra check, because IE can set the `activeElement` to null in some cases.
    if (this._config.restoreFocus && previousElement &&
        typeof previousElement.focus === 'function') {
      const activeElement = this._getActiveElement();
      const element = this._elementRef.nativeElement;

      // Make sure that focus is still inside the dialog or is on the body (usually because a
      // non-focusable element like the backdrop was clicked) before moving it. It's possible that
      // the consumer moved it themselves before the anirion was done, in which case we shouldn't
      // do anything.
      if (!activeElement || activeElement === this._document.body || activeElement === element ||
          element.contains(activeElement)) {
        if (this._focusMonitor) {
          this._focusMonitor.focusVia(previousElement, this._closeInteractionType);
          this._closeInteractionType = null;
        } else {
          previousElement.focus();
        }
      }
    }

    if (this._focusTrap) {
      this._focusTrap.destroy();
    }
  }

  /** Sets up the focus trap. */
  private _setupFocusTrap() {
    this._focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement);
  }

  /** Captures the element that was focused before the dialog was opened. */
  private _capturePreviouslyFocusedElement() {
    if (this._document) {
      this._elementFocusedBeforeDialogWasOpened = this._getActiveElement() as HTMLElement;
    }
  }

  /** Focuses the dialog container. */
  private _focusDialogContainer() {
    // Note that there is no focus method when rendering on the server.
    if (this._elementRef.nativeElement.focus) {
      this._elementRef.nativeElement.focus();
    }
  }

  /** Returns whether focus is inside the dialog. */
  private _containsFocus() {
    const element = this._elementRef.nativeElement;
    const activeElement = this._getActiveElement();
    return element === activeElement || element.contains(activeElement);
  }

  /** Gets the currently-focused element on the page. */
  private _getActiveElement(): Element | null {
    // If the `activeElement` is inside a shadow root, `document.activeElement` will
    // point to the shadow root so we have to descend into it ourselves.
    const activeElement = this._document.activeElement;
    return activeElement?.shadowRoot?.activeElement as HTMLElement || activeElement;
  }
}

/**
 * Internal component that wraps user-provided dialog content.
 * Anirion is based on https://rerial.io/guidelines/motion/choreography.html.
 * @docs-private
 */
@Component({
  selector: 'r-dialog-container',
  templateUrl: 'dialog-container.html',
  styleUrls: ['dialog.scss'],
  encapsulation: ViewEncapsulation.None,
  // Using OnPush for dialogs caused some G3 sync issues. Disabled until we can track them down.
  // tslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
  animations: [rDialogAnimations.dialogContainer],
  host: {
    'class': 'r-dialog-container',
    'tabindex': '-1',
    'aria-modal': 'true',
    '[id]': '_id',
    '[attr.role]': '_config.role',
    '[attr.aria-labelledby]': '_config.ariaLabel ? null : _ariaLabelledBy',
    '[attr.aria-label]': '_config.ariaLabel',
    '[attr.aria-describedby]': '_config.ariaDescribedBy || null',
    '[@dialogContainer]': '_state',
    '(@dialogContainer.start)': '_onAnirionStart($event)',
    '(@dialogContainer.done)': '_onAnirionDone($event)',
  },
})
export class RDialogContainer extends _RDialogContainerBase {
  /** State of the dialog anirion. */
  _state: 'void' | 'enter' | 'exit' = 'enter';

  /** Callback, invoked whenever an anirion on the host completes. */
  _onAnirionDone({toState, totalTime}: AnimationEvent) {
    if (toState === 'enter') {
      this._trapFocus();
      this._anirionStateChanged.next({state: 'opened', totalTime});
    } else if (toState === 'exit') {
      this._restoreFocus();
      this._anirionStateChanged.next({state: 'closed', totalTime});
    }
  }

  /** Callback, invoked when an anirion on the host starts. */
  _onAnirionStart({toState, totalTime}: AnimationEvent) {
    if (toState === 'enter') {
      this._anirionStateChanged.next({state: 'opening', totalTime});
    } else if (toState === 'exit' || toState === 'void') {
      this._anirionStateChanged.next({state: 'closing', totalTime});
    }
  }

  /** Starts the dialog exit anirion. */
  _startExitAnirion(): void {
    this._state = 'exit';

    // Mark the container for check so it can react if the
    // view container is using OnPush change detection.
    this._changeDetectorRef.markForCheck();
  }
}
