import * as fs from "fs";
import * as path from "path";
import * as React from "react";
import { renderToString } from "react-dom/server";
import { _iconsObj } from "./mdIcons";
import {
  contentsToHtmlWithInfo,
  defineWidgetBuilder,
  exists,
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
  textSize: number;
  textIsBold: boolean;
  textIsItalic: boolean;
  textColor: RGB;
  cornerRadius: number;
  background: Material;
  shadowSize: number;
  shadowDirection: Align;
  padding: Padding;
  contentAlign: Align;
  contentAxis: Axis;
  contentIsScrollableX: boolean;
  contentIsScrollableY: boolean;
  contentSpacing: Spacing;
  contents: Contents;
  htmlTag: string;
  toString: () => string;
}

/*export function isWidget(possibleWidget: any) : possibleWidget is Widget {
}*/

export type Size = number | string | _SizeGrowConfig;
export const size = readonlyObj({
  exactly: function (num: number): Size {
    return num;
  },
  basedOnContents: -1 as Size,
  grow: (function () {
    const buildGrowth = function (flex: number) {
      return { flex: flex };
    };
    buildGrowth.flex = 1;
    return buildGrowth;
  })(),
});
type _SizeGrowConfig = {
  flex: number;
};
export function _isSizeGrowConfig(
  possibleGroth: any
): possibleGroth is _SizeGrowConfig {
  return exists(possibleGroth.flex);
}

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

export type Contents = _SingleContentTypes | _SingleContentTypes[]; //Text | Bool | Num | Widget | Widget[];
type _SingleContentTypes = string | boolean | number | Icon | Widget;
export type Icon = { icon: string; toString: () => string };
export function _isIcon(possibleIcon: any): possibleIcon is Icon {
  return exists(possibleIcon?.icon);
}
export const icons = _iconsObj;
export const _inlineContentOpenTag = `$$#@%`;
export const _inlineContentCloseTag = `%@#$$`;

/** @Note Describes the styling of the background of a widget. */
export type Material = RGB | ImageRef;
//export type HSV = `${number} ${number} ${number}`;
export type RGB = `#${string}`;
export const colors = readonlyObj({
  white: `#ffffffff` as RGB,
  almostWhite: `#f9fafdff` as RGB,
  pink: `#e91e63ff` as RGB,
  red: `#f44336ff` as RGB,
  orange: `#ff9800ff` as RGB,
  yellow: `#ffea00ff` as RGB,
  green: `#4caf50ff` as RGB,
  teal: `#009688ff` as RGB,
  blue: `#2196f3ff` as RGB,
  purple: `#9c27b0ff` as RGB,
  brown: `#795548ff` as RGB,
  grey: `#9e9e9eff` as RGB,
  black: `#000000ff` as RGB,
  transparent: `#ffffff00` as RGB,
});
export type ImageRef = string;
const _imageExtensions = [`.ico`, `.svg`, `.png`, `.jpg`, `.jpeg`];
export function _isMaterialImage(material: Material): material is ImageRef {
  return material[0] !== `#`;
}

/** @Note A box is the simplest UI widget. */
export const box = defineWidgetBuilder({
  width: size.basedOnContents,
  height: size.basedOnContents,
  textSize: 1,
  textIsBold: false,
  textIsItalic: false,
  textColor: colors.black,
  cornerRadius: 0,
  background: colors.transparent,
  shadowSize: 0,
  shadowDirection: align.center,
  padding: 0,
  contentAlign: align.center,
  contentAxis: axis.vertical,
  contentIsScrollableX: false,
  contentIsScrollableY: false,
  contentSpacing: 0,
  contents: [],
  htmlTag: `div`,
});

/** @Note Describes a button. */
export const button = defineWidgetBuilder({
  width: size.basedOnContents,
  height: size.basedOnContents,
  textSize: 1,
  textIsBold: false,
  textIsItalic: false,
  textColor: colors.white,
  cornerRadius: 0.5,
  background: colors.blue,
  shadowSize: 0,
  shadowDirection: align.bottomRight,
  padding: 0.5,
  contentAlign: align.center,
  contentAxis: axis.horizontal,
  contentIsScrollableX: false,
  contentIsScrollableY: false,
  contentSpacing: 0,
  contents: `Button`,
  htmlTag: `button`,
});

/** @Note An app bar is the colored bar at the top of a lot of apps. */
export const appBar = defineWidgetBuilder({
  width: size.grow,
  height: size.basedOnContents,
  textSize: 2,
  textIsBold: true,
  textIsItalic: false,
  textColor: colors.white,
  cornerRadius: 0,
  background: colors.blue,
  shadowSize: 2,
  shadowDirection: align.bottomCenter,
  padding: 1,
  contentAlign: align.center,
  contentAxis: axis.horizontal,
  contentIsScrollableX: false,
  contentIsScrollableY: false,
  contentSpacing: spacing.spaceBetween,
  contents: `Untitled`,
  htmlTag: `nav`,
});

// SECTION: Compile App
const rootProjectPath = `./`;
const rootOutputPath = `./website`;

export const _pageWidthVmin = 40;
const _pageWidget = defineWidgetBuilder({
  width: `100%`,
  height: `100%`,
  textSize: 2,
  textIsBold: true,
  textIsItalic: false,
  textColor: colors.black,
  cornerRadius: 0,
  background: colors.almostWhite,
  shadowSize: 0,
  shadowDirection: align.center,
  padding: 0,
  contentAlign: align.topCenter,
  contentAxis: axis.vertical,
  contentIsScrollableX: false,
  contentIsScrollableY: false,
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

  // Remove old website content
  removeOldWebsite();
  function removeOldWebsite(dir = rootOutputPath) {
    const allFiles = fs.readdirSync(dir);
    for (const i in allFiles) {
      const absoluteFilePath = path.resolve(dir, allFiles[i]);
      const fileStats = fs.statSync(absoluteFilePath);
      if (fileStats.isDirectory()) {
        removeOldWebsite(absoluteFilePath);
        fs.rmdirSync(absoluteFilePath);
      } else {
        if (allFiles[i] != `index.html`) {
          fs.unlinkSync(absoluteFilePath);
        }
      }
    }
  }

  // Copy all the images in
  const _dirBlackList = [`miwi`, `website`, `.vscode`, `node_modules`, `.git`];
  copyAllImages();
  function copyAllImages(dir = rootProjectPath) {
    const allFiles = fs.readdirSync(dir);
    for (const i in allFiles) {
      const absoluteFilePath = path.resolve(dir, allFiles[i]);
      const fileStats = fs.statSync(absoluteFilePath);
      if (fileStats.isDirectory()) {
        if (!_dirBlackList.includes(allFiles[i])) {
          const newDirPath = path.resolve(rootOutputPath, dir, allFiles[i]);
          if (!fs.existsSync(newDirPath)) {
            fs.mkdirSync(path.resolve(rootOutputPath, dir, allFiles[i]));
          }
          copyAllImages(`${dir}/${allFiles[i]}`);
        }
      } else {
        if (_imageExtensions.includes(path.extname(allFiles[i]))) {
          fs.writeFileSync(
            path.resolve(rootOutputPath, dir, allFiles[i]),
            fs.readFileSync(absoluteFilePath)
          );
        }
      }
    }
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
            <link rel="icon" type="image/png" href="/favicon.png" />

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
            <link
              rel="stylesheet"
              href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,1,0"
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
              flexDirection: `column`,
            }}
          >
            <div
              style={{
                width: `${_pageWidthVmin}vmin`,
                height: `1vmin`,
                backgroundColor: colors.black,
                border: `${numToStandardHtmlUnit(0.75)} solid black`,
                borderRadius: `${numToStandardHtmlUnit(
                  1
                )} ${numToStandardHtmlUnit(1)} 0 0`,
                display: `flex`,
                justifyContent: `center`,
                alignItems: `center`,
              }}
            ></div>
            <div
              style={{
                width: `${_pageWidthVmin}vmin`,
                height: `75vmin`,
                border: `${numToStandardHtmlUnit(0.75)} solid black`,
                margin: 0,
                padding: 0,
                overflow: `hidden`,
              }}
            >
              {
                contentsToHtmlWithInfo({
                  contents: _pageWidget(params),
                  parent: box(),
                }).htmlElements
              }
            </div>
            <div
              style={{
                width: `${_pageWidthVmin}vmin`,
                height: `1vmin`,
                backgroundColor: colors.black,
                border: `${numToStandardHtmlUnit(0.75)} solid black`,
                borderRadius: `0 0 ${numToStandardHtmlUnit(
                  1
                )} ${numToStandardHtmlUnit(1)}`,
              }}
            ></div>
          </body>
        </html>
      )
  );
}

export function print(message: any) {
  console.log(message);
}
