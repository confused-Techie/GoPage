## Contributing to GoPage

There are many ways to help GoPage, some don't even require any knowledge of programming.

### Plugins

While Plugins do come in different shapes and sizes this refers to specifically [Item](pluginDevDocs/types.md) Type Plugins.

Where the main Plugin is made in JavaScript and adds additional data or functionality to GoPage.

Feel free to read more on [Creating Plugins](createPlugins.md) or referring to some of the First Party Plugins created for GoPage.

Some plugins built with being examples in mind are below:

[Status Check](https://github.com/confused-Techie/GoPage-Plugins/tree/main/statusCheck)

[Jellyfin API](https://github.com/confused-Techie/GoPage-Plugins/tree/main/jellyfinApi)

Once a plugin is created a Pull Request can be created simply adding your `package.json` to the `availablePlugins.json` file.

### Themes

Themes are a type of Plugin so do require the creation of a `package.json` is needed the rest of a Theme is dedicated to CSS creation and has been attempted to make extremely simple with many colours and border styling being declared as variables in the pseudo-class `root`

One of the example Themes or the default `theme-dark.css` file can be copied and modified as needed.

Or for the simplest starting point there is an [example](pluginDevDocs/themeExample.css) of a CSS Theme that can be copied to create a new theme. 

Some plugins that can example a valid theme are below:

[Light Theme](https://github.com/confused-Techie/GoPage-Plugins/tree/main/lightTheme)

[Exaggerator Theme](https://github.com/confused-Techie/GoPage-Plugins/tree/main/exaggeratorTheme)

### Translation

Translating GoPage is needed to allow GoPage to be useful to as many people as possible.

The easiest way to get started translating GoPage would be to copy `strings.en.json` and replace `en` with the language you plan to translate to ensuring to keep in line with [ISO 639-1 two character language abbreviation](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes). Then from there translate the text on the right hand side of each item, keeping in mind that if an item is missing or empty that is totally fine and will default to the English Translation if needed.
