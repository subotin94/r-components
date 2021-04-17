import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'r-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class RNavbarComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }

  @Input()
  @HostBinding('class.fixed')
  get fixed(): boolean {
    return this._fixed;
  }
  set fixed(value) {
    this._fixed = Boolean(value);
  }
  private _fixed: boolean;

}
