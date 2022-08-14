import * as React from "react";
import { renderToString } from "react-dom/server";
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
} from "./module";

export function readonlyObj<T>(obj: T): Readonly<T> {
  return obj;
}

// Utilitiy Classes: https://www.typescriptlang.org/docs/handbook/utility-types.html
export function defineWidgetBuilder(
  defaultParams: Required<Omit<Widget, `toString`>>
) {
  return function (
    invocationParams?: Partial<Omit<Widget, `htmlTag`>>
  ): Required<Widget> {
    const newWidget: any = {};
    for (const key in defaultParams) {
      newWidget[key] =
        (invocationParams as any)?.[key] ?? (defaultParams as any)[key];
    }
    newWidget.toString = function (): string {
      return renderToString(
        contentsToHtmlWithInfo(newWidget).htmlElements[0] as any
      );
    };
    return newWidget;
  };
}

export function contentsToHtmlWithInfo(
  contents: Contents,
  // We default to horizontal because widget.toString() is mainly called when embeding widgets in text.
  parentAxis = axis.horizontal as Axis
) {
  // We always return a list of html elements
  const myInfo = {
    htmlElements: [] as (JSX.Element | string)[],
    widthGrows: false,
    heightGrows: false,
  };

  // We'll split arrays into their individual elements and recurssively convert them to html.
  if (Array.isArray(contents)) {
    for (let i in contents) {
      const thisWidgetInfo = contentsToHtmlWithInfo(contents[i], parentAxis);
      myInfo.htmlElements.push(thisWidgetInfo.htmlElements[0]);
      myInfo.widthGrows = thisWidgetInfo.widthGrows || myInfo.widthGrows;
      myInfo.heightGrows = thisWidgetInfo.heightGrows || myInfo.heightGrows;
    }
  } else if (
    typeof contents === `string` ||
    typeof contents === `number` ||
    typeof contents === `boolean`
  ) {
    myInfo.htmlElements.push(contents.toString());
  } else {
    const childrenInfo = contentsToHtmlWithInfo(
      contents.contents,
      contents.contentAxis
    );
    myInfo.widthGrows =
      _isSizeGrowConfig(contents.width) ||
      (contents.width == size.basedOnContents && childrenInfo.widthGrows);
    myInfo.heightGrows =
      _isSizeGrowConfig(contents.height) ||
      (contents.height == size.basedOnContents && childrenInfo.heightGrows);
    myInfo.htmlElements.push(
      React.createElement(
        contents.htmlTag,
        {
          style: {
            display: `flex`,
            width:
              typeof contents.width === `string`
                ? contents.width
                : contents.width !== size.basedOnContents && !myInfo.widthGrows
                ? numToStandardHtmlUnit(contents.width as number)
                : undefined,
            height:
              typeof contents.height === `string`
                ? contents.height
                : contents.height !== size.basedOnContents &&
                  !myInfo.heightGrows
                ? numToStandardHtmlUnit(contents.height as number)
                : undefined,
            flexGrow:
              parentAxis === axis.horizontal
                ? _isSizeGrowConfig(contents.width)
                  ? contents.width.flex
                  : myInfo.widthGrows
                  ? 1
                  : undefined
                : _isSizeGrowConfig(contents.height)
                ? contents.height.flex
                : myInfo.heightGrows
                ? 1
                : undefined,
            alignSelf:
              (parentAxis === axis.horizontal && myInfo.heightGrows) ||
              (parentAxis === axis.vertical && myInfo.widthGrows)
                ? `stretch`
                : undefined,
            boxSizing: `border-box`,
            backgroundColor: _isMaterialImage(contents.background)
              ? undefined
              : contents.background,
            backgroundImage: _isMaterialImage(contents.background)
              ? `url(${contents.background})`
              : undefined,
            backgroundPosition: _isMaterialImage(contents.background)
              ? `center`
              : undefined,
            backgroundSize: _isMaterialImage(contents.background)
              ? `cover`
              : undefined,
            borderRadius: numToStandardHtmlUnit(contents.cornerRadius),
            border: `none`,
            color: contents.textColor,
            fontFamily: `Roboto`,
            fontSize: numToStandardHtmlUnit(0.825 * contents.textSize),
            fontWeight: contents.textIsBold ? `bold` : undefined,
            fontStyle: contents.textIsItalic ? `italic` : undefined,
            textAlign:
              contents.contentAlign.x === -1
                ? `left`
                : contents.contentAlign.x === 0
                ? `center`
                : `right`,
            margin: 0,
            padding: numToStandardHtmlUnit(contents.padding),
            flexDirection:
              contents.contentAxis === axis.vertical ? `column` : `row`,
            // Content Alignment: https://css-tricks.com/snippets/css/a-guide-to-flexbox/
            justifyContent:
              // Exact spacing is handled through grid gap
              typeof contents.contentSpacing === `number`
                ? contents.contentAxis === axis.vertical
                  ? contents.contentAlign.y === 1
                    ? `flex-start`
                    : contents.contentAlign.y === 0
                    ? `center`
                    : `flex-end`
                  : contents.contentAlign.x === -1
                  ? `flex-start`
                  : contents.contentAlign.x === 0
                  ? `center`
                  : `flex-end`
                : contents.contentSpacing === spacing.spaceBetween &&
                  childrenInfo.htmlElements.length === 1
                ? // For whatever reason, space-between with one item puts it at the start instead of centering it.
                  spacing.spaceAround
                : contents.contentSpacing,
            alignItems:
              contents.contentAxis === axis.vertical
                ? contents.contentAlign.x === -1
                  ? `flex-start`
                  : contents.contentAlign.x === 0
                  ? `center`
                  : `flex-end`
                : contents.contentAlign.y === 1
                ? `flex-start`
                : contents.contentAlign.y === 0
                ? `center`
                : `flex-end`,
            rowGap:
              contents.contentAxis === axis.vertical &&
              typeof contents.contentSpacing === `number`
                ? numToStandardHtmlUnit(contents.contentSpacing)
                : undefined,
            columnGap:
              contents.contentAxis === axis.horizontal &&
              typeof contents.contentSpacing === `number`
                ? numToStandardHtmlUnit(contents.contentSpacing)
                : undefined,
          },
        },
        childrenInfo.htmlElements
      )
    );
  }

  return myInfo;
}

function tallyUpContnetGrowth() {}

export function numToStandardHtmlUnit(num: number) {
  return `${num * (_pageWidthVmin / 24)}vmin`;
}

export function exists(obj: any) {
  return obj !== undefined && obj !== null;
}
