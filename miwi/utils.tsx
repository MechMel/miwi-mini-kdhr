import * as React from "react";
import { renderToString } from "react-dom/server";
import { _numIconTag } from "./mdIcons";
import {
  Contents,
  Widget,
  print,
  size,
  axis,
  Axis,
  colors,
  _isSizeGrowConfig,
  _pageWidthVmin,
  spacing,
  _isMaterialImage,
  _inlineContentOpenTag,
  _inlineContentCloseTag,
  button,
  _isIcon,
  RGB,
} from "./module";

export function readonlyObj<T>(obj: T): Readonly<T> {
  return obj;
}

// Utilitiy Classes: https://www.typescriptlang.org/docs/handbook/utility-types.html
export function defineWidgetBuilder<
  T extends Required<Omit<Widget, `toString`>>
>(
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

export function contentsToHtmlWithInfo(params: {
  contents: Contents;
  // We default to horizontal because widget.toString() is mainly called when embeding widgets in text.
  parent: Widget;
}): {
  htmlElements: (JSX.Element | string)[];
  widthGrows: boolean;
  heightGrows: boolean;
} {
  // We always return a list of html elements
  const myInfo = {
    htmlElements: [] as (JSX.Element | string)[],
    widthGrows: false,
    heightGrows: false,
  };

  // We'll split arrays into their individual elements and recurssively convert them to html.
  if (Array.isArray(params.contents)) {
    for (let i in params.contents) {
      const thisWidgetInfo = contentsToHtmlWithInfo({
        contents: params.contents[i],
        parent: params.parent,
      });
      myInfo.htmlElements.push(thisWidgetInfo.htmlElements[0]);
      myInfo.widthGrows = thisWidgetInfo.widthGrows || myInfo.widthGrows;
      myInfo.heightGrows = thisWidgetInfo.heightGrows || myInfo.heightGrows;
    }
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
        let embededContent = contentsToHtmlWithInfo({
          contents: JSON.parse(
            contentsAsString.substring(
              openTagIndex + _inlineContentOpenTag.length,
              closeTagIndex
            )
          ) as Widget,
          parent: params.parent,
        }).htmlElements[0];
        paragraphParts.push(embededContent);
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
        }}
      >
        {paragraphParts}
      </p>
    );
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
  } else {
    const childrenInfo = contentsToHtmlWithInfo({
      contents: params.contents.contents,
      parent: params.contents,
    });
    myInfo.widthGrows =
      _isSizeGrowConfig(params.contents.width) ||
      (params.contents.width == size.basedOnContents &&
        childrenInfo.widthGrows);
    myInfo.heightGrows =
      _isSizeGrowConfig(params.contents.height) ||
      (params.contents.height == size.basedOnContents &&
        childrenInfo.heightGrows);
    myInfo.htmlElements.push(
      React.createElement(
        params.contents.htmlTag,
        {
          style: {
            display: `flex`,
            width:
              typeof params.contents.width === `string`
                ? params.contents.width
                : params.contents.width !== size.basedOnContents &&
                  !myInfo.widthGrows
                ? numToStandardHtmlUnit(params.contents.width as number)
                : undefined,
            // If the dev specifies a fixed size, then force the widget to be exactly that size
            minWidth:
              typeof params.contents.width === `string`
                ? params.contents.width
                : params.contents.width !== size.basedOnContents &&
                  !myInfo.widthGrows
                ? numToStandardHtmlUnit(params.contents.width as number)
                : undefined,
            maxWidth:
              typeof params.contents.width === `string`
                ? params.contents.width
                : params.contents.width !== size.basedOnContents &&
                  !myInfo.widthGrows
                ? numToStandardHtmlUnit(params.contents.width as number)
                : undefined,
            height:
              typeof params.contents.height === `string`
                ? params.contents.height
                : params.contents.height !== size.basedOnContents &&
                  !myInfo.heightGrows
                ? numToStandardHtmlUnit(params.contents.height as number)
                : undefined,
            minHeight:
              typeof params.contents.height === `string`
                ? params.contents.height
                : params.contents.height !== size.basedOnContents &&
                  !myInfo.heightGrows
                ? numToStandardHtmlUnit(params.contents.height as number)
                : undefined,
            maxHeight:
              typeof params.contents.height === `string`
                ? params.contents.height
                : params.contents.height !== size.basedOnContents &&
                  !myInfo.heightGrows
                ? numToStandardHtmlUnit(params.contents.height as number)
                : undefined,
            flexGrow:
              params.parent.contentAxis === axis.horizontal
                ? _isSizeGrowConfig(params.contents.width)
                  ? params.contents.width.flex
                  : myInfo.widthGrows
                  ? 1
                  : undefined
                : _isSizeGrowConfig(params.contents.height)
                ? params.contents.height.flex
                : myInfo.heightGrows
                ? 1
                : undefined,
            alignSelf:
              (params.parent.contentAxis === axis.horizontal &&
                myInfo.heightGrows) ||
              (params.parent.contentAxis === axis.vertical && myInfo.widthGrows)
                ? `stretch`
                : undefined,
            boxSizing: `border-box`,
            fontFamily: `Roboto`,
            fontSize: numToFontSize(params.contents.textSize),
            fontWeight: params.contents.textIsBold ? `bold` : undefined,
            fontStyle: params.contents.textIsItalic ? `italic` : undefined,
            color: params.contents.textColor,
            borderRadius: numToStandardHtmlUnit(params.contents.cornerRadius),
            backgroundColor: _isMaterialImage(params.contents.background)
              ? undefined
              : params.contents.background,
            backgroundImage: _isMaterialImage(params.contents.background)
              ? `url(${params.contents.background})`
              : undefined,
            backgroundPosition: _isMaterialImage(params.contents.background)
              ? `center`
              : undefined,
            backgroundSize: _isMaterialImage(params.contents.background)
              ? `cover`
              : undefined,
            backgroundRepeat: `no-repeat`,
            backgroundAttachment: `local`,
            boxShadow: `${numToStandardHtmlUnit(
              0.12 *
                params.contents.shadowSize *
                params.contents.shadowDirection.x
            )} ${numToStandardHtmlUnit(
              -0.12 *
                params.contents.shadowSize *
                params.contents.shadowDirection.y
            )} ${numToStandardHtmlUnit(
              0.225 * params.contents.shadowSize
            )} ${numToStandardHtmlUnit(0)} ${colors.grey}`,
            border: `none`,
            textAlign:
              params.contents.contentAlign.x === -1
                ? `left`
                : params.contents.contentAlign.x === 0
                ? `center`
                : `right`,
            margin: 0,
            padding: numToStandardHtmlUnit(params.contents.padding),
            overflowX: params.contents.contentIsScrollableX
              ? `overlay` // Scroll when nesscary, and float above contents
              : undefined, //`hidden`,
            overflowY: params.contents.contentIsScrollableY
              ? `auto` // Scroll when nesscary, and float above contents
              : undefined, //`hidden`,
            flexDirection:
              params.contents.contentAxis === axis.vertical ? `column` : `row`,
            // Content Alignment: https://css-tricks.com/snippets/css/a-guide-to-flexbox/
            justifyContent:
              // Exact spacing is handled through grid gap
              typeof params.contents.contentSpacing === `number`
                ? params.contents.contentAxis === axis.vertical
                  ? params.contents.contentAlign.y === 1
                    ? `flex-start`
                    : params.contents.contentAlign.y === 0
                    ? `safe center`
                    : `flex-end`
                  : params.contents.contentAlign.x === -1
                  ? `flex-start`
                  : params.contents.contentAlign.x === 0
                  ? `safe center`
                  : `flex-end`
                : params.contents.contentSpacing === spacing.spaceBetween &&
                  childrenInfo.htmlElements.length === 1
                ? // For whatever reason, space-between with one item puts it at the start instead of centering it.
                  spacing.spaceAround
                : params.contents.contentSpacing,
            alignItems:
              params.contents.contentAxis === axis.vertical
                ? params.contents.contentAlign.x === -1
                  ? `flex-start`
                  : params.contents.contentAlign.x === 0
                  ? `safe center`
                  : `flex-end`
                : params.contents.contentAlign.y === 1
                ? `flex-start`
                : params.contents.contentAlign.y === 0
                ? `safe center`
                : `flex-end`,
            rowGap:
              params.contents.contentAxis === axis.vertical &&
              typeof params.contents.contentSpacing === `number`
                ? numToStandardHtmlUnit(params.contents.contentSpacing)
                : undefined,
            columnGap:
              params.contents.contentAxis === axis.horizontal &&
              typeof params.contents.contentSpacing === `number`
                ? numToStandardHtmlUnit(params.contents.contentSpacing)
                : undefined,
          },
        },
        childrenInfo.htmlElements
      )
    );
  }

  return myInfo;
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
