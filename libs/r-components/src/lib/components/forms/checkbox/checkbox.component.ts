import {
  Component,
  Input,
  HostBinding,
  forwardRef,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  Renderer2,
  ElementRef,
  AfterViewInit,
  NgZone,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'r-checkbox',
  template: `
    <label class="label">
      <input type="checkbox" class="native-input visually-hidden"
             [disabled]="disabled"
             [checked]="checked"
             (change)="updateValueAndIndeterminate($event)"
             (blur)="setTouched()"
             (click)="$event.stopPropagation()"
             [indeterminate]="indeterminate">
      <span [class.indeterminate]="indeterminate" [class.checked]="checked" class="custom-checkbox">
        <r-icon *ngIf="indeterminate" icon="minus-bold-outline" pack="nebular-essentials"></r-icon>
        <r-icon *ngIf="checked && !indeterminate" icon="checkmark-bold-outline" pack="nebular-essentials"></r-icon>
      </span>
      <span class="text">
        <ng-content></ng-content>
      </span>
    </label>
  `,
  styleUrls: [ `./checkbox.component.scss` ],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RCheckboxComponent),
    multi: true,
  }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RCheckboxComponent implements AfterViewInit, ControlValueAccessor {

  onChange: any = () => { };
  onTouched: any = () => { };

  @Input()
  get checked(): boolean {
    return this._checked;
  }
  set checked(value: boolean) {
    this._checked = Boolean(value);
  }
  private _checked: boolean = false;
  static ngAcceptInputType_checked;

  /**
   * Controls input disabled state
   */
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = Boolean(value);
  }
  private _disabled: boolean = false;
  static ngAcceptInputType_disabled;

  /**
   * Checkbox status.
   * Possible values are: `basic`, `primary`, `success`, `warning`, `danger`, `info`, `control`.
   */
  @Input() status = 'basic';

  /**
   * Controls checkbox indeterminate state
   */
  @Input()
  get indeterminate(): boolean {
    return this._indeterminate;
  }
  set indeterminate(value: boolean) {
    this._indeterminate = Boolean(value);
  }
  private _indeterminate: boolean = false;
  static ngAcceptInputType_indeterminate;

  /**
   * Output when checked state is changed by a user
   * @type EventEmitter<boolean>
   */
  @Output() checkedChange = new EventEmitter<boolean>();

  @HostBinding('class.status-primary')
  get primary() {
    return this.status === 'primary';
  }

  @HostBinding('class.status-success')
  get success() {
    return this.status === 'success';
  }

  @HostBinding('class.status-warning')
  get warning() {
    return this.status === 'warning';
  }

  @HostBinding('class.status-danger')
  get danger() {
    return this.status === 'danger';
  }

  @HostBinding('class.status-info')
  get info() {
    return this.status === 'info';
  }

  @HostBinding('class.status-basic')
  get basic() {
    return this.status === 'basic';
  }

  @HostBinding('class.status-control')
  get control() {
    return this.status === 'control';
  }

  constructor(
    private changeDetector: ChangeDetectorRef,
    private renderer: Renderer2,
    private hostElement: ElementRef<HTMLElement>,
    private zone: NgZone,
  ) { }

  ngAfterViewInit() {
    // TODO: #2254
    this.zone.runOutsideAngular(() => setTimeout(() => {
      this.renderer.addClass(this.hostElement.nativeElement, 'r-transition');
    }));
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  writeValue(val: any) {
    this._checked = val;
    this.changeDetector.markForCheck();
  }

  setDisabledState(value: boolean) {
    this.disabled = Boolean(value);
    this.changeDetector.markForCheck();
  }

  setTouched() {
    this.onTouched();
  }

  updateValueAndIndeterminate(event: Event): void {
    const input = (event.target as HTMLInputElement);
    this.checked = input.checked;
    this.checkedChange.emit(this.checked);
    this.onChange(this.checked);
    this.indeterminate = input.indeterminate;
  }
}
