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
  card,
} from "./miwi/module";

// Data
const data = appData({
  name: ``,
});

// UI
page({
  name: `Melchiah's App`,
  contentAxis: axis.vertical,
  background: colors.transparent,
  contents: [
    appBar({
      //background: colors.transparent,
      //textColor: colors.red,
      contents: `Contacts`,
    }),
    box({
      width: size.grow,
      height: size.grow,
      padding: 1,
      contentSpacing: 1,
      contentAlign: align.topCenter,
      //contentIsScrollableX: true,
      contentIsScrollableY: true,
      contents: [
        card({
          width: size.grow,
          contentAlign: align.centerLeft,
          contentAxis: axis.horizontal,
          contentSpacing: 1,
          contents: [
            box({
              width: 4,
              height: 4,
              cornerRadius: 2,
              background: `profile_picture.jpg`,
            }),
            box({
              width: size.grow,
              contentAlign: align.topLeft,
              contentSpacing: 0.25,
              contents: [
                box({
                  textSize: 1.25,
                  textIsBold: true,
                  contents: `Melchiah Mauck`,
                }),
                box({
                  textSize: 1,
                  textIsBold: false,
                  textColor: colors.grey,
                  contentAlign: align.topLeft,
                  contents: `A random, normal programmer. asdfa qadfas asdf asdfa d asdf a asd adfasdfavsscvz a `,
                }),
              ],
            }),
          ],
        }),
        card({
          width: size.grow,
          contentAlign: align.centerLeft,
          contentAxis: axis.horizontal,
          contentSpacing: 1,
          contents: [
            box({
              width: 4,
              height: 4,
              cornerRadius: 2,
              background: `profile_picture.jpg`,
            }),
            box({
              width: size.grow,
              contentAlign: align.topLeft,
              contentSpacing: 0.25,
              contents: [
                box({
                  textSize: 1.25,
                  textIsBold: true,
                  contents: `Melchiah Mauck`,
                }),
                box({
                  textSize: 1,
                  textIsBold: false,
                  textColor: colors.grey,
                  contentAlign: align.topLeft,
                  contents: `A random, normal programmer. asdfa qadfas asdf asdfa d asdf a asd adfasdfavsscvz a `,
                }),
              ],
            }),
          ],
        }),
        card({
          width: size.grow,
          contentAlign: align.centerLeft,
          contentAxis: axis.horizontal,
          contentSpacing: 1,
          contents: [
            box({
              width: 4,
              height: 4,
              cornerRadius: 2,
              background: `profile_picture.jpg`,
            }),
            box({
              width: size.grow,
              contentAlign: align.topLeft,
              contentSpacing: 0.25,
              contents: [
                box({
                  textSize: 1.25,
                  textIsBold: true,
                  contents: `Melchiah Mauck`,
                }),
                box({
                  textSize: 1,
                  textIsBold: false,
                  textColor: colors.grey,
                  contentAlign: align.topLeft,
                  contents: `A random, normal programmer. asdfa qadfas asdf asdfa d asdf a asd adfasdfavsscvz a `,
                }),
              ],
            }),
          ],
        }),
        card({
          width: size.grow,
          contentAlign: align.centerLeft,
          contentAxis: axis.horizontal,
          contentSpacing: 1,
          contents: [
            box({
              width: 4,
              height: 4,
              cornerRadius: 2,
              background: `profile_picture.jpg`,
            }),
            box({
              width: size.grow,
              contentAlign: align.topLeft,
              contentSpacing: 0.25,
              contents: [
                box({
                  textSize: 1.25,
                  textIsBold: true,
                  contents: `Melchiah Mauck`,
                }),
                box({
                  textSize: 1,
                  textIsBold: false,
                  textColor: colors.grey,
                  contentAlign: align.topLeft,
                  contents: `A random, normal programmer. asdfa qadfas asdf asdfa d asdf a asd adfasdfavsscvz a `,
                }),
              ],
            }),
          ],
        }),
        card({
          width: size.grow,
          contentAlign: align.centerLeft,
          contentAxis: axis.horizontal,
          contentSpacing: 1,
          contents: [
            box({
              width: 4,
              height: 4,
              cornerRadius: 2,
              background: `profile_picture.jpg`,
            }),
            box({
              width: size.grow,
              contentAlign: align.topLeft,
              contentSpacing: 0.25,
              contents: [
                box({
                  textSize: 1.25,
                  textIsBold: true,
                  contents: `Melchiah Mauck`,
                }),
                box({
                  textSize: 1,
                  textIsBold: false,
                  textColor: colors.grey,
                  contentAlign: align.topLeft,
                  contents: `A random, normal programmer. asdfa qadfas asdf asdfa d asdf a asd adfasdfavsscvz a `,
                }),
              ],
            }),
          ],
        }),
        card({
          width: size.grow,
          contentAlign: align.centerLeft,
          contentAxis: axis.horizontal,
          contentSpacing: 1,
          contents: [
            box({
              width: 4,
              height: 4,
              cornerRadius: 2,
              background: `profile_picture.jpg`,
            }),
            box({
              width: size.grow,
              contentAlign: align.topLeft,
              contentSpacing: 0.25,
              contents: [
                box({
                  textSize: 1.25,
                  textIsBold: true,
                  contents: `Melchiah Mauck`,
                }),
                box({
                  textSize: 1,
                  textIsBold: false,
                  textColor: colors.grey,
                  contentAlign: align.topLeft,
                  contents: `A random, normal programmer. asdfa qadfas asdf asdfa d asdf a asd adfasdfavsscvz a `,
                }),
              ],
            }),
          ],
        }),
        card({
          width: size.grow,
          contentAlign: align.centerLeft,
          contentAxis: axis.horizontal,
          contentSpacing: 1,
          contents: [
            box({
              width: 4,
              height: 4,
              cornerRadius: 2,
              background: `profile_picture.jpg`,
            }),
            box({
              width: size.grow,
              contentAlign: align.topLeft,
              contentSpacing: 0.25,
              contents: [
                box({
                  textSize: 1.25,
                  textIsBold: true,
                  contents: `Melchiah Mauck`,
                }),
                box({
                  textSize: 1,
                  textIsBold: false,
                  textColor: colors.grey,
                  contentAlign: align.topLeft,
                  contents: `A random, normal programmer. asdfa qadfas asdf asdfa d asdf a asd adfasdfavsscvz a `,
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
});
