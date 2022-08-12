import * as React from "react";
import { renderToString } from "react-dom/server";
import { Contents, Widget, print, size, axis, Axis } from "./module";

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
      return renderToString(contentsToHtml(newWidget)[0] as any);
    };
    return newWidget;
  };
}

export function contentsToHtml(
  contents: Contents,
  // We default to horizontal because widget.toString() is mainly called when embeding widgets in text.
  parentAxis = axis.horizontal as Axis
) {
  // We always return a list of html elements
  const htmlElements: (JSX.Element | string)[] = [];

  // We'll split arrays into their individual elements and recurssively convert them to html.
  if (Array.isArray(contents)) {
    for (let i in contents)
      htmlElements.push(contentsToHtml(contents[i], parentAxis)[0]);
  } else if (
    typeof contents === `string` ||
    typeof contents === `number` ||
    typeof contents === `boolean`
  ) {
    htmlElements.push(contents.toString());
  } else {
    htmlElements.push(
      React.createElement(
        contents.htmlTag,
        {
          style: {
            width:
              typeof contents.width === `string`
                ? contents.width
                : contents.height !== size.shrink &&
                  contents.height !== size.grow
                ? `${contents.width}vw`
                : undefined,
            height:
              typeof contents.height === `string`
                ? contents.height
                : contents.height !== size.shrink &&
                  contents.height !== size.grow
                ? `${contents.height}vw`
                : undefined,
            alignSelf:
              parentAxis === axis.horizontal
                ? contents.height === size.grow
                  ? `stretch`
                  : undefined
                : contents.width === size.grow
                ? `stretch`
                : undefined,
            flexGrow:
              parentAxis === axis.horizontal
                ? contents.width === size.grow
                  ? 1
                  : undefined
                : contents.height === size.grow
                ? 1
                : undefined,
            backgroundColor: contents.background,
            borderRadius: `${contents.cornerRadius}vw`,
            color: contents.textColor,
            fontFamily: `Roboto`,
            fontSize: `0.825vw`,
            margin: 0,
            padding: `${contents.padding}vw`,
            display: `flex`,
            border: `none`,
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
                ? `${contents.contentSpacing}vw`
                : undefined,
            columnGap:
              contents.contentAxis === axis.horizontal &&
              typeof contents.contentSpacing === `number`
                ? `${contents.contentSpacing}vw`
                : undefined,
            flexDirection:
              contents.contentAxis === axis.vertical ? `column` : `row`,
          },
        },
        contentsToHtml(contents.contents, contents.contentAxis)
      )
    );
  }

  return htmlElements;
}
