# `frontend-lib`

Frontend utilities and components.

## Install

<!--
```
npm install frontend-lib --save
```
-->

Clone the repository:

```
git clone https://gitlab.com/catamphetamine/frontend-lib.git
```

And then simply `import` modules from it:

```js
import Button from '../../frontend-lib/components/Button.js'
```

The reason for using these components as source code instead of importing them from an npm package is because a developer might prefer to modify them.

## Use

* [`<Button/>`](https://gitlab.com/catamphetamine/frontend-lib/blob/master/components/Button.js) — renders a generic button.

* [`<PressedStateButton/>`](https://gitlab.com/catamphetamine/frontend-lib/blob/master/components/PressedStateButton.js) — renders a "pressed state" button: a button that stays "pressed" until "depressed".

* [`<Clickable/>`](https://gitlab.com/catamphetamine/frontend-lib/blob/master/components/Clickable.js) — makes any element behave as if it was a button (but not in an [ARIA](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/WAI-ARIA_basics)-compliant way): the element will start responding to click and touch events, and will call `onClick()` when clicked or tapped.

* [`<OnLongPress/>`](https://gitlab.com/catamphetamine/frontend-lib/blob/master/components/OnLongPress.js) — adds an `onLongPress()` property to an arbitrary element, which is triggered "on long press" (supports touch and mouse devices).

* [`<Snackbar/>`](https://gitlab.com/catamphetamine/frontend-lib/blob/master/components/Snackbar.js) — shows slide-in/slide-out notifications.

* [`<OkCancelDialog/>`](https://gitlab.com/catamphetamine/frontend-lib/blob/master/components/OkCancelDialog.js) — shows an "Ok"/"Cancel" dialog.

* [`<TextSelectionTooltip/>`](https://gitlab.com/catamphetamine/frontend-lib/blob/master/components/TextSelectionTooltip.js) — shows a tooltip with arbitrary content (for example, buttons) on text selection.

* [`<LinearProgress/>`](https://gitlab.com/catamphetamine/frontend-lib/blob/master/components/LinearProgress.js) — renders a linear progress bar (progress indicator).

* [`<PopIconButton/>`](https://gitlab.com/catamphetamine/frontend-lib/blob/master/components/PopIconButton.js) — renders an on/off button that plays a "pop" animation when it's switched "on".

* [`<ContentSection/>`](https://gitlab.com/catamphetamine/frontend-lib/blob/master/components/ContentSection.js) — a generic section of content. Can be used to organize page content into sections.

* [`<Announcement/>`](https://gitlab.com/catamphetamine/frontend-lib/blob/master/components/Announcement.js) — renders a closeable "announcement" element.

* [`<Menu/>`](https://gitlab.com/catamphetamine/frontend-lib/blob/master/components/Menu.js) — renders a list of menu items.

* [`<Form/>`](https://gitlab.com/catamphetamine/frontend-lib/blob/master/components/Form.js) — renders a `<form/>` with fields and buttons.

* [`<DeviceInfo/>`](https://gitlab.com/catamphetamine/frontend-lib/blob/master/components/DeviceInfo.js) — returns the information about the user's device: what's the width of the screen and whether it's a touch device.

* [`<ExternalLink/>`](https://gitlab.com/catamphetamine/frontend-lib/blob/master/components/ExternalLink.js) — just a wrapper for a `<a href="..."/>` link. Only exists to accept a `to` property instead of a `href` property.

* [`Padding.css`](https://gitlab.com/catamphetamine/frontend-lib/blob/master/components/Padding.css) — Provides a utility CSS `.Padding` class.

## GitHub Ban

On March 9th, 2020, GitHub, Inc. silently [banned](https://medium.com/@catamphetamine/how-github-blocked-me-and-all-my-libraries-c32c61f061d3) my account (erasing all my repos, issues and comments) without any notice or explanation. Because of that, all source codes had to be promptly moved to GitLab. The [GitHub repo](https://github.com/catamphetamine/frontend-lib) is now only used as a backup (you can star the repo there too), and the primary repo is now the [GitLab one](https://gitlab.com/catamphetamine/frontend-lib). Issues can be reported in any repo.

## License

[MIT](LICENSE)