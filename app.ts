import {
  page,
  appData,
  box,
  colors,
  button,
  align,
  size,
  axis,
  spacing,
} from "./miwi/module";

// Data
const data = appData({
  name: ``,
});

// UI
page({
  name: `Melchiah's App`,
  contentAlign: align.topLeft,
  contentAxis: axis.vertical,
  contentSpacing: spacing.spaceEvenly,
  contents: [
    box({
      width: 9,
      height: 5,
      cornerRadius: 1,
      textColor: colors.white,
      background: colors.red,
      contents: `Hello Melchiah!`,
    }),
    box({
      width: 5,
      height: 5,
      background: colors.green,
    }),
    button({
      width: size.grow,
      height: size.grow,
    }),
  ],
});
