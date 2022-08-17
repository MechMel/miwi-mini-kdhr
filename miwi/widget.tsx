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

// SECTION: Contents
export type Contents = _SingleContentTypes | _SingleContentTypes[]; //Text | Bool | Num | Widget | Widget[];
type _SingleContentTypes = string | boolean | number | Icon | Widget;
type _ContentCompilationResults = {
  htmlElements: (JSX.Element | string)[];
  widthGrows: boolean;
  heightGrows: boolean;
  greatestZIndex: number;
};
type _contentCompiler = {
  isThisType: (contents: Contents) => boolean;
  compile: (params: {
    contents: any;
    parent: Widget;
    startZIndex: number;
  }) => _ContentCompilationResults;
};
const _contentCompilers: _contentCompiler[] = [];
const _addNewContentCompiler = (newCompiler: _contentCompiler) =>
  _contentCompilers.push(newCompiler);
export const compileContentsToHtml = function (params: {
  contents: Contents;
  parent: Widget;
  startZIndex: number;
}): _ContentCompilationResults {
  for (const i in _contentCompilers) {
    if (_contentCompilers[i].isThisType(params.contents)) {
      return _contentCompilers[i].compile({
        contents: params.contents,
        parent: params.parent,
        startZIndex: params.startZIndex,
      });
    }
  }
  throw `Encountered an error in "miwi/widget.tsx.compileContentsToHtml". Could not find a content compiler for ${JSON.stringify(
    params.contents,
    null,
    2
  )}`;
};
_addNewContentCompiler({
  isThisType: (contents: Contents) => Array.isArray(contents),
  compile: function (params: {
    contents: _SingleContentTypes[];
    parent: Widget;
    startZIndex: number;
  }): _ContentCompilationResults {
    // We'll split arrays into their individual elements and recurssively convert them to html.
    const myInfo: _ContentCompilationResults = {
      htmlElements: [] as (JSX.Element | string)[],
      widthGrows: false,
      heightGrows: false,
      greatestZIndex: params.startZIndex,
    };
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
    return myInfo;
  },
});

//
//
//
//
//

// SECTION: Widget
/** @About Widgets are the building blocks of UIs. */
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

/** @About Used to put all widget styling in one spot. */
const widgetStyleBuilders: ((params: {
  widget: Widget;
  parent: Widget;
  childrenInfo: _ContentCompilationResults;
  startZIndex: number;
}) => { [key: string]: string | number | boolean | undefined })[] = [];

/** @About Converts a widget to an html element along with some other stats. */
_addNewContentCompiler({
  isThisType: (contents: Contents) => exists((contents as any)?.htmlTag),
  compile: function (params: {
    contents: Widget;
    parent: Widget;
    startZIndex: number;
  }): _ContentCompilationResults {
    // We always return a list of html elements
    const myInfo: _ContentCompilationResults = {
      htmlElements: [] as (JSX.Element | string)[],
      widthGrows: false,
      heightGrows: false,
      greatestZIndex: params.startZIndex,
    };
    const childrenInfo = compileContentsToHtml({
      contents: params.contents.contents,
      parent: params.contents,
      startZIndex: params.startZIndex,
    });
    myInfo.greatestZIndex = childrenInfo.greatestZIndex;
    myInfo.widthGrows = _getSizeGrows(
      params.contents.width,
      childrenInfo.widthGrows
    );
    myInfo.heightGrows = _getSizeGrows(
      params.contents.height,
      childrenInfo.heightGrows
    );
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
            for (const i in widgetStyleBuilders) {
              const newProps = widgetStyleBuilders[i]({
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
    return myInfo;
  },
});

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
const _getSizeGrows = (givenSize: Size, childGrows: boolean) =>
  _isSizeGrowConfig(givenSize) ||
  (givenSize == size2.basedOnContents && childGrows);
function _isSizeGrowConfig(
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
widgetStyleBuilders.push(function (params: {
  widget: Widget;
  parent: Widget;
  childrenInfo: _ContentCompilationResults;
}) {
  const computeSizeInfo = (givenSize: Size, childGrows: boolean) => {
    const sizeGrows = _getSizeGrows(givenSize, childGrows);
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
widgetStyleBuilders.push((params: { widget: Widget }) => {
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
widgetStyleBuilders.push((params: { widget: Widget }) => {
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
widgetStyleBuilders.push(
  (params: { widget: Widget; childrenInfo: _ContentCompilationResults }) => {
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
widgetStyleBuilders.push((params: { widget: Widget; startZIndex: number }) => {
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
widgetStyleBuilders.push((params: { widget: Widget }) => {
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
widgetStyleBuilders.push((params: { widget: Widget }) => {
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
widgetStyleBuilders.push((params: { widget: Widget }) => {
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

// SECTION: Icons
export type Icon = { icon: string; toString: () => string };
export function _isIcon(possibleIcon: any): possibleIcon is Icon {
  return exists(possibleIcon?.icon);
}
export const icons = _iconsObj;
const _inlineContentOpenTag = `$$#@%`;
const _inlineContentCloseTag = `%@#$$`;
_addNewContentCompiler({
  isThisType: (contents: Contents) => exists((contents as any)?.icon),
  compile: function (params: {
    contents: Icon;
    parent: Widget;
    startZIndex: number;
  }): _ContentCompilationResults {
    return {
      htmlElements: [
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
        </span>,
      ],
      widthGrows: false,
      heightGrows: false,
      greatestZIndex: params.startZIndex,
    };
  },
});

//
//
//
//
//

// SECTION: Content Literals
_addNewContentCompiler({
  isThisType: (contents: Contents) =>
    typeof contents === `string` ||
    typeof contents === `number` ||
    typeof contents === `boolean`,
  compile: function (params: {
    contents: string | number | boolean;
    parent: Widget;
    startZIndex: number;
  }): _ContentCompilationResults {
    const myInfo: _ContentCompilationResults = {
      htmlElements: [] as (JSX.Element | string)[],
      widthGrows: false,
      heightGrows: false,
      greatestZIndex: params.startZIndex,
    };
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
    return myInfo;
  },
});

//
//
//
//
//

// SECTION: Widget Template
/** @About This is a shorthand for creating custom widgets */
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
