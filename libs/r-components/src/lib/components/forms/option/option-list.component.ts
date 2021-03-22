import { ChangeDetectionStrategy, Component, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'r-option-list',
  template: `
    <ul class="option-list">
      <ng-content></ng-content>
    </ul>
  `,
  styleUrls: ['./option-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ROptionListComponent<T> {

  @Input() size = 'medium';

  // @Input() position: RPosition;

  // @HostBinding('class.position-top')
  // get positionTop(): boolean {
  //   return this.position === RPosition.TOP;
  // }

  // @HostBinding('class.position-bottom')
  // get positionBottom(): boolean {
  //   return this.position === RPosition.BOTTOM;
  // }

  @HostBinding('class.size-tiny')
  get sizeTiny(): boolean {
    return this.size === 'tiny';
  }

  @HostBinding('class.size-small')
  get sizeSmall(): boolean {
    return this.size === 'small';
  }

  @HostBinding('class.size-medium')
  get sizeMedium(): boolean {
    return this.size === 'medium';
  }

  @HostBinding('class.size-large')
  get sizeLarge(): boolean {
    return this.size === 'large';
  }

  @HostBinding('class.size-giant')
  get sizeGiant(): boolean {
    return this.size === 'giant';
  }
}
