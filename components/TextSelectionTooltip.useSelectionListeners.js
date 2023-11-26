const onSelectionEndListeners = []

let addSelectionEndListener = () => {}
let removeSelectionEndListener = () => {}
let addSelectionChangeListener = () => {}
let removeSelectionChangeListener = () => {}

// A "selection" could only exist in a web browser environment.
if (typeof window !== undefined) {
	const onSelectionEndListeners = []
	const onSelectionChangeEventListeners = []

	addSelectionEndListener = (listener) => {
		// if (onSelectionEndListeners.length === 0) {
		// 	document.addEventListener('mouseup', onSelectionEnd)
		// 	document.addEventListener('touchend', onSelectionEnd)
		// }
		onSelectionEndListeners.push(listener)
	}

	removeSelectionEndListener = (listener) => {
		const i = onSelectionEndListeners.indexOf(listener)
		onSelectionEndListeners.splice(i, 1)
		// if (onSelectionEndListeners.length === 0) {
		// 	document.removeEventListener('mouseup', onSelectionEnd)
		// 	document.removeEventListener('touchend', onSelectionEnd)
		// }
	}

	addSelectionChangeListener = (listener) => {
		// if (onSelectionChangeEventListeners.length === 0) {
		// 	document.addEventListener('selectionchange', onSelectionChange)
		// }
		onSelectionChangeEventListeners.push(listener)
	}

	removeSelectionChangeListener = (listener) => {
		const i = onSelectionChangeEventListeners.indexOf(listener)
		onSelectionChangeEventListeners.splice(i, 1)
		// if (onSelectionChangeEventListeners.length === 0) {
		// 	document.removeEventListener('selectionchange', onSelectionChange)
		// }
	}

	const onSelectionProcessEnded = () => {
		if (!document.getSelection().isCollapsed) {
			const selectionContainer = getSelectionParentElement()
			// `onSelectionEndListeners` might get modified in the process
			// by calling `removeSelectionEndListener()`.
			for (const listener of onSelectionEndListeners.slice()) {
				listener(selectionContainer)
			}
		}
	}

	const onSelectionChange = () => {
		const selection = document.getSelection()
		// `onSelectionChangeEventListeners` might get modified in the process
		// by calling `removeSelectionChangeEventListener()`.
		for (const listener of onSelectionChangeEventListeners.slice()) {
			listener(selection)
		}
	}

	const setUp = () => {
		document.addEventListener('mouseup', onSelectionProcessEnded)
		document.addEventListener('touchend', onSelectionProcessEnded)
		// document.addEventListener('mousedown', onSelectionProcessEnded)
		// document.addEventListener('touchstart', onSelectionProcessEnded)
		document.addEventListener('selectionchange', onSelectionChange)

		return () => {
			document.removeEventListener('mouseup', onSelectionProcessEnded)
			document.removeEventListener('touchend', onSelectionProcessEnded)
			// document.removeEventListener('mousedown', onSelectionProcessEnded)
			// document.removeEventListener('touchstart', onSelectionProcessEnded)
			document.removeEventListener('selectionchange', onSelectionChange)
		}
	}

	setUp()
}

export default function useSelectionListeners() {
	return {
		addSelectionEndListener,
		removeSelectionEndListener,
		addSelectionChangeListener,
		removeSelectionChangeListener
	}
}

// https://stackoverflow.com/questions/7215479/get-parent-element-of-a-selected-text
function getSelectionParentElement() {
	const selection = window.getSelection()
	if (selection.rangeCount > 0) {
		const parentElement = selection.getRangeAt(0).commonAncestorContainer
		if (parentElement.nodeType === 1) {
			return parentElement
		}
		return parentElement.parentNode
	}
}