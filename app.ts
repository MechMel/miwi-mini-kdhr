import {
  page,
  colors,
  align,
  size,
  axis,
  spacing,
  icons,
  Color,
} from "./miwi/widget";
import { box, button, appBar, card, pageBody } from "./miwi/md";

const primaryColor = Color(`#00ffffff`);

// UI
page(
  appBar({ background: colors.red }, `My App Bar`),
  pageBody(
    {
      padding: 3,
      contentSpacing: 4,
    },
    card(`I am a Card`),
    box({ width: size.grow, height: 5, background: primaryColor }),
  ),
);
