import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  Inject,
  Input,
  OnDestroy,
  Output,
  QueryList,
  ViewChild,
  Renderer2,
  NgZone,
} from '@angular/core';
import { DOCUMENT, NgClass } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { merge, Subject, BehaviorSubject, from } from 'rxjs';
import { startWith, switchMap, takeUntil, filter, map, finalize } from 'rxjs/operators';
import { Overlay, OverlayPositionBuilder, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { FocusableOption, FocusKeyManager, FocusMonitor } from '@angular/cdk/a11y';
import { ROptionComponent } from '../option/option.component';
import { R_SELECT_INJECTION_TOKEN } from './select-injection-tokens';
import { CdkPortal } from '@angular/cdk/portal';
import { RTrigger, RTriggerStrategyBuilderService } from '../../../cdk/overlay/overlay-trigger';
import { rSelectAnimations } from './select.animations';

export type RSelectCompareFunction<T = any> = (v1: any, v2: any) => boolean;
export type RSelectAppearance = 'outline' | 'filled' | 'hero';

export type RFocusableOption = FocusableOption;
export class RFocusKeyManager<T> extends FocusKeyManager<T> {}

export class RFocusKeyManagerFactoryService<T extends RFocusableOption> {
  create(items: QueryList<T> | T[]): RFocusKeyManager<T> {
    return new RFocusKeyManager<T>(items);
  }
}

@Component({
  selector: 'r-select-label',
  template: '<ng-content></ng-content>',
})
export class RSelectLabelComponent {
}

export function rSelectFormFieldControlConfigFactory() {
  const config: any = {};
  config.supportsSuffix = false;
  return config;
}

@Component({
  selector: 'r-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [rSelectAnimations.transformPanel, rSelectAnimations.transformPanelWrap],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RSelectComponent),
      multi: true,
    },
    { provide: R_SELECT_INJECTION_TOKEN, useExisting: RSelectComponent },
    RFocusKeyManagerFactoryService
  ],
})
export class RSelectComponent implements AfterViewInit, AfterContentInit, OnDestroy,
                                          ControlValueAccessor {
  focused$ = new BehaviorSubject<boolean>(false);
  positionStrategy: PositionStrategy;
  /**
   * Select size, available sizes:
   * `tiny`, `small`, `medium` (default), `large`, `giant`
   */
  @Input() size = 'medium';

  /**
   * Select status (adds specific styles):
   * `basic`, `primary`, `info`, `success`, `warning`, `danger`, `control`
   */
  @Input() status = 'basic';

  /**
   * Select shapes: `rectangle` (default), `round`, `semi-round`
   */
  @Input() shape = 'rectangle';

  /**
   * Select appearances: `outline` (default), `filled`, `hero`
   */
  @Input() appearance: RSelectAppearance = 'outline';

  /**
   * Specifies class to be set on `r-option`s container (`r-option-list`)
   */
  @Input() optionsListClass: NgClass['ngClass'];

  /**
   * Specifies class for the overlay panel with options
   */
  @Input() optionsPanelClass: string | string[];

  /**
   * Adds `outline` styles
   */
  @Input()
  @HostBinding('class.appearance-outline')
  get outline(): boolean {
    return this.appearance === 'outline';
  }
  set outline(value: boolean) {
    if (Boolean(value)) {
      this.appearance = 'outline';
    }
  }
  static ngAcceptInputType_outline;

  /**
   * Adds `filled` styles
   */
  @Input()
  @HostBinding('class.appearance-filled')
  get filled(): boolean {
    return this.appearance === 'filled';
  }
  set filled(value: boolean) {
    if (Boolean(value)) {
      this.appearance = 'filled';
    }
  }
  static ngAcceptInputType_filled;

  /**
   * Adds `hero` styles
   */
  @Input()
  @HostBinding('class.appearance-hero')
  get hero(): boolean {
    return this.appearance === 'hero';
  }
  set hero(value: boolean) {
    if (Boolean(value)) {
      this.appearance = 'hero';
    }
  }
  static ngAcceptInputType_hero;

  /**
   * Disables the select
   */
  @Input()
  get disabled(): boolean {
    return !!this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = Boolean(value);
  }
  protected _disabled: boolean;
  static ngAcceptInputType_disabled;

  /**
   * If set element will fill its container
   */
  @Input()
  @HostBinding('class.full-width')
  get fullWidth(): boolean {
    return this._fullWidth;
  }
  set fullWidth(value: boolean) {
    this._fullWidth = Boolean(value);
  }
  protected _fullWidth: boolean = false;
  static ngAcceptInputType_fullWidth;

  /**
   * Renders select placeholder if nothing selected.
   */
  @Input() placeholder: string = '';

  /**
   * A function to compare option value with selected value.
   * By default, values are compared with strict equality (`===`).
   */
  @Input()
  get compareWith(): RSelectCompareFunction {
    return this._compareWith;
  }
  set compareWith(fn: RSelectCompareFunction) {
    if (typeof fn !== 'function') {
      return;
    }

    this._compareWith = fn;

    if (this.selectionModel.length && this.canSelectValue()) {
      this.setSelection(this.selected);
    }
  }
  protected _compareWith: RSelectCompareFunction = (v1: any, v2: any) => v1 === v2;

  /**
   * Accepts selected item or array of selected items.
   */
  @Input()
  set selected(value) {
    this.writeValue(value);
  }
  get selected() {
    return this.multiple
      ? this.selectionModel.map(o => o.value)
      : this.selectionModel[0].value;
  }

  /**
   * Gives capability just write `multiple` over the element.
   */
  @Input()
  get multiple(): boolean {
    return this._multiple;
  }
  set multiple(value: boolean) {
    this._multiple = Boolean(value);
  }
  protected _multiple: boolean = false;
  static ngAcceptInputType_multiple;

  /**
   * Determines options overlay offset (in pixels).
   **/
  @Input() optionsOverlayOffset = 8;

  /**
   * Determines options overlay scroll strategy.
   **/
  @Input() scrollStrategy = 'block';

  /**
   * Will be emitted when selected value changes.
   */
  @Output() selectedChange: EventEmitter<any> = new EventEmitter();

  /**
   * List of `ROptionComponent`'s components passed as content.
   * TODO maybe it would be better provide wrapper
   */
  @ContentChildren(ROptionComponent, { descendants: true }) options: QueryList<ROptionComponent>;

  /**
   * Custom select label, will be rendered instead of default enumeration with coma.
   */
  @ContentChild(RSelectLabelComponent) customLabel;

  /**
   * RCard with options content.
   */
  @ViewChild(CdkPortal) portal: CdkPortal;

  @ViewChild('selectButton', { read: ElementRef }) button: ElementRef<HTMLButtonElement>;

  /**
   * Determines is select opened.
   */
  @HostBinding('class.open')
  get isOpen(): boolean {
    return this.ref && this.ref.hasAttached();
  }

  /**
   * List of selected options.
   */
  selectionModel: ROptionComponent[] = [];

  /**
   * Current overlay position because of we have to toggle overlayPosition
   * in [ngClass] direction and this directive can use only string.
   */
  overlayPosition = '';

  protected ref: OverlayRef;

  protected triggerStrategy;

  protected alive: boolean = true;

  protected destroy$ = new Subject<void>();

  protected keyManager: FocusKeyManager<ROptionComponent>;

  /**
   * If a user assigns value before content r-options's rendered the value will be putted in this variable.
   * And then applied after content rendered.
   * Only the last value will be applied.
   */
  protected queue;

  /**
   * Function passed through control value accessor to propagate changes.
   */
  protected onChange: Function = () => {};
  protected onTouched: Function = () => {};

  /*
   * @docs-private
   **/
  // status$ = new BehaviorSubject<RComponentOrCustomStatus>(this.status);

  /*
   * @docs-private
   **/
  // size$ = new BehaviorSubject<RComponentSize>(this.size);

  /*
   * @docs-private
   **/
  // focused$ = new BehaviorSubject<boolean>(false);

  /*
   * @docs-private
   **/
  // disabled$ = new BehaviorSubject<boolean>(this.disabled);

  /*
   * @docs-private
   **/
  // fullWidth$ = new BehaviorSubject<boolean>(this.fullWidth);

  constructor(@Inject(DOCUMENT) protected document,
              protected overlay: Overlay,
              protected hostRef: ElementRef<HTMLElement>,
              protected positionBuilder: OverlayPositionBuilder,
              protected cd: ChangeDetectorRef,
              protected triggerStrategyBuilder: RTriggerStrategyBuilderService,
              protected focusKeyManagerFactoryService: RFocusKeyManagerFactoryService<ROptionComponent>,
              protected focusMonitor: FocusMonitor,
              protected renderer: Renderer2,
              protected zone: NgZone) {
  }

  /**
   * Determines is select hidden.
   */
  get isHidden(): boolean {
    return !this.isOpen;
  }

  /**
   * Returns width of the select button.
   */
  get hostWidth(): number {
    return this.button.nativeElement.getBoundingClientRect().width;
  }

  get selectButtonClasses(): string[] {
    const classes = [];

    if (!this.selectionModel.length) {
      classes.push('placeholder');
    }
    if (!this.selectionModel.length && !this.placeholder) {
      classes.push('empty');
    }
    if (this.isOpen) {
      classes.push(this.overlayPosition);
    }

    return classes;
  }

  /**
   * Content rendered in the label.
   */
  get selectionView() {
    if (this.selectionModel.length > 1) {
      return this.selectionModel.map((option: ROptionComponent) => option.content).join(', ');
    }

    return this.selectionModel[0].content;
  }

  ngAfterContentInit() {
    this.options.changes
      .pipe(
        startWith(this.options),
        filter(() => this.queue != null && this.canSelectValue()),
        // Call 'writeValue' when current change detection run is finished.
        // When writing is finished, change detection starts again, since
        // microtasks queue is empty.
        // Prevents ExpressionChangedAfterItHasBeenCheckedError.
        switchMap((options: QueryList<ROptionComponent>) => from(Promise.resolve(options))),
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.writeValue(this.queue));
  }

  ngAfterViewInit() {
    this.triggerStrategy = this.createTriggerStrategy();

    this.subscribeOnButtonFocus();
    this.subscribeOnTriggers();
    this.subscribeOnOptionClick();

    // TODO: #2254
    this.zone.runOutsideAngular(() => setTimeout(() => {
      this.renderer.addClass(this.hostRef.nativeElement, 'r-transition');
    }));
  }

  ngOnDestroy() {
    this.alive = false;

    this.destroy$.next();
    this.destroy$.complete();

    if (this.ref) {
      this.ref.dispose();
    }
    if (this.triggerStrategy) {
      this.triggerStrategy.destroy();
    }
  }

  show() {
    if (this.isHidden) {
      this.attachToOverlay();
      this.setActiveOption();
      this.cd.markForCheck();``
    }
  }

  hide() {
    if (this.isOpen) {
      this.ref.detach();
      this.ref.dispose();
      this.ref = null;
      this.cd.markForCheck();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cd.markForCheck();
  }

  writeValue(value): void {
    if (!this.alive) {
      return;
    }

    if (this.canSelectValue()) {
      this.setSelection(value);
      if (this.selectionModel.length) {
        this.queue = null;
      }
    } else {
      this.queue = value;
    }
  }

  /**
   * Selects option or clear all selected options if value is null.
   */
  protected handleOptionClick(option: ROptionComponent) {
    this.queue = null;
    if (option.value == null) {
      this.reset();
    } else {
      this.selectOption(option);
    }

    this.cd.markForCheck();
  }

  /**
   * Deselect all selected options.
   */
  protected reset() {
    this.selectionModel.forEach((option: ROptionComponent) => option.deselect());
    this.selectionModel = [];
    this.hide();
    this.button.nativeElement.focus();
    this.emitSelected(this.multiple ? [] : null);
  }

  /**
   * Determines how to select option as multiple or single.
   */
  protected selectOption(option: ROptionComponent) {
    if (this.multiple) {
      this.handleMultipleSelect(option);
    } else {
      this.handleSingleSelect(option);
    }
  }

  /**
   * Select single option.
   */
  protected handleSingleSelect(option: ROptionComponent) {
    const selected = this.selectionModel.pop();

    if (selected && !this._compareWith(selected.value, option.value)) {
      selected.deselect();
    }

    this.selectionModel = [option];
    option.select();
    this.hide();
    this.button.nativeElement.focus();

    this.emitSelected(option.value);
  }

  /**
   * Select for multiple options.
   */
  protected handleMultipleSelect(option: ROptionComponent) {
    if (option.selected) {
      this.selectionModel = this.selectionModel.filter(s => !this._compareWith(s.value, option.value));
      option.deselect();
    } else {
      this.selectionModel.push(option);
      option.select();
    }

    this.emitSelected(this.selectionModel.map((opt: ROptionComponent) => opt.value));
  }

  protected attachToOverlay() {
    if (!this.ref) {
      this.createOverlay();
      this.createKeyManager();
      this.subscribeOnOverlayKeys();
    }
    this.ref.attach(this.portal);
  }

  protected setActiveOption() {
    if (this.selectionModel.length) {
      this.keyManager.setActiveItem(this.selectionModel[ 0 ]);
    } else {
      this.keyManager.setFirstItemActive();
    }
  }

  protected createOverlay() {
    const scrollStrategy = this.createScrollStrategy();
    this.positionStrategy = this.createPositionStrategy();
    this.ref = this.overlay.create({
      positionStrategy: this.positionStrategy,
      scrollStrategy,
      panelClass: this.optionsPanelClass,
    });
  }

  protected createKeyManager(): void {
    new FocusKeyManager(this.options)
    this.keyManager = this.focusKeyManagerFactoryService.create(this.options).withTypeAhead(200);
  }

  protected createPositionStrategy() {
    return this.overlay.position()
    .flexibleConnectedTo(this.hostRef.nativeElement)
    .withPush(false)
    .withPositions([{
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top'
    }, {
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom'
    }]);
  }

  protected createScrollStrategy() {
    return this.overlay.scrollStrategies[this.scrollStrategy]();
  }

  protected createTriggerStrategy() {
    return this.triggerStrategyBuilder
      .trigger(RTrigger.CLICK)
      .host(this.hostRef.nativeElement)
      .container(() => this.getContainer())
      .build();
  }

  protected subscribeOnTriggers() {
    this.triggerStrategy.show$.subscribe(() => this.show());
    this.triggerStrategy.hide$
      .pipe(filter(() => this.isOpen))
      .subscribe(($event: Event) => {
        this.hide();
        if (!this.isClickedWithinComponent($event)) {
          this.onTouched();
        }
      });
  }

  protected subscribeOnOptionClick() {
    /**
     * If the user changes provided options list in the runtime we have to handle this
     * and resubscribe on options selection changes event.
     * Otherwise, the user will not be able to select new options.
     */
    this.options.changes
      .pipe(
        startWith(this.options),
        switchMap((options: QueryList<ROptionComponent>) => {
          return merge(...options.map(option => option.click));
        }),
        takeUntil(this.destroy$),
      )
      .subscribe((clickedOption: ROptionComponent) => this.handleOptionClick(clickedOption));
  }

  protected subscribeOnOverlayKeys(): void {
    this.ref.keydownEvents()
      .pipe(
        filter(() => this.isOpen),
        takeUntil(this.destroy$),
      )
      .subscribe((event: KeyboardEvent) => {
        if (event.key === 'escape') {
          this.button.nativeElement.focus();
          this.hide();
        } else {
          this.keyManager.onKeydown(event);
        }
      });

    this.keyManager.tabOut
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.hide();
        this.onTouched();
      });
  }

  protected subscribeOnButtonFocus() {
    this.focusMonitor.monitor(this.button)
      .pipe(
        map(origin => !!origin),
        finalize(() => this.focusMonitor.stopMonitoring(this.button)),
        takeUntil(this.destroy$),
      )
      .subscribe(this.focused$);
  }

  protected getContainer() {
    return this.ref && this.ref.hasAttached() && <ComponentRef<any>> {
      location: {
        nativeElement: this.ref.overlayElement,
      },
    };
  }

  /**
   * Propagate selected value.
   */
  protected emitSelected(selected) {
    this.onChange(selected);
    this.selectedChange.emit(selected);
  }

  /**
   * Set selected value in model.
   */
  protected setSelection(value) {
    const isArray: boolean = Array.isArray(value);

    if (this.multiple && !isArray) {
      throw new Error('Can\'t assign single value if select is marked as multiple');
    }

    if (!this.multiple && isArray) {
      throw new Error('Can\'t assign array if select is not marked as multiple');
    }

    const previouslySelectedOptions = this.selectionModel;
    this.selectionModel = [];

    if (isArray) {
      value.forEach(option => this.selectValue(option));
    } else {
      this.selectValue(value);
    }

    // find options which were selected before and trigger deselect
    previouslySelectedOptions
      .filter((option: ROptionComponent) => !this.selectionModel.includes(option))
      .forEach((option: ROptionComponent) => option.deselect());

    this.cd.markForCheck();
  }

  /**
   * Selects value.
   */
  protected selectValue(value) {
    const corresponding = this.options.find((option: ROptionComponent) => this._compareWith(option.value, value));

    if (corresponding) {
      corresponding.select();
      this.selectionModel.push(corresponding);
    }
  }

  /**
   * Sets touched if focus moved outside of button and overlay,
   * ignoring the case when focus moved to options overlay.
   */
  trySetTouched() {
    if (this.isHidden) {
      this.onTouched();
    }
  }

  protected isClickedWithinComponent($event: Event) {
    return this.hostRef.nativeElement === $event.target || this.hostRef.nativeElement.contains($event.target as Node);
  }

  protected canSelectValue(): boolean {
    return !!(this.options && this.options.length);
  }

  @HostBinding('class.size-tiny')
  get tiny(): boolean {
    return this.size === 'tiny';
  }
  @HostBinding('class.size-small')
  get small(): boolean {
    return this.size === 'small';
  }
  @HostBinding('class.size-medium')
  get medium(): boolean {
    return this.size === 'medium';
  }
  @HostBinding('class.size-large')
  get large(): boolean {
    return this.size === 'large';
  }
  @HostBinding('class.size-giant')
  get giant(): boolean {
    return this.size === 'giant';
  }
  @HostBinding('class.status-primary')
  get primary(): boolean {
    return this.status === 'primary';
  }
  @HostBinding('class.status-info')
  get info(): boolean {
    return this.status === 'info';
  }
  @HostBinding('class.status-success')
  get success(): boolean {
    return this.status === 'success';
  }
  @HostBinding('class.status-warning')
  get warning(): boolean {
    return this.status === 'warning';
  }
  @HostBinding('class.status-danger')
  get danger(): boolean {
    return this.status === 'danger';
  }
  @HostBinding('class.status-basic')
  get basic(): boolean {
    return this.status === 'basic';
  }
  @HostBinding('class.status-control')
  get control(): boolean {
    return this.status === 'control';
  }
  @HostBinding('class.shape-rectangle')
  get rectangle(): boolean {
    return this.shape === 'rectangle';
  }
  @HostBinding('class.shape-round')
  get round(): boolean {
    return this.shape === 'round';
  }
  @HostBinding('class.shape-semi-round')
  get semiRound(): boolean {
    return this.shape === 'semi-round';
  }
}
