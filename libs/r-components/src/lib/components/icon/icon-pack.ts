import { RIcon } from './icon';

export interface RIcons {
  [key: string]: RIcon | string;
}

export enum RIconPackType  {
  SVG = 'svg',
  FONT = 'font',
}

export interface RIconPackParams {
  packClass?: string,
  [name: string]: any,
}

export interface RFontIconPackParams extends RIconPackParams {
  iconClassPrefix?: string,
}

export interface RIconPack {
  name: string;
  type: RIconPackType;
  icons: Map<string, RIcon | string>;
  params: RIconPackParams,
}
