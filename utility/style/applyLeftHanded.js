/**
 * Turns Left-Handed mode on or off.
 * @param  {boolean} leftHanded
 */
export default function applyLeftHanded(leftHanded) {
	if (leftHanded) {
		document.documentElement.classList.add('Document--leftHanded')
	} else {
		document.documentElement.classList.remove('Document--leftHanded')
	}
}