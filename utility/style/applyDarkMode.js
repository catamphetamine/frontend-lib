/**
 * Turns Dark Model on or off.
 * @param  {boolean} shouldSwitchIntoDarkMode
 */
export default function applyDarkMode(shouldSwitchIntoDarkMode) {
	if (shouldSwitchIntoDarkMode) {
		document.documentElement.classList.add('dark')
		document.documentElement.classList.remove('light')
	} else {
		document.documentElement.classList.add('light')
		document.documentElement.classList.remove('dark')
	}
}