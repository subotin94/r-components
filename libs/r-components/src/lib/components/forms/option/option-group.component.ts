import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  HostBinding,
  Input,
  OnDestroy,
  QueryList,
} from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { from, Subject } from 'rxjs';
import { ROptionComponent } from './option.component';

@Component({
  selector: 'r-option-group',
  styleUrls: ['./option-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="option-group-title">{{ title }}</span>
    <ng-content select="r-option, ng-container"></ng-content>
  `,
})
export class ROptionGroupComponent implements AfterContentInit, OnDestroy {

  protected destroy$ = new Subject<void>();

  @Input() title: string;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = Boolean(value);

    if (this.options) {
      this.updateOptionsDisabledState();
    }
  }
  protected _disabled: boolean = false;
  static ngAcceptInputType_disabled;

  @HostBinding('attr.disabled')
  get disabledAttribute(): '' | null {
    return this.disabled ? '' : null;
  }

  @ContentChildren(ROptionComponent, { descendants: true }) options: QueryList<ROptionComponent<any>>;

  ngAfterContentInit() {
    if (this.options.length) {
      this.asyncUpdateOptionsDisabledState();
    }

    this.options.changes
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.asyncUpdateOptionsDisabledState());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Sets disabled state for each option to current group disabled state.
   */
  protected updateOptionsDisabledState(): void {
    this.options.forEach((option: ROptionComponent) => option.setDisabledByGroupState(this.disabled));
  }

  /**
   * Updates options disabled state after promise resolution.
   * This way change detection will be triggered after options state updated.
   * Use this method when updating options during change detection run (e.g. QueryList.changes, lifecycle hooks).
   */
  protected asyncUpdateOptionsDisabledState(): void {
    // Wrap Promise into Observable with `takeUntil(this.destroy$)` to prevent update if component destroyed.
    from(Promise.resolve())
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateOptionsDisabledState());
  }
}
