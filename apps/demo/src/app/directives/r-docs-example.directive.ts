import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: 'r-docs-example'
})
export class RDocsExampleDirective {
  constructor(el: ElementRef) {
    console.log(el)
  }
}