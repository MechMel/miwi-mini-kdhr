import { align, axis, colors, size2, spacing, widgetTemplate } from "./widget";

/** @Note A box is the simplest UI widget. */
export const box = widgetTemplate({
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
});

/** @Note Describes a card. */
export const card = widgetTemplate({
  width: size2.basedOnContents,
  height: size2.basedOnContents,
  textSize: 1,
  textIsBold: false,
  textIsItalic: false,
  textColor: colors.black,
  cornerRadius: 1,
  background: colors.white,
  shadowSize: 1,
  shadowDirection: align.bottomRight,
  padding: 1,
  contentAlign: align.center,
  contentAxis: axis.vertical,
  contentIsScrollableX: false,
  contentIsScrollableY: false,
  contentSpacing: 0,
  contents: [],
  htmlTag: `div`,
});

/** @Note Describes a button. */
export const button = widgetTemplate({
  width: size2.basedOnContents,
  height: size2.basedOnContents,
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
export const appBar = widgetTemplate({
  width: size2.grow,
  height: size2.basedOnContents,
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
