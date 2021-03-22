import { Injectable } from '@angular/core';
import { RFontIconPackParams, RIconPack, RIconPackParams, RIconPackType, RIcons } from './icon-pack';
import { RFontIcon, RIcon, RSvgIcon } from './icon';

export class RIconDefinition {
  name: string;
  type: string;
  pack: string;
  icon: RIcon;
}

function throwPackNotFoundError(name: string) {
  throw Error(`Icon Pack '${name}' is not registered`);
}

function throwNoDefaultPackError() {
  throw Error('Default pack is not registered.');
}

function throwWrongPackTypeError(name: string, type: string, desiredType: string) {
  throw Error(`Pack '${name}' is not an '${desiredType}' Pack and its type is '${type}'`);
}

/**
 * This service allows to register multiple icon packs to use them later within `<r-icon></r-icon>` component.
 */
@Injectable({providedIn: 'root'})
export class RIconLibraries {

  protected packs: Map<string, RIconPack> = new Map();
  protected defaultPack: RIconPack;

  /**
   * Registers new Svg icon pack
   * @param {string} name
   * @param {RIcon} icons
   * @param {RIconPackParams} params
   */
  registerSvgPack(name: string, icons: RIcons, params: RIconPackParams= {}) {
    this.packs.set(name, {
      name,
      icons: new Map(Object.entries(icons)),
      params,
      type: RIconPackType.SVG,
    });
  }

  /**
   * Registers new font pack
   * @param {string} name
   * @param {RIconPackParams} params
   */
  registerFontPack(name: string, params: RFontIconPackParams = {}) {
    this.packs.set(name, {
      name,
      params,
      icons: new Map(),
      type: RIconPackType.FONT,
    });
  }

  /**
   * Returns pack by name
   * @param {string} name
   */
  getPack(name: string): RIconPack {
    return this.packs.get(name);
  }

  /**
   * Sets pack as a default
   * @param {string} name
   */
  setDefaultPack(name: string) {
    if (!this.packs.has(name)) {
      throwPackNotFoundError(name);
    }

    this.defaultPack = this.packs.get(name);
  }

  /**
   * Returns Svg icon
   * @param {string} name
   * @param {string} pack
   *
   * @returns RIconDefinition
   */
  getSvgIcon(name: string, pack?: string): RIconDefinition | null {
    const iconsPack = pack ? this.getPackOrThrow(pack) : this.getDefaultPackOrThrow();

    if (iconsPack.type !== RIconPackType.SVG) {
      throwWrongPackTypeError(iconsPack.name, iconsPack.type, 'SVG');
    }

    const icon = this.getIconFromPack(name, iconsPack);

    if (!icon) {
      return null;
    }

    return {
      name,
      pack: iconsPack.name,
      type: RIconPackType.SVG,
      icon: this.createSvgIcon(name, icon, iconsPack.params),
    };
  }

  /**
   * Returns Font icon
   * @param {string} name
   * @param {string} pack
   *
   * @returns RIconDefinition
   */
  getFontIcon(name: string, pack?: string): RIconDefinition {
    const iconsPack = pack ? this.getPackOrThrow(pack) : this.getDefaultPackOrThrow();

    if (iconsPack.type !== RIconPackType.FONT) {
      throwWrongPackTypeError(iconsPack.name, iconsPack.type, 'Font');
    }

    const icon = this.getIconFromPack(name, iconsPack);

    return {
      name,
      pack: iconsPack.name,
      type: RIconPackType.FONT,
      icon: this.createFontIcon(name, icon ? icon : '', iconsPack.params),
    };
  }

  /**
   * Returns an icon
   * @param {string} name
   * @param {string} pack
   *
   * @returns RIconDefinition
   */
  getIcon(name: string, pack?: string): RIconDefinition | null {
    const iconsPack = pack ? this.getPackOrThrow(pack) : this.getDefaultPackOrThrow();

    if (iconsPack.type === RIconPackType.SVG) {
      return this.getSvgIcon(name, pack);
    }

    return this.getFontIcon(name, pack);
  }

  protected createSvgIcon(name: string, content: RIcon | string, params: RIconPackParams): RSvgIcon {
    return content instanceof RSvgIcon ? content : new RSvgIcon(name, content, params);
  }

  protected createFontIcon(name: string, content: RIcon | string, params: RFontIconPackParams): RFontIcon {
    return content instanceof RFontIcon ? content : new RFontIcon(name, content, params);
  }

  protected getPackOrThrow(name: string): RIconPack {

    const pack: RIconPack = this.packs.get(name);
    if (!pack) {
      throwPackNotFoundError(name);
    }
    return pack;
  }

  protected getDefaultPackOrThrow(): RIconPack {

    if (!this.defaultPack) {
      throwNoDefaultPackError();
    }
    return this.defaultPack;
  }

  protected getIconFromPack(name: string, pack: RIconPack): RIcon | string | null {
    if (pack.icons.has(name)) {
      return pack.icons.get(name);
    }

    return null;
  }
}
