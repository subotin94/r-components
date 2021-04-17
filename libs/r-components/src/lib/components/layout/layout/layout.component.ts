import { Component, HostBinding, Input } from '@angular/core';
import { RDrawerMode } from '@r-components/theme';

@Component({
  selector: 'r-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class RLayoutComponent {
  @Input() drawerMode: RDrawerMode = 'side';
  @Input() drawerOpened: boolean = true;
  @Input() drawerContainerAutosize: boolean = false;

  @Input()
  @HostBinding('class.navbar-fixed')
  get navbarFixed(): boolean {
    return this._navbarFixed;
  }
  set navbarFixed(value) {
    this._navbarFixed = Boolean(value);
  }
  private _navbarFixed: boolean;

}
