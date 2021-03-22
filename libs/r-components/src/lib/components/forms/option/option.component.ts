import { FocusableOption } from '@angular/cdk/a11y';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  Optional,
  Output,
  AfterViewInit,
  NgZone,
  Renderer2,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Highlightable } from '@angular/cdk/a11y';
import { R_SELECT_INJECTION_TOKEN } from '../select/select-injection-tokens';

// Component class scoped counter for aria attributes.
let lastOptionId: number = 0;

@Component({
  selector: 'r-option',
  styleUrls: ['./option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <r-checkbox *ngIf="withCheckbox"
                 [checked]="selected"
                 [disabled]="disabled"
                 aria-hidden="true">
    </r-checkbox>
    <ng-content></ng-content>
  `,
})
export class ROptionComponent<T = any> implements OnDestroy, AfterViewInit, FocusableOption, Highlightable {

  protected disabledByGroup = false;

  /**
   * Option value that will be fired on selection.
   * */
  @Input() value: T;

  @Input()
  get disabled(): boolean {
    return this._disabled || this.disabledByGroup;
  }
  set disabled(value: boolean) {
    this._disabled = Boolean(value);
  }
  protected _disabled: boolean = false;
  static ngAcceptInputType_disabled;

  /**
   * Fires value when option selection change.
   * */
  @Output() selectionChange: EventEmitter<ROptionComponent<T>> = new EventEmitter();

  /**
   * Fires when option clicked
   */
  protected click$: Subject<ROptionComponent<T>> = new Subject<ROptionComponent<T>>();
  get click(): Observable<ROptionComponent<T>> {
    return this.click$.asObservable();
  }

  selected: boolean = false;
  protected parent;
  protected alive: boolean = true;

  /**
   * Component scoped id for aria attributes.
   * */
  @HostBinding('attr.id')
  id: string = `r-option-${lastOptionId++}`;

  constructor(@Optional() @Inject(R_SELECT_INJECTION_TOKEN) parent,
              protected elementRef: ElementRef,
              protected cd: ChangeDetectorRef,
              protected zone: NgZone,
              protected renderer: Renderer2) {
    this.parent = parent;
  }

  ngOnDestroy() {
    this.alive = false;
  }

  ngAfterViewInit() {
    // TODO: #2254
    this.zone.runOutsideAngular(() => setTimeout(() => {
      this.renderer.addClass(this.elementRef.nativeElement, 'r-transition');
    }));
  }

  /**
   * Determines should we render checkbox.
   * */
  get withCheckbox(): boolean {
    return this.multiple && this.value != null;
  }

  get content() {
    return this.elementRef.nativeElement.textContent;
  }

  // TODO: replace with isShowCheckbox property to control this behaviour outside, issues/1965
  @HostBinding('class.multiple')
  get multiple() {
    // We check parent existing because parent can be RSelectComponent or
    // RAutocomplete and `multiple` property exists only in RSelectComponent
    return this.parent ? this.parent.multiple : false;
  }

  @HostBinding('class.selected')
  get selectedClass(): boolean {
    return this.selected;
  }

  @HostBinding('attr.disabled')
  get disabledAttribute(): '' | null {
    return this.disabled ? '' : null;
  }

  @HostBinding('tabIndex')
  get tabindex() {
    return '-1';
  }

  @HostBinding('class.active')
  get activeClass() {
    return this._active;
  };
  protected _active: boolean = false;

  @HostListener('click', ['$event'])
  @HostListener('keydown.space', ['$event'])
  @HostListener('keydown.enter', ['$event'])
  onClick(event) {
    this.click$.next(this);

    // Prevent scroll on space click, etc.
    event.preventDefault();
  }

  select() {
    this.setSelection(true);
  }

  deselect() {
    this.setSelection(false);
  }

  /**
   * Sets disabled by group state and marks component for check.
   */
  setDisabledByGroupState(disabled: boolean): void {
    // Check if the component still alive as the option group defer method call so the component may become destroyed.
    if (this.disabledByGroup !== disabled && this.alive) {
      this.disabledByGroup = disabled;
      this.cd.markForCheck();
    }
  }

  protected setSelection(selected: boolean): void {
    /**
     * In case of changing options in runtime the reference to the selected option will be kept in select component.
     * This may lead to exceptions with detecting changes in destroyed component.
     *
     * Also Angular can call writeValue on destroyed view (select implements ControlValueAccessor).
     * angular/angular#27803
     * */
    if (this.alive && this.selected !== selected) {
      this.selected = selected;
      this.selectionChange.emit(this);
      this.cd.markForCheck();
    }
  }

  focus(): void {
    this.elementRef.nativeElement.focus();
  }

  getLabel(): string {
    return this.content;
  }

  setActiveStyles(): void {
    this._active = true;
    this.cd.markForCheck();
  }

  setInactiveStyles(): void {
    this._active = false;
    this.cd.markForCheck();
  }

}