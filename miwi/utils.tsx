import { _numIconTag } from "./mdIcons";
import {
  _isSizeGrowConfig,
  _inlineContentOpenTag,
  _inlineContentCloseTag,
  _isIcon,
  _pageWidthVmin,
} from "./widget";

export function readonlyObj<T>(obj: T): Readonly<T> {
  return obj;
}

export function numToFontSize(num: number) {
  return numToStandardHtmlUnit(0.825 * num);
}

export function numToIconSize(num: number) {
  return numToStandardHtmlUnit(0.9 * num);
}

export function numToStandardHtmlUnit(num: number) {
  return `${num * (_pageWidthVmin / 24)}vmin`;
}

export function exists(obj: any) {
  return obj !== undefined && obj !== null;
}

export function print(message: any) {
  console.log(message);
}

export function isString(possibleString: any): possibleString is string {
  return typeof possibleString === `string`;
}
