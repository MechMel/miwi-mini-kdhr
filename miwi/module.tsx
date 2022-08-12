import * as fs from "fs";
import * as React from "react";
import { renderToString } from "react-dom/server";
import {
  contentsToHtml,
  defineWidgetBuilder,
  numToStandardHtmlUnit,
  readonlyObj as readonlyObj,
} from "./utils";

// SECTION: Basic types
export type Num = _ReactiveType<number>;
export type Bool = _ReactiveType<boolean>;
export type Text = _ReactiveType<string>;
type _ReactiveType<T> =
  | {
      value: T;
      onChange: Event;
    }
  | T;

// SECTION: App Data
export type AppData<T> = {
  [Key in keyof T]: _ReactiveType<T[Key]>;
};
export function appData<T>(params: T): AppData<T> {
  return params as any;
}

// SECTION: Widget
export interface Widget {
  width: Size;
  height: Size;
  textColor: Material;
  background: Material;
  cornerRadius: number;
  padding: Padding;
  contentAlign: Align;
  contentAxis: Axis;
  contentSpacing: Spacing;
  contents: Contents;
  htmlTag: string;
  toString: () => string;
}

/*export function isWidget(possibleWidget: any) : possibleWidget is Widget {
}*/

export type Size = number | string;
export const size = readonlyObj({
  exactly: function (num: number): Size {
    return num;
  },
  shrink: -1 as Size,
  grow: Infinity as Size,
});

export type Padding = number; //Num | [Num, Num] | [Num, Num, Num, Num];

export type Align = { x: number; y: number };
export const align = readonlyObj({
  topLeft: { x: -1, y: 1 } as Align,
  topCenter: { x: 0, y: 1 } as Align,
  topRight: { x: 1, y: 1 } as Align,
  centerLeft: { x: -1, y: 0 } as Align,
  center: { x: 0, y: 0 } as Align,
  centerRight: { x: 1, y: 0 } as Align,
  bottomLeft: { x: -1, y: -1 } as Align,
  bottomCenter: { x: 0, y: -1 } as Align,
  bottomRight: { x: 1, y: -1 } as Align,
});

export type Axis = `horizontal` | `vertical`;
export const axis = readonlyObj({
  horizontal: `horizontal` as Axis,
  vertical: `vertical` as Axis,
});

export type Spacing =
  | `space-between`
  | `space-around`
  | `space-evenly`
  | number;
export const spacing = readonlyObj({
  spaceBetween: `space-between` as Spacing,
  spaceAround: `space-around` as Spacing,
  spaceEvenly: `space-evenly` as Spacing,
  exactly: (num: number) => num as Spacing,
});

export type Contents = string | boolean | number | Widget | Widget[]; //Text | Bool | Num | Widget | Widget[];

/** @Note Describes the styling of the background of a widget. */
export type Material = RGB | HSV;
export type HSV = `${number} ${number} ${number}`;
export type RGB = `#${string}`;
export const colors = readonlyObj({
  white: `#ffffffff` as Material,
  pink: `#e91e63ff` as Material,
  red: `#f44336ff` as Material,
  orange: `#ff9800ff` as Material,
  yellow: `#ffea00ff` as Material,
  green: `#4caf50ff` as Material,
  teal: `#009688ff` as Material,
  blue: `#2196f3ff` as Material,
  purple: `#9c27b0ff` as Material,
  brown: `#795548ff` as Material,
  grey: `#9e9e9eff` as Material,
  black: `#000000ff` as Material,
  transparent: `#ffffff00` as Material,
});

/** @Note A box is the simplest UI widget. */
export const box = defineWidgetBuilder({
  width: size.shrink,
  height: size.shrink,
  textColor: colors.black,
  background: colors.transparent,
  cornerRadius: 0,
  padding: 0,
  contentAlign: align.center,
  contentAxis: axis.vertical,
  contentSpacing: 0,
  contents: [],
  htmlTag: `div`,
});

/** @Note Describes a button. */
export const button = defineWidgetBuilder({
  width: size.shrink,
  height: size.shrink,
  textColor: colors.white,
  background: colors.blue,
  cornerRadius: 0.5,
  padding: 0.5,
  contentAlign: align.center,
  contentAxis: axis.vertical,
  contentSpacing: 0,
  contents: `Button`,
  htmlTag: `button`,
});

// SECTION: Compile App
const rootProjectPath = `./`;
const rootOutputPath = `./website`;

const _pageWidget = defineWidgetBuilder({
  width: `100%`,
  height: `100%`,
  textColor: colors.black,
  background: colors.transparent,
  cornerRadius: 0,
  padding: 0,
  contentAlign: align.center,
  contentAxis: axis.vertical,
  contentSpacing: 0,
  contents: [],
  htmlTag: `div`,
});
function _defaultPageParams() {
  const params = _pageWidget() as any;
  params.name = `Untitled`;
  print(params);
  return params as Partial<
    Omit<Widget, `htmlTag` | `width` | `height`> & { name: string }
  >;
}

/** @Note Describes a web page. */
export function page(params = _defaultPageParams()) {
  // Ensure the website dir exists
  if (!fs.existsSync(rootOutputPath)) {
    fs.mkdirSync(rootOutputPath);
  }
  if (!fs.existsSync(`${rootOutputPath}/images`)) {
    fs.mkdirSync(`${rootOutputPath}/images`);
  }

  // Update the favicon
  if (fs.existsSync(`${rootProjectPath}/icon.png`)) {
    fs.writeFileSync(
      `${rootOutputPath}/images/favicon.png`,
      fs.readFileSync(`${rootProjectPath}/icon.png`)
    );
  }

  // Copy the index.html file
  fs.writeFileSync(
    `${rootOutputPath}/index.html`,
    `<!DOCTYPE html>` +
      renderToString(
        <html lang="en">
          <head>
            <meta charSet="UTF-8" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />

            <title>{params.name}</title>
            <link rel="icon" type="image/png" href="images/favicon.png" />

            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link
              rel="preconnect"
              href="https://fonts.gstatic.com"
              crossOrigin=""
            />
            <link
              href="https://fonts.googleapis.com/css2?family=Roboto&display=swap"
              rel="stylesheet"
            />
          </head>
          <body
            style={{
              margin: 0,
              padding: 0,
              width: `100vw`,
              height: `100vh`,
              display: `flex`,
              justifyContent: `center`,
              alignItems: `center`,
            }}
          >
            <div
              style={{
                width: `45vmin`,
                height: `75vmin`,
                border: `${numToStandardHtmlUnit(0.5)} solid black`,
                borderRadius: `${numToStandardHtmlUnit(0.5)}`,
              }}
            >
              {contentsToHtml(_pageWidget(params))}
            </div>
          </body>
        </html>
      )
  );
}

export function print(message: any) {
  console.log(message);
}
