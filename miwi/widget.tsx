import * as fs from "fs";
import * as path from "path";
import * as React from "react";
import { renderToString } from "react-dom/server";
import { _iconsObj, _numIconTag } from "./mdIcons";
import {
  exists,
  numToStandardHtmlUnit,
  readonlyObj,
  print,
  numToFontSize,
  numToIconSize,
  isString,
} from "./utils";

//
//
//
//
//

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
  //interaction: { onTap: function() {}, onDoubleTap: function() {}, onLongPress: function() {}, }
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

//
//
//
//
//

const cssStyleBuilders: ((params: {
  widget: Widget;
  parent: Widget;
  childrenInfo: ContentCompilationResults;
  startZIndex: number;
}) => Partial<_CssProps>)[] = [];

//
//
//
//
//

// SECTION: Width & Height
export type Size = number | string | _SizeGrowConfig;
type _SizeGrowConfig = {
  flex: number;
};
export function _isSizeGrowConfig(
  possibleGrowth: any
): possibleGrowth is _SizeGrowConfig {
  return exists(possibleGrowth.flex);
}
export const size2 = readonlyObj({
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
cssStyleBuilders.push(function (params: {
  widget: Widget;
  parent: Widget;
  childrenInfo: ContentCompilationResults;
}) {
  const computeSizeInfo = (givenSize: Size, childGrows: boolean) => {
    const sizeGrows =
      _isSizeGrowConfig(givenSize) ||
      (givenSize == size2.basedOnContents && childGrows);
    const exactSize = isString(givenSize)
      ? givenSize
      : givenSize !== size2.basedOnContents && !sizeGrows
      ? numToStandardHtmlUnit(givenSize as number)
      : undefined;
    return [exactSize, sizeGrows];
  };
  const [exactWidth, widthGrows] = computeSizeInfo(
    params.widget.width,
    params.childrenInfo.widthGrows
  );
  const [exactHeight, heightGrows] = computeSizeInfo(
    params.widget.height,
    params.childrenInfo.heightGrows
  );
  return {
    // Using minWidth and maxWidth tells css to not override the size of this element
    width: exactWidth,
    minWidth: exactWidth,
    maxWidth: exactWidth,
    height: exactHeight,
    minHeight: exactHeight,
    maxHeight: exactHeight,
    flexGrow:
      params.parent.contentAxis === axis.vertical
        ? _isSizeGrowConfig(params.widget.height)
          ? params.widget.height.flex
          : heightGrows
          ? 1
          : undefined
        : _isSizeGrowConfig(params.widget.width)
        ? params.widget.width.flex
        : widthGrows
        ? 1
        : undefined,
    alignSelf:
      (params.parent.contentAxis === axis.horizontal && heightGrows) ||
      (params.parent.contentAxis === axis.vertical && widthGrows)
        ? `stretch`
        : undefined,
  };
});

//
//
//
//
//

// SECTION: Box Decoration
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
cssStyleBuilders.push((params: { widget: Widget }) => {
  const _isMaterialImage = (material: Material): material is ImageRef =>
    material[0] !== `#`;
  return {
    // Corner Radius
    borderRadius: numToStandardHtmlUnit(params.widget.cornerRadius),

    // Background
    backgroundColor: _isMaterialImage(params.widget.background)
      ? undefined
      : params.widget.background,
    backgroundImage: _isMaterialImage(params.widget.background)
      ? `url(${params.widget.background})`
      : undefined,
    backgroundPosition: _isMaterialImage(params.widget.background)
      ? `center`
      : undefined,
    backgroundSize: _isMaterialImage(params.widget.background)
      ? `cover`
      : undefined,
    backgroundRepeat: `no-repeat`,
    backgroundAttachment: `local`,

    // Shadow
    boxShadow: `${numToStandardHtmlUnit(
      0.12 * params.widget.shadowSize * params.widget.shadowDirection.x
    )} ${numToStandardHtmlUnit(
      -0.12 * params.widget.shadowSize * params.widget.shadowDirection.y
    )} ${numToStandardHtmlUnit(
      0.225 * params.widget.shadowSize
    )} ${numToStandardHtmlUnit(0)} ${colors.grey}`,
  };
});

//
//
//
//
//

// SECTION: Padding
export type Padding = number; //Num | [Num, Num] | [Num, Num, Num, Num];
cssStyleBuilders.push((params: { widget: Widget }) => {
  return {
    padding: numToStandardHtmlUnit(params.widget.padding),
  };
});

//
//
//
//
//

// SECTION: Content Align
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
cssStyleBuilders.push(
  (params: { widget: Widget; childrenInfo: ContentCompilationResults }) => {
    return {
      // Content Alignment: https://css-tricks.com/snippets/css/a-guide-to-flexbox/
      justifyContent:
        // Exact spacing is handled through grid gap
        typeof params.widget.contentSpacing === `number`
          ? params.widget.contentAxis === axis.vertical
            ? params.widget.contentAlign.y === 1
              ? `flex-start`
              : params.widget.contentAlign.y === 0
              ? `safe center`
              : `flex-end`
            : params.widget.contentAlign.x === -1
            ? `flex-start`
            : params.widget.contentAlign.x === 0
            ? `safe center`
            : `flex-end`
          : params.widget.contentSpacing === spacing.spaceBetween &&
            params.childrenInfo.htmlElements.length === 1
          ? // For whatever reason, space-between with one item puts it at the start instead of centering it.
            spacing.spaceAround
          : params.widget.contentSpacing,
      alignItems:
        params.widget.contentAxis === axis.vertical
          ? params.widget.contentAlign.x === -1
            ? `flex-start`
            : params.widget.contentAlign.x === 0
            ? `safe center`
            : `flex-end`
          : params.widget.contentAlign.y === 1
          ? `flex-start`
          : params.widget.contentAlign.y === 0
          ? `safe center`
          : `flex-end`,
      textAlign:
        params.widget.contentAlign.x === -1
          ? `left`
          : params.widget.contentAlign.x === 0
          ? `center`
          : `right`,
    };
  }
);

//
//
//
//
//

// SECTION: Content Axis
export type Axis = `horizontal` | `vertical` | `z`;
export const axis = readonlyObj({
  horizontal: `horizontal` as Axis,
  vertical: `vertical` as Axis,
  z: `z` as Axis,
});
cssStyleBuilders.push((params: { widget: Widget; startZIndex: number }) => {
  return {
    flexDirection:
      params.widget.contentAxis === axis.vertical ? `column` : `row`,
    zIndex: params.startZIndex,
  };
});

//
//
//
//
//

// SECTION: Content Is Scrollable
cssStyleBuilders.push((params: { widget: Widget }) => {
  return {
    overflowX: params.widget.contentIsScrollableX
      ? `overlay` // Scroll when nesscary, and float above contents
      : undefined, //`hidden`,
    overflowY: params.widget.contentIsScrollableY
      ? `auto` // Scroll when nesscary, and float above contents
      : undefined, //`hidden`,
    scrollbarWidth: `thin`,
    scrollbarColor: `#e3e3e3 transparent`,
  };
});

//
//
//
//
//

// SECTION: Content Spacing
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
cssStyleBuilders.push((params: { widget: Widget }) => {
  return {
    rowGap:
      params.widget.contentAxis === axis.vertical &&
      typeof params.widget.contentSpacing === `number`
        ? numToStandardHtmlUnit(params.widget.contentSpacing)
        : undefined,
    columnGap:
      params.widget.contentAxis === axis.horizontal &&
      typeof params.widget.contentSpacing === `number`
        ? numToStandardHtmlUnit(params.widget.contentSpacing)
        : undefined,
  };
});

//
//
//
//
//

// SECTION: Text Style
cssStyleBuilders.push((params: { widget: Widget }) => {
  return {
    fontSize: numToFontSize(params.widget.textSize),
    fontWeight: params.widget.textIsBold ? `bold` : undefined,
    fontStyle: params.widget.textIsItalic ? `italic` : undefined,
    color: params.widget.textColor,
  };
});

//
//
//
//
//

// SECTION: Contents
export type Contents = _SingleContentTypes | _SingleContentTypes[]; //Text | Bool | Num | Widget | Widget[];
type _SingleContentTypes = string | boolean | number | Icon | Widget;
export type Icon = { icon: string; toString: () => string };
export function _isIcon(possibleIcon: any): possibleIcon is Icon {
  return exists(possibleIcon?.icon);
}
export const icons = _iconsObj;
export const _inlineContentOpenTag = `$$#@%`;
export const _inlineContentCloseTag = `%@#$$`;

//
//
//
//
//

// SECTION: Widget Template
/** @see This is a shorthand for creating custom widgets */
export function widgetTemplate<T extends Required<Omit<Widget, `toString`>>>(
  defaultParams: T
): Required<Widget> & {
  (params?: Partial<Omit<Widget, `htmlTag`>>): Required<Widget>;
} {
  const build: any = function (
    invocationParams?: Partial<Omit<Widget, `htmlTag`>>
  ): Required<Widget> {
    const newWidget: any = {};
    for (const key in defaultParams) {
      newWidget[key] =
        (invocationParams as any)?.[key] ?? (defaultParams as any)[key];
    }
    newWidget.toString = function (): string {
      return `$$#@%${JSON.stringify(newWidget)}%@#$$`;
      /*return renderToString(
        contentsToHtmlWithInfo(newWidget).htmlElements[0] as any
      );*/
    };
    return newWidget;
  };
  for (const key in defaultParams) {
    build[key] = defaultParams[key];
  }
  return build as Required<Widget> & {
    (params?: Partial<Omit<Widget, `htmlTag`>>): Required<Widget>;
  };
}

//
//
//
//
//

// SECTION: Compile Contents
// We specify all the style props we use here, so we can make sure we account for them everywhere else
type _CssProps = {
  // Width & Height
  width: string | number | boolean;
  minWidth: string | number | boolean;
  maxWidth: string | number | boolean;
  height: string | number | boolean;
  minHeight: string | number | boolean;
  maxHeight: string | number | boolean;
  flexGrow: string | number | boolean;
  alignSelf: string | number | boolean;

  // Text Size
  fontSize: string | number | boolean;

  // Text is Bold
  fontWeight: string | number | boolean;

  // Text is Italic
  fontStyle: string | number | boolean;

  // Text Color
  color: string | number | boolean;

  // Corner Radius
  borderRadius: string | number | boolean;

  // Background
  backgroundColor: string | number | boolean;
  backgroundImage: string | number | boolean;
  backgroundPosition: string | number | boolean;
  backgroundSize: string | number | boolean;
  backgroundRepeat: string | number | boolean;
  backgroundAttachment: string | number | boolean;

  // Shadow
  boxShadow: string | number | boolean;

  // Padding
  margin: string | number | boolean;
  padding: string | number | boolean;

  // Content Align
  justifyContent: string | number | boolean;
  alignItems: string | number | boolean;
  textAlign: string | number | boolean;

  // Content Axis
  flexDirection: string | number | boolean;
  zIndex: string | number | boolean;

  // Content Is Scrollable
  overflowX: string | number | boolean;
  overflowY: string | number | boolean;
  scrollbarWidth: string | number | boolean;
  scrollbarColor: string | number | boolean;

  // Content Spacing
  rowGap: string | number | boolean;
  columnGap: string | number | boolean;
};
type ContentCompilationResults = {
  htmlElements: (JSX.Element | string)[];
  widthGrows: boolean;
  heightGrows: boolean;
  greatestZIndex: number;
};
export const compileContentsToHtml = function (params: {
  contents: Contents;
  // We default to horizontal because widget.toString() is mainly called when embeding widgets in text.
  parent: Widget;
  startZIndex: number;
}): ContentCompilationResults {
  // We always return a list of html elements
  const myInfo: ContentCompilationResults = {
    htmlElements: [] as (JSX.Element | string)[],
    widthGrows: false,
    heightGrows: false,
    greatestZIndex: params.startZIndex,
  };

  // Compile Cotent Lists
  // We'll split arrays into their individual elements and recurssively convert them to html.
  if (Array.isArray(params.contents)) {
    for (let i in params.contents) {
      const thisWidgetInfo = compileContentsToHtml({
        contents: params.contents[i],
        parent: params.parent,
        startZIndex:
          params.parent.contentAxis === axis.z
            ? myInfo.greatestZIndex + 1
            : params.startZIndex,
      });
      myInfo.htmlElements.push(thisWidgetInfo.htmlElements[0]);
      myInfo.widthGrows = thisWidgetInfo.widthGrows || myInfo.widthGrows;
      myInfo.heightGrows = thisWidgetInfo.heightGrows || myInfo.heightGrows;
      myInfo.greatestZIndex = Math.max(
        myInfo.greatestZIndex,
        thisWidgetInfo.greatestZIndex
      );
    }

    // Compile Literal Content
  } else if (
    typeof params.contents === `string` ||
    typeof params.contents === `number` ||
    typeof params.contents === `boolean`
  ) {
    const paragraphParts: (string | JSX.Element)[] = [];
    if (typeof params.contents === `string`) {
      const contentsAsString = params.contents;
      let openTagIndex = contentsAsString.indexOf(_inlineContentOpenTag);
      let closeTagIndex = 0 - _inlineContentCloseTag.length;
      while (openTagIndex >= 0) {
        // Read in any trailing text
        if (openTagIndex - closeTagIndex + _inlineContentCloseTag.length > 0) {
          paragraphParts.push(
            contentsAsString.substring(
              closeTagIndex + _inlineContentCloseTag.length,
              openTagIndex
            )
          );
        }
        closeTagIndex =
          openTagIndex +
          contentsAsString
            .substring(openTagIndex)
            .indexOf(_inlineContentCloseTag);
        const embededContentInfo = compileContentsToHtml({
          contents: JSON.parse(
            contentsAsString.substring(
              openTagIndex + _inlineContentOpenTag.length,
              closeTagIndex
            )
          ) as Widget,
          parent: params.parent,
          startZIndex: params.startZIndex,
        });
        myInfo.greatestZIndex = Math.max(
          myInfo.greatestZIndex,
          embededContentInfo.greatestZIndex
        );
        const embededContentElement = embededContentInfo.htmlElements[0];
        paragraphParts.push(embededContentElement);
        openTagIndex = contentsAsString
          .substring(closeTagIndex)
          .indexOf(_inlineContentOpenTag);
        if (openTagIndex >= 0) {
          openTagIndex += closeTagIndex;
        }
      }
      if (
        closeTagIndex + _inlineContentCloseTag.length <
        contentsAsString.length
      ) {
        paragraphParts.push(
          contentsAsString.substring(
            closeTagIndex + _inlineContentCloseTag.length,
            contentsAsString.length
          )
        );
      }
    } else {
      paragraphParts.push(params.contents.toString());
    }
    myInfo.htmlElements.push(
      <p
        style={{
          color: params.parent.textColor,
          fontFamily: `Roboto`,
          fontSize: numToFontSize(params.parent.textSize),
          fontWeight: params.parent.textIsBold ? `bold` : undefined,
          fontStyle: params.parent.textIsItalic ? `italic` : undefined,
          textAlign:
            params.parent.contentAlign.x === -1
              ? `left`
              : params.parent.contentAlign.x === 0
              ? `center`
              : `right`,
          margin: 0,
          padding: 0,
          zIndex: params.startZIndex,
        }}
      >
        {paragraphParts}
      </p>
    );

    // Compile Icon Content
  } else if (_isIcon(params.contents)) {
    myInfo.htmlElements.push(
      <span
        className="material-symbols-outlined"
        style={{
          width: numToIconSize(params.parent.textSize),
          height: numToIconSize(params.parent.textSize),
          color: params.parent.textColor,
          display: `inline-block`,
          verticalAlign: `middle`,
          textAlign: `center`,
          fontSize: numToIconSize(params.parent.textSize),
        }}
      >
        {params.contents.icon.startsWith(_numIconTag)
          ? params.contents.icon.substring(_numIconTag.length)
          : params.contents.icon}
      </span>
    );

    // Compile Widget
  } else {
    const childrenInfo = compileContentsToHtml({
      contents: params.contents.contents,
      parent: params.contents,
      startZIndex: params.startZIndex,
    });
    myInfo.greatestZIndex = childrenInfo.greatestZIndex;
    myInfo.widthGrows =
      _isSizeGrowConfig(params.contents.width) ||
      (params.contents.width == size2.basedOnContents &&
        childrenInfo.widthGrows);
    myInfo.heightGrows =
      _isSizeGrowConfig(params.contents.height) ||
      (params.contents.height == size2.basedOnContents &&
        childrenInfo.heightGrows);
    myInfo.htmlElements.push(
      React.createElement(
        params.contents.htmlTag,
        {
          style: (function () {
            const styleSoFar = {
              // Universal Styling
              display: `flex`,
              boxSizing: `border-box`,
              border: `none`,
              fontFamily: `Roboto`,
              margin: 0,
            };
            for (const i in cssStyleBuilders) {
              const newProps = cssStyleBuilders[i]({
                widget: params.contents,
                parent: params.parent,
                childrenInfo: childrenInfo,
                startZIndex: params.startZIndex,
              });
              for (const key in newProps) {
                (styleSoFar as any)[key] = (newProps as any)[key];
              }
            }
            return styleSoFar;
          })(),
        },

        // Contents
        childrenInfo.htmlElements
      )
    );
  }

  return myInfo;
};

//
//
//
//
//

// SECTION: Compile Page
const rootProjectPath = `./`;
const rootOutputPath = `./website`;

export const _pageWidthVmin = 40;
const _pageWidget = widgetTemplate({
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
        const _imageExtensions = [`.ico`, `.svg`, `.png`, `.jpg`, `.jpeg`];
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
                width: `${_pageWidthVmin + 4}vmin`,
                height: `4vmin`,
                backgroundColor: colors.black,
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
                margin: 0,
                padding: 0,
                display: `flex`,
                justifyContent: `center`,
                alignItems: `center`,
                flexDirection: `row`,
              }}
            >
              <div
                style={{
                  width: `2vmin`,
                  height: `75vmin`,
                  backgroundColor: colors.black,
                  display: `flex`,
                  justifyContent: `center`,
                  alignItems: `center`,
                }}
              ></div>
              <div
                style={{
                  width: `${_pageWidthVmin}vmin`,
                  height: `75vmin`,
                  //border: `${numToStandardHtmlUnit(0.75)} solid black`,
                  margin: 0,
                  padding: 0,
                  //overflow: `hidden`,
                }}
              >
                {
                  compileContentsToHtml({
                    contents: _pageWidget(params),
                    parent: {
                      width: size2.basedOnContents,
                      height: size2.basedOnContents,
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
                      textSize: 1,
                      textIsBold: false,
                      textIsItalic: false,
                      textColor: colors.black,
                      contents: [],
                      htmlTag: `div`,
                    },
                    startZIndex: 0,
                  }).htmlElements
                }
              </div>
              <div
                style={{
                  width: `2vmin`,
                  height: `75vmin`,
                  backgroundColor: colors.black,
                  display: `flex`,
                  justifyContent: `center`,
                  alignItems: `center`,
                }}
              ></div>
            </div>

            <div
              style={{
                width: `${_pageWidthVmin + 4}vmin`,
                height: `4vmin`,
                backgroundColor: colors.black,
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
