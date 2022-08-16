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
    appBar({
      //background: colors.transparent,
      //textColor: colors.red,
    }),
    box({
      width: size.grow,
      height: size.grow,
      padding: 1,
      contentSpacing: 1,
      contentAlign: align.topCenter,
      //contentIsScrollableY: true,
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
            button({
              height: 2,
              background: colors.orange,
            }),
          ],
        }),
        box({
          width: 4,
          height: 4,
          cornerRadius: 2,
          background: `profile_picture.jpg`,
        }),
        box({
          contentAxis: axis.horizontal,
          contentSpacing: 1,
          contents: [
            button({
              contents: icons.settings + ` Settings`,
            }),
            button({
              height: 2,
              contents: `adasdfas`,
            }),
          ],
        }),
        /*button({
          background: colors.red,
          contents: `This is my button. ${icons.remove_shopping_cart}`,
        }),
        button({
          background: colors.red,
          contents: `This is my button. ${icons.remove_shopping_cart}`,
        }),
        button({
          background: colors.red,
          contents: `This is my button. ${icons.remove_shopping_cart}`,
        }),
        button({
          background: colors.red,
          contents: `This is my button. ${icons.remove_shopping_cart}`,
        }),
        button({
          background: colors.red,
          contents: `This is my button. ${icons.remove_shopping_cart}`,
        }),
        button({
          background: colors.red,
          contents: `This is my button. ${icons.remove_shopping_cart}`,
        }),
        button({
          background: colors.red,
          contents: `This is my button. ${icons.remove_shopping_cart}`,
        }),*/
        button({
          background: colors.teal,
          shadowSize: 1,
          contents: `This is my button. ${icons.remove_shopping_cart}`,
        }),
      ],
    }),
  ],
});
