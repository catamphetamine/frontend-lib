export const FONT_SIZES = [
	'xs',
	's',
	'm',
	'l',
	'xl'
]

/**
 * Applies font size to document.
 * Both `html` and `body` elements are required to be updated
 * because `html` is required in order for `rem`s to work
 * and without `body` changing fonts doesn't work for some weird reason.
 * @param  {string} fontSize
 */
export default function applyFontSize(fontSize) {
	for (const fontSize of FONT_SIZES) {
		document.documentElement.classList.remove(`font-size--${fontSize}`)
		document.body.classList.remove(`font-size--${fontSize}`)
	}
	document.documentElement.classList.add(`font-size--${fontSize}`)
	document.body.classList.add(`font-size--${fontSize}`)
}
