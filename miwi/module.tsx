import * as fs from "fs";
import * as React from "react";
import { renderToString } from "react-dom/server";

// SECTION: App Data
export type AppData<T> = {
  [Key in keyof T]: _ReactiveType<T[Key]>;
};
export function appData<T>(params: T): AppData<T> {
  return params as any;
}

// Conts
const rootProjectPath = `./`;
const rootOutputPath = `./website`;

// Builds an app
export function app({
  name = `Untitled`,
  contents,
}: {
  name?: string;
  contents?: Widget; //Contents;
}) {
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

            <title>{name}</title>
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
          <body>
            <div
              style={{
                width: `${contents!.width}vw`,
                height: `${contents!.height}vw`,
                backgroundColor: `#FF0000`,
              }}
            ></div>
          </body>
        </html>
      )
  );
}

export function button(params?: Partial<Widget>) {
  return {
    width: params?.width ?? size.contract(),
    height: params?.height ?? size.contract(),
    padding: params?.padding ?? 0,
    contents: params?.contents ?? `Button`,
    material: params?.material ?? `0 100 100`,
  };
}

export function text(params?: Partial<Widget>) {
  return {
    width: params?.width ?? size.contract(),
    height: params?.height ?? size.contract(),
    padding: params?.padding ?? 0,
    contents: params?.contents ?? `Text`,
    material: params?.material ?? undefined,
  };
}

// SECTION: Widget
export interface Widget {
  width: Size;
  height: Size;
  padding: Padding;
  contents: Contents;
  material: Material;
}

// SECTION: Size
export type Size = Num;
export const size = function (num: Num) {
  return num;
};
size.contract = function () {
  return -1;
};
size.expand = function () {
  return Infinity;
};

// SECTION: Padding
export type Padding = Num | [Num, Num] | [Num, Num, Num, Num];

// SECTION: Contents
export type Contents = Text | Bool | Num | Widget | Widget[];

// SECTION: Material
export type Material = RGB | HSV;
export type HSV = `${number} ${number} ${number}`;
export type RGB = `#${string}`;

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
