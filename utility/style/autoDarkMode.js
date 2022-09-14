/**
 * Enables or disables "auto" dark mode.
 * "Auto" dark mode uses the operating system preference
 * to determine whether the app should switch itself
 * into dark mode or light mode.
 * @param {boolean} enableAutoDarkMode
 * @param {func} [onSetDarkMode] — Is required if `enableAutoDarkMode` is `true`.
 */
let disableAutoDarkMode
export default function autoDarkMode(enable, { setDarkMode }) {
	if (!enable && disableAutoDarkMode) {
		disableAutoDarkMode()
		disableAutoDarkMode = undefined
	} else if (enable && !disableAutoDarkMode) {
		disableAutoDarkMode = enableAutoDarkMode({ setDarkMode })
	}
}

/**
 * Sets a color scheme for the website.
 * If browser supports "prefers-color-scheme"
 * it will respect the setting for light or dark mode.
 * Will fall back to light mode by default.
 * https://medium.com/@jonas_duri/enable-dark-mode-with-css-variables-and-javascript-today-66cedd3d7845
 */
function enableAutoDarkMode({ setDarkMode }) {
	const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
	const isLightMode = window.matchMedia('(prefers-color-scheme: light)').matches
	const isNotSpecified = window.matchMedia('(prefers-color-scheme: no-preference)').matches
	const hasNoSupport = !isDarkMode && !isLightMode && !isNotSpecified

	// Watch "dark" mode.
	const darkModeWatcher = window.matchMedia('(prefers-color-scheme: dark)')
	const darkModeListener = (event) => {
		if (event.matches) {
			setDarkMode(true)
		}
	}
	// Old browsers don't support `.addEventListener()`.
	if (darkModeWatcher.addEventListener) {
		darkModeWatcher.addEventListener('change', darkModeListener)
	} else {
		darkModeWatcher.addListener(darkModeListener)
	}

	// Watch "light" mode.
	const lightModeWatcher = window.matchMedia('(prefers-color-scheme: light)')
	const lightModeListener = (event) => {
		if (event.matches) {
			setDarkMode(false)
		}
	}
	// Old browsers don't support `.addEventListener()`.
	if (lightModeWatcher.addEventListener) {
		lightModeWatcher.addEventListener('change', lightModeListener)
	} else {
		lightModeWatcher.addListener(lightModeListener)
	}

	if (isDarkMode) {
		setDarkMode(true)
	} else if (isLightMode) {
		setDarkMode(false)
	} else if (isNotSpecified || hasNoSupport) {
		setDarkMode(false)
	}

	return () => {
		// Old browsers don't support `.removeEventListener()`.
		if (darkModeWatcher.removeEventListener) {
			darkModeWatcher.removeEventListener('change', darkModeListener)
		} else {
			darkModeWatcher.removeListener(darkModeListener)
		}
		// Old browsers don't support `.removeEventListener()`.
		if (lightModeWatcher.removeEventListener) {
			lightModeWatcher.removeEventListener('change', lightModeListener)
		} else {
			lightModeWatcher.removeListener(lightModeListener)
		}
	}
}
