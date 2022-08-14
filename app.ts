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
  icons,
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
              background: colors.green,
            }),
            button({
              background: colors.red,
              contents: false,
            }),
            button({
              background: colors.pink,
              contents: 55,
            }),
          ],
        }),
        box({
          width: 4,
          height: 4,
          cornerRadius: 2,
          background: `profile_picture.jpg`,
        }),
        button({
          contents: icons.settings,
        }),
        `Feel free to click the ${icons.settings} button. ${icons.settings} or this`,
      ],
    }),
  ],
});
