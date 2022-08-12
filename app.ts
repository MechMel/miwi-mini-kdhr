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
  padding: 1,
  contentSpacing: 1,
  contents: [
    box({
      contentAxis: axis.horizontal,
      contentAlign: align.bottomCenter,
      contentSpacing: 1,
      contents: [
        button({
          background: colors.red,
          contents: `Hello Melchiah!`,
        }),
        button({
          background: colors.red,
          contents: `Hello Melchiah!`,
        }),
      ],
    }),
    button({
      width: size.grow,
      height: size.grow,
    }),
  ],
});
