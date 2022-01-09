# CSS of GoPage

WARNING: This is unpolished Documentation, mostly for myself as of now.

GoPage's CSS was the first time I tried to pay attention to, and understand CSS better as I've never had a design oriented mind. With that said...

## Unviversal.css

Universal.css is applied to all pages, and is meant originally to containing styling for the items that existed on each page, like the footer and header.

But has since expanded to include as many unique design elements as possible, to allow other pages to easily take advantage of these elements.

### Intended Unique Items

* text-style-issue:
  Colors text according to themes --text-style-issue-colour

* text-style-declare
  Colors text according to themes --text-style-declare-colour
  As well as underlines and bolds the text

* simple-button   
  Creates the standard button in use on GoPage.
  - padding: 10px
  - margin: 10px

* btn-create
  Colors an item according to themes
    - --create-action-back-drop-colour
    - --create-action-text-colour

* btn-undo
  Colors an item according to themes
    - --undo-action-back-drop-colour
    - --undo-action-text-colour

* grow-shadow-hover
  Causes the element to scale to 1.2 with a shadow beneath it

* reveal-on-hover
  Causes an item to received opacity 1 on hover.
  TODO: Rework to have animations, and be more complex

* dropdown , dropdown-content, dropdown-content-item
  Causes dropdown-content items to be visible while dropdown is hovered over.
  Used for the Settings Icon hover element for reference.

* hover-shadow-radial
  When Hovered this item has a radial gradient shadow show around it. Used for the Link Items on the Home Page

* bubble-card-daily
  Used to create a bubble card of info. Used for the Link Items on the Home Page currently
    - max-width: 30%
    - min-width: 15%

* boxy-card-daily
  Used to create a very boxy card of info. Used to be the standard for Link Items
    - max-width: 50%
    - min-width: 30%
    - min-height: 10%

* snackbar
  Used to style the snackbar on screen, once it is enabled, as in `show` is added to its class
  It will take .5 seconds to fade in, stay on screen for 2.5 seconds, then take another .5 seconds to disappear
  - Used only for simple text 
