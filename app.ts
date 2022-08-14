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
  appBar,
} from "./miwi/module";

// Data
const data = appData({
  name: ``,
});

// UI
page({
  name: `Melchiah's App`,
  contentAxis: axis.vertical,
  contents: [
    appBar(),
    box({
      padding: 1,
      contentSpacing: 1,
      contents: [
        box({
          width: size.basedOnContents,
          contentAxis: axis.horizontal,
          contentAlign: align.center,
          contentSpacing: 1,
          contents: [
            button({
              background: colors.red,
            }),
            button({
              background: colors.red,
            }),
            button({
              background: colors.red,
            }),
          ],
        }),
        box({
          width: 4,
          height: 4,
          cornerRadius: 2,
          background: `profile_picture.jpg`,
        }),
        button(),
      ],
    }),
  ],
});
