import { DOCUMENT } from '@angular/common';
import { Component, OnInit, Inject, ComponentFactoryResolver, Injector } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RDocsOverviewComponent } from 'apps/demo/src/app/components/r-docs-overview/r-docs-overview.component';
import { MarkdownService } from 'ngx-markdown';
import * as jsonMd from '../../../../../assets/docs/dialog.json';
import { ActivatedRoute } from '@angular/router';
import { HighlightJS } from 'ngx-highlightjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'r-components-dp-layout',
  templateUrl: './dp-layout.component.html',
  styleUrls: ['./dp-layout.component.scss']
})
export class DpLayoutComponent implements OnInit {
  jsonMd = jsonMd;
  mdHtml: SafeHtml;

  constructor(
    public readonly md: MarkdownService,
    private readonly sanitizer: DomSanitizer,
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly cfr: ComponentFactoryResolver,
    private readonly injector: Injector,
    private readonly route: ActivatedRoute,
    private readonly hljs: HighlightJS,
  ) { }

  ngOnInit() {
    this.mdHtml = this.sanitizer.bypassSecurityTrustHtml(this.md.compile(jsonMd.content));
  }

  ngAfterViewInit() {
    const elements = this.document.querySelectorAll('._example_');
    elements.forEach(el => {
      el.classList.remove('_example_');
      const ref = this.cfr.resolveComponentFactory(RDocsOverviewComponent);
      const componentRef = ref.create(this.injector);
      el.appendChild(componentRef.instance.el.nativeElement);
    });
    document.querySelectorAll('pre code').forEach((block) => {
      this.hljs.highlightBlock(block as HTMLElement);
    });
    this.route.fragment.pipe(
      filter(anchor => Boolean(anchor))
    ).subscribe(anchor => {
      const el = this.document.getElementById(anchor);
      el.scrollIntoView();
    });
  }

}
