import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'r-components-docs-overview',
  templateUrl: './r-docs-overview.component.html',
  styleUrls: ['./r-docs-overview.component.scss']
})
export class RDocsOverviewComponent implements OnInit {

  constructor(public readonly el: ElementRef) { }

  ngOnInit(): void {
  }

}
