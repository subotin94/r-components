import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RLayoutModule } from '@r-components/theme';
import { DpLayoutRoutingModule } from './dp-layout-routing.module';
import { DpLayoutComponent } from './dp-layout.component';
import { MarkdownModule } from 'ngx-markdown';
import { RDocsExampleModule } from 'apps/demo/src/app/directives/r-docs-example.module';
import { RDocsOverviewModule } from 'apps/demo/src/app/components/r-docs-overview/r-docs-overview.module';
import { RouterModule } from '@angular/router';
import { HighlightModule } from 'ngx-highlightjs';

@NgModule({
  declarations: [
    DpLayoutComponent,
  ],
  imports: [
    CommonModule,
    DpLayoutRoutingModule,
    RLayoutModule,
    RDocsExampleModule,
    MarkdownModule.forChild(),
    HighlightModule,
    RDocsOverviewModule,
    RouterModule,
  ]
})
export class DpLayoutModule { }
