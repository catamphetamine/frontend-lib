// Atom One Light color scheme
// https://levelup.gitconnected.com/10-pretty-light-themes-for-vs-code-80dbf6405f39
const GRAY_COLOR = '#909196'
const RED_COLOR = '#c73330'
const PURPLE_COLOR = '#a42ea2'
const BLUE_COLOR = '#447bef'
const NAVY_COLOR = '#1485ba'
const GREEN_COLOR = '#1c7e1c'
const BROWN_COLOR = '#976715'
const BLACK_COLOR = '#383a42'
const WHITE_COLOR = '#fafafa'

const NAMESPACE_COLOR = GRAY_COLOR
const ACCENT_COLOR = RED_COLOR
const BACKGROUND_COLOR = WHITE_COLOR

// Colors in `console.log` output:
// https://stackoverflow.com/questions/7505623/colors-in-javascript-console
// https://developer.mozilla.org/en-US/docs/Web/API/console#usage

export default function createLog(namespace) {
	return (...args) => {
		if (!isLogEnabled()) {
			return
		}
		let consoleLogArgs
		let message = `%c${namespace}`
		const styles = [`color: ${NAMESPACE_COLOR}; background-color: ${BACKGROUND_COLOR}`]
		let accent
		let i = 0
		while (i < args.length) {
			const substring = args[i]
			// Stops at first non-string argument.
			if (typeof substring !== 'string') {
				consoleLogArgs = [message, ...styles, ...args.slice(i)]
				break
			}
			if (substring === ':accent') {
				accent = true
			} else {
				message += ' ' + '%c' + substring
				if (accent) {
					styles.push(`color: ${ACCENT_COLOR}; background-color: ${BACKGROUND_COLOR}`)
					accent = false
				} else {
					styles.push(`color: ${BLACK_COLOR}; background-color: ${BACKGROUND_COLOR}`)
				}
			}
			if (i === args.length - 1) {
				consoleLogArgs = [message, ...styles]
			}
			i++
		}
		console.log.apply(console, consoleLogArgs)
	}
}

function isLogEnabled() {
	// return window.Debug === true
	return window.location.hostname === 'localhost'
}