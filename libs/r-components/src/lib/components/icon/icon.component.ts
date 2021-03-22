import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  Renderer2,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { RIconLibraries } from './icon-libraries';

export interface RIconConfig {
  icon: string;
  pack?: string;
  status?;
  options?: { [name: string]: any };
}

@Component({
  selector: 'r-icon',
  styleUrls: [`./icon.component.scss`],
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RIconComponent implements RIconConfig, OnChanges, OnInit {

  protected iconDef;
  protected prevClasses = [];

  @HostBinding('innerHtml')
  html: SafeHtml = '';

  @HostBinding('class.status-primary')
  get primary() {
    return this.status === 'primary';
  }

  @HostBinding('class.status-info')
  get info() {
    return this.status === 'info';
  }

  @HostBinding('class.status-success')
  get success() {
    return this.status === 'success';
  }

  @HostBinding('class.status-warning')
  get warning() {
    return this.status === 'warning';
  }

  @HostBinding('class.status-danger')
  get danger() {
    return this.status === 'danger';
  }

  @HostBinding('class.status-basic')
  get basic() {
    return this.status === 'basic';
  }

  @HostBinding('class.status-control')
  get control() {
    return this.status === 'control';
  }

  /**
   * Icon name
   * @param {string} status
   */
  @Input() icon: string;

  /**
   * Icon pack name
   * @param {string} status
   */
  @Input() pack: string;

  /**
   * Additional icon settings
   * @param {[name: string]: any}
   */
  @Input() options: { [name: string]: any };

  /**
   * Icon status (adds specific styles):
   * `basic`, `primary`, `info`, `success`, `warning`, `danger`, `control`
   */
  @Input() status?;

  /**
   * Sets all icon configurable properties via config object.
   * If passed value is a string set icon name.
   * @docs-private
   */
  @Input()
  get config(): string | RIconConfig {
    return this._config;
  }
  set config(value: string | RIconConfig) {
    if (!value) {
      return;
    }

    this._config = value;

    if (typeof value === 'string') {
      this.icon = value;
    } else {
      this.icon = value.icon;
      this.pack = value.pack;
      this.status = value.status;
      this.options = value.options;
    }
  }
  protected _config: string | RIconConfig;

  constructor(
    protected sanitizer: DomSanitizer,
    protected iconLibrary: RIconLibraries,
    protected el: ElementRef,
    protected renderer: Renderer2,
  ) {}

  ngOnInit() {
    this.iconDef = this.renderIcon(this.icon, this.pack, this.options);
  }

  ngOnChanges() {
    const iconDef = this.iconLibrary.getIcon(this.icon, this.pack);
    if (iconDef) {
      this.renderIcon(this.icon, this.pack, this.options);
    } else {
      this.clearIcon();
    }
  }

  renderIcon(name: string, pack?: string, options?: { [name: string]: any }) {
    const iconDefinition = this.iconLibrary.getIcon(name, pack);

    if (!iconDefinition) {
      return;
    }

    const content = iconDefinition.icon.getContent(options);
    if (content) {
      this.html = this.sanitizer.bypassSecurityTrustHtml(content);
    }

    this.assignClasses(iconDefinition.icon.getClasses(options));
    return iconDefinition;
  }

  protected clearIcon(): void {
    this.html = '';
    this.assignClasses([]);
  }

  protected assignClasses(classes: string[]) {
    this.prevClasses.forEach((className: string) => {
      this.renderer.removeClass(this.el.nativeElement, className);
    });

    classes.forEach((className: string) => {
      this.renderer.addClass(this.el.nativeElement, className);
    });

    this.prevClasses = classes;
  }
}
