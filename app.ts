import {
  page,
  colors,
  align,
  size2,
  axis,
  spacing,
  icons,
} from "./miwi/widget";
import { box, button, appBar, card } from "./miwi/md";

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
      width: size2.grow,
      height: size2.grow,
      padding: 1,
      contentSpacing: 1,
      contentAlign: align.topCenter,
      //contentIsScrollableX: true,
      contentIsScrollableY: true,
      contents: [
        card({
          width: size2.grow,
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
              width: size2.grow,
              contentAlign: align.topLeft,
              contentSpacing: 0.25,
              contents: [
                box({
                  textSize: 1.25,
                  textIsBold: true,
                  contents: `Melchiah Mauck2`,
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
          width: size2.grow,
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
              width: size2.grow,
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
          width: size2.grow,
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
              width: size2.grow,
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
          width: size2.grow,
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
              width: size2.grow,
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
          width: size2.grow,
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
              width: size2.grow,
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
          width: size2.grow,
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
              width: size2.grow,
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
          width: size2.grow,
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
              width: size2.grow,
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
