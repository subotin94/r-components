import { NgModule } from '@angular/core';
import { RDocsExampleDirective } from './r-docs-example.directive';

@NgModule({
  declarations: [RDocsExampleDirective],
  exports: [RDocsExampleDirective]
})
export class RDocsExampleModule { }