import { RFontIconPackParams, RIconPackParams } from './icon-pack';

export interface RIconOptions {
  [name: string]: any;
}

export interface RIcon {
  getClasses(options?: RIconOptions): string[];
  getContent(options?: RIconOptions): string;
}

export class RFontIcon implements RIcon {

  constructor(protected name, protected content: any, protected params: RFontIconPackParams = {}) {}

  getClasses(options?: RIconOptions): string[] {
    const classes = [];

    if (this.params.packClass) {
      classes.push(this.params.packClass);
    }

    const name = this.params.iconClassPrefix ? `${this.params.iconClassPrefix}-${this.name}` : this.name;
    classes.push(name);
    return classes;
  }

  getContent(options?: RIconOptions): string {
    return this.content;
  }
}

export class RSvgIcon implements RIcon {

  constructor(protected name, protected content: any, protected params: RIconPackParams = {}) {}

  getClasses(options?: RIconOptions): string[] {
    const classes = [];

    if (this.params.packClass) {
      classes.push(this.params.packClass);
    }
    return classes;
  }

  getContent(options?: RIconOptions): string {
    return this.content;
  }
}
