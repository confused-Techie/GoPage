## Plugin Types

Within your `plugin.json` you can define the type of plugin you are creating. This will be used for GoPage to know how to load the plugin, and when to allow the user to select it.

### `item`

The `item` type Plugin will be available when creating a new Link Item, allowing it to be the center, right, or left plugin for said Item. Once installed this will load the `main` file in your `package.json` as a new script for the page, and as such should point to a JavaScript file.

### `theme`

The `theme` type Plugin will not show any configuration options to the user and once installed will be applied globally to GoPage and will target your `main` file as a stylesheet that overrides the current theme of the system.

### `header`

The `header` type Plugin will be shown only in the Header of GoPage and shouldn't expect to have any `data-url` attributes. It can still of course have `data-config` attributes. And is intended to show data that doesn't apply to any links but rather show data that applies to the user, such as temperature, or the Air Quality Index like [AQICurrent](https://github.com/confused-Techie/GoPage-Plugins#AQICurrent).
