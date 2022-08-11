import { app, appData, button, text } from "./miwi/module";

// Data
const data = appData({
  name: ``,
});

// UI
app({
  name: `My App`,
  contents: button({
    width: 50,
    height: 10,
  }),
});
