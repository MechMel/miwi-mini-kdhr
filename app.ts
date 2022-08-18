import { page, colors, align, size, axis, spacing, icons } from "./miwi/widget";
import { box, button, appBar, card, pageBody } from "./miwi/md";

// UI
page(
  appBar,
  pageBody(
    button.solid({ background: colors.black }),
    card({ contentAlign: align.centerLeft }, `This is a Card`),
  ),
);
