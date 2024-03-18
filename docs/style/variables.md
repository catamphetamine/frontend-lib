# Style Variables

This document describes the [CSS Variables](https://developer.mozilla.org/docs/Web/CSS/Using_CSS_custom_properties) available for customization. If you have suggestions for new CSS Variables then contact the repo author through [issues](https://gitlab.com/catamphetamine/frontend-lib/issues) to discuss that.

All variables listed here have their default values which are defined in the following files:
* [variables.css](https://gitlab.com/catamphetamine/frontend-lib/-/blob/main/styles/variables.css) — common defaults
* [variables.light.css](https://gitlab.com/catamphetamine/frontend-lib/-/blob/main/styles/variables.light.css) — custom defaults for light mode
* [variables.dark.css](https://gitlab.com/catamphetamine/frontend-lib/-/blob/main/styles/variables.dark.css) — custom defaults for dark mode

Some variables can potentially be missing from this document due to being overlooked.

## Colors

There're three main colors in the palette: "black", "white" and "color".

* "Black" is for text, and for "Dark Mode" it's actually "white", so semantically it's called `--Content-color`.

* "White" is for text background, and for "Dark Mode" it's actually "black", so semantically it's called `--Content-backgroundColor`.

* "Color" is about bringing some color, and it's usually a "branding" color: sky blue for Twitter, dark blue for Facebook, red for YouTube, etc. In order to differentiate the "color" from the other colors it's called `--base-color`.

Each color can have variations: from `100` for the "lightest" one to `900` for the "darkest" one. The meaning of "lightest" and "darkest" depends on the context. For example, for `--Content-color` "lightest" means the lightest in "Light Mode" and the darkest in "Dark Mode". And for `--base-color` regardless of "Light Mode" or "Dark Mode" "lightest" means the lightest and "darkest" means the darkest.

See [this article](https://refactoringui.com/previews/building-your-color-palette) for more details on building a color palette.

## Base color

* All variations of `--base-color`: from `--base-color-100` for the lightest one to `--base-color-900` for the darkest one. See [this article](https://refactoringui.com/previews/building-your-color-palette) for more details on building a color palette.

## Document

* `--Document-color: black` — Text color on a page.
* `--Document-backgroundColor: white` — Background color of a page.
* `--Document-backgroundImage: url(https://domain.com/pattern.jpg)` — Background image pattern. Could be an "absolute" URL or a "relative" URL (if the image is hosted on the same domain as the application, then a "relative" URL should be used). Could also be a "base64-encoded image data URL", like `url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...)`, if one prefers embedding the image data in the theme definition rather than linking the image from a URL.
* `--Document-fontFamily: Roboto` — Default font family.
* `--Document-fontWeight: normal` — Default font weight.

## Content

"Content" are posts and generic page content.

* All variations of `--Content-color`: from `--Content-color-100` for the "lightest" one to `--Content-color-900` for the "darkest" one. In "Dark Mode" `--Content-color-100` is the "darkest" variation and `--Content-color-900` is for the "lightest" one. See [this article](https://refactoringui.com/previews/building-your-color-palette) for more details on building a color palette.
* `--Content-backgroundColor: white` — Content background color.
* `--Content-backgroundColor--active: yellow` — When a thread is clicked in a threads list then it's highlighted with this color.

## ContentSection

An example of a "Content Section" is a post.

* `--ContentSection-shadowColor: gray` — The color of `box-shadow` of a content section.

## Text

* `--Text-fontFamily: sans-serif` — Text content font.

## Selection

* `--Selection-color: white` — Selected text color.
* `--Selection-backgroundColor: orange` — Selected text background color.

## Clickable

A clickable is a link or a button. Links and textual buttons are darker than buttons with background for eligibility reasons.

* `--Clickable-color--text: brown` — Link color.
* `--Clickable-color--textActive: orange` — Link color on click.
* `--Clickable-color: orange` — Link color when clicked. Button background color.
* `--Clickable-color--active: red` — Button background color when clicked.

## Menu

* `--Menu-color: black` — Menu icons color (outline).
* `--Menu-color--active: gray` — Menu icons color (fill) when clicked.
* `--Menu-color--selected: black` — Menu icons color (fill) when selected.

## Announcement

Sometimes the administration needs to announce something to the users. Things like latest news, contests, etc. Such an announcement appears on top of the page, below the header.

* `--Announcement-backgroundColor: black` — Announcement background color.
* `--Announcement-color: white` — Announcement text color.
* `--Announcement-borderWidth: 1px` — Announcement border width.
* `--Announcement-borderColor: gray` — Announcement border color.
* `--Announcement-boxShadow: none` — Announcement box shadow.
* `--Announcement-link-color: orange` — Announcement link color.
* `--Announcement-link-color--active: red` — Announcement link color when clicked.
* `--Announcement-link-borderBottom: 1px dashed orange` — Announcement link `border-bottom` style.
* `--Announcement-link-textDecoration: underline` — Announcement link `text-decoration` style.

## Critical

* `--Critical-color: red` — Error message text color.
* `--Critical-backgroundColor: red` — Error `Notification` background color. Error `Notification` text color will be `--Content-color-900`.

## Warning

* `--Warning-color: yellow` — Warning message text color.
* `--Warning-backgroundColor: yellow` — Warning `Notification` background color. Warning `Notification` text color will be `--Content-color-900`.

## Notification

* `--Notification-color: white` — Notification text color.
* `--Notification-backgroundColor: black` — Notification background color.
* `--Notification-borderColor: transparent` — Notification border color.
* `--Notification-borderWidth: 0px` — Notification border width.

### Notification (critical)

* `--Notification-color--critical: white` — Error notification text color.
* `--Notification-backgroundColor--critical: var(--Critical-backgroundColor)` — Error notification background color.
* `--Notification-borderColor--critical: var(--Notification-borderColor)` — Error notification border color.
* `--Notification-borderWidth--critical: var(--Notification-borderWidth)` — Error notification border width.

### Notification (warning)

* `--Notification-color--warning: white` — Warning notification text color.
* `--Notification-backgroundColor--warning: var(--Warning-backgroundColor)` — Warning notification background color.
* `--Notification-borderColor--warning: var(--Notification-borderColor)` — Warning notification border color.
* `--Notification-borderWidth--warning: var(--Notification-borderWidth)` Warning notification border width.

## Modal

* `--Modal-borderColor: transparent` — Modal border color.
* `--Modal-borderWidth: 0px` — Modal border width.

## PressedStateButton

A "pressed state" button: a button that stays "pressed" until "depressed". The examples are the various post buttons: "…" menu button, "show replies" button, "reply" button, comment date link (although this one doesn't ever get "pressed").

* `--PressedStateButton-backgroundColor: gray` — Hover button background color on mouse over.
* `--PressedStateButton-backgroundColor--active: yellow` — Hover button background color when clicked.
* `--PressedStateButton-backgroundColor--pressed: var(--PressedStateButton-backgroundColor--active)` — Hover button background color when pressed.
* `--PressedStateButton-color--active: orange` — Hover button text color when clicked.
* `--PressedStateButton-color--pressed: orange` — Hover button text color when pressed.
* `--PressedStateButton-color--pressedActive: var(--PressedStateButton-color--active)` — Hover button text color when clicked to unpush.
* `--PressedStateButton-borderColor: gray` — Hover button border color on mouse over.
* `--PressedStateButton-borderColor--active: var(--PressedStateButton-borderColor)` — Hover button border color on click.
* `--PressedStateButton-borderColor--pressed: var(--PressedStateButton-borderColor--active)` — Hover button background color when pressed.
