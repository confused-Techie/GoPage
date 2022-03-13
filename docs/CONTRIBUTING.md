## Contributing to GoPage

There are many ways to help GoPage, some don't even require any knowledge of programming.

### Programming

Much work has been done to make contributing to GoPage as easy as possible.

With as much of the program as documented as possible, and if documentation is poor in any place feel free to open an issue for the feature that you plan to add, and I can help point in the right direction.

The [JavaScript](devDocs/JavaScript.md) in the project is being documented with JSDoc2MD using JSDoc style tags.

Currently the [CSS](devDocs/css.md) of the project is being documented manually, but is still available, although may be slightly out of date.

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

GoPage uses Crowdin for translations making it as easy as possible to assist. Just visit [Crowdin](https://crowdin.com/project/gopage) and take a look at any language that either is not complete or improve the existing translations that have already been done. As of now translations for Arabic, German, and Russian were done by those without knowledge of the language relying on Machine translation, or translations found in other projects. So those could likely use the most assistance.
