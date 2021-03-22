import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RDialog } from '../../popups/dialog';

@Component({
  selector: 'r-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class RLayoutComponent implements OnInit {
  control = new FormControl([1]);
  constructor(public dialog: RDialog) { }

  ngOnInit(): void {
  }

}
