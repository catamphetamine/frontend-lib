import React, { useRef, useEffect, useLayoutEffect, useCallback, useState, useMemo } from 'react'
import PropTypes from 'prop-types'
// import { useTransition, animated } from 'react-spring'
import { usePopper } from 'react-popper'

export default function TextSelectionTooltip({
	as: Component,
	TooltipComponent,
	tooltipProps,
	container,
	children,
	...rest
}) {
	const isSelectionInProgress = useRef()
	const isSelected = useRef()

	const [isTooltipShown, setTooltipShown] = useState()
	const [selection, setSelection] = useState()

	const containerRef = useRef()
	const customContainer = useMemo(() => container, [])
	const getContainer = useCallback(() => container || containerRef.current, [])

	const [tooltipElement, setTooltipElement] = useState()
	const updateTooltipPositionTimer = useRef()

	// The `popper` library calculates an appropriate tooltip position
	// based on the screen space available for it on top/bottom/left/right.
	// It also automatically re-calculates such tooltip position
	// on events like "scroll", "resize", etc.
	// It also exposes a manual `forceUpdate()` function
	// that is used to update tooltip position on selection change.
	const {
		styles,
		attributes,
		forceUpdate: updateTooltipPosition
	} = usePopper(
		SelectionVirtualElement,
		tooltipElement
	)

	const shouldUpdateTooltipPosition = useRef()

  // const { styles, attributes }
  // const tooltipPlacement = state && state.placement

	// This function doesn't declare any "dependencies"
	// because it's used in a listener, and a listener reference
	// should stay the same in order to be removed later,
	// so it shouldn't be updated (shouldn't have any "dependencies").
	//
	// A selection can be "cleared" while still being in progress.
	//
	const onSelectionClear = useCallback(() => {
		setTooltipShown(false)
		setSelection(undefined)
		isSelected.current = false
	}, [])

	// This function doesn't declare any "dependencies"
	// because it's used in a listener, and a listener reference
	// should stay the same in order to be removed later,
	// so it shouldn't be updated (shouldn't have any "dependencies").
	const onSelectionFinished = useCallback(() => {
		setTooltipShown(true)
		shouldUpdateTooltipPosition.current = true
		setSelection(new Selection({
			onClear: onSelectionClear
		}))
	}, [])

	// This function doesn't declare any "dependencies"
	// because it's used in a listener, and a listener reference
	// should stay the same in order to be removed later,
	// so it shouldn't be updated (shouldn't have any "dependencies").
	const _onSelectionEnd = useCallback(() => {
		isSelectionInProgress.current = false
		removeSelectionEndListener(onSelectionEnd)
	}, [])

	// This listener doesn't declare any "dependencies"
	// because a listener reference should stay the same
	// in order to be removed later.
	const onSelectionEnd = useCallback((selectionContainer) => {
		_onSelectionEnd()
		const contains = getContainer().contains(selectionContainer)
		if (contains) {
			onSelectionFinished()
		} else {
			// A selection has been made outside the container.
			onSelectionClear()
		}
	}, [])

	// This function doesn't declare any "dependencies"
	// because it's used in a listener, and a listener reference
	// should stay the same in order to be removed later,
	// so it shouldn't be updated (shouldn't have any "dependencies").
	const onSelectionStart = useCallback(() => {
		isSelected.current = true
		isSelectionInProgress.current = true
		addSelectionEndListener(onSelectionEnd)
	}, [])

	// This function doesn't declare any "dependencies"
	// because it's used in a listener, and a listener reference
	// should stay the same in order to be removed later,
	// so it shouldn't be updated (shouldn't have any "dependencies").
	const onSelectionChange = useCallback(() => {
		// Doesn't do anything.
	}, [])

	// This listener doesn't declare any "dependencies"
	// because a listener reference should stay the same
	// in order to be removed later.
	const onSelectionChangeEventListener = useCallback((selection) => {
		// There's no `selectionstart` DOM event, so "selection started"
		// condition is detected during `selectionchange` DOM event.
		// The subsequent `selectionchange` DOM events are treated as
		// proper "selection changed" events.
		// Also, "unselected" condition is detected here.
		if (selection.isCollapsed) {
			// A user has "unselected" the previous selection,
			// which triggered `selectionchange` event.
			if (isSelected.current) {
				// A selection can be "cleared" while still being in progress.
				onSelectionClear()
			}
		} else if (isSelectionInProgress.current) {
			// A user has changed the previous selection into a new selection,
			// which triggered `selectionchange` event.
			// This is a hacky "workaround" case.
			// This could happen, for example, when a user quickly
			// selects different portions of content on a page:
			// in that case, by the time `selectionchange` event is handled,
			// the new selection is already non-"empty".
			onSelectionChange()
		} else {
			// A user has started selecting content,
			// which triggered `selectionchange` event.
			onSelectionStart()
		}
	}, [])

	useEffect(() => {
		addSelectionChangeEventListener(onSelectionChangeEventListener)
		return () => {
			removeSelectionChangeEventListener(onSelectionChangeEventListener)
			if (isSelectionInProgress.current) {
				_onSelectionEnd()
			}
			if (updateTooltipPositionTimer.current) {
				clearTimeout(updateTooltipPositionTimer.current)
				updateTooltipPositionTimer.current = undefined
			}
		}
	}, [])

	// First, `isTooltipShown` is set to `true` when selection is finished.
	// Then, `<TooltipComponent/>` is rendered.
	// Then, `<TooltipComponent/>` mounts and sets the `ref`.
	// Then, `usePopper()` detects that the `ref` has been set,
	// and makes `updateTooltipPosition()` function available
	// so that it could calculate the correct tooltip position.
	// So, only at that step can tooltip position be updated.
	//
	// This effect is run on every re-render
	// but it only does its thing once.
	//
	useLayoutEffect(() => {
		if (shouldUpdateTooltipPosition.current) {
			if (updateTooltipPosition) {
				// `react-popper` library seems to be no longer maintained.
				// There's a bug when it shows a React warning in the console:
				// "Warning: flushSync was called from inside a lifecycle method.
				//  React cannot flush when React is already rendering.
				//  Consider moving this call to a scheduler task or micro task."
				// https://github.com/floating-ui/react-popper/issues/458
				//
				// Some have suggested calling `Promise.resolve().then(updateTooltipPosition)`
				// instead of just `updateTooltipPosition()` to work around that bug.
				// The rationale for the suggested workaround is that `updateTooltipPosition()` function,
				// which is `react-popper`'s `forceUpdate()` function, calls `flushSync()` inside.
				// Therefore, it shouldn't be called in a callback right after the component has re-rendered
				// because that results in a second render right after the first one, and React doesn't like that,
				// presumably for performance reasons. Spacing out those two renders in time
				// via `Promise.resolve()` seems to fix the React warning.
				//
				// Update: I've tested the suggested `Promise.resolve()` approach
				// and it doesn't really work and the warning is still being shown.
				// What worked though is `setTimeout(updateTooltipPosition, 0)`.
				//
				if (updateTooltipPositionTimer.current) {
					clearTimeout(updateTooltipPositionTimer.current)
					updateTooltipPositionTimer.current = undefined
				}
				updateTooltipPositionTimer.current = setTimeout(() => {
					updateTooltipPositionTimer.current = undefined
					if (isSelected.current) {
						updateTooltipPosition()
					}
				}, 0)

				shouldUpdateTooltipPosition.current = false
			}
		}
	})

	// const distance = 30 // in `px`
	// const scale = 0.9
	// const transitions = useTransition(isTooltipShown + tooltipPlacement, null, {
	// 	unique: true,
	// 	from: {
	// 		transform: `translateY(${tooltipPlacement === 'bottom' ? '' : '-'}${px(distance)}) scale(${scaleFactor(scale)})`,
	// 		opacity: 0
	// 	},
	// 	enter: {
	// 		transform: `translateY(0) scale(1)`,
	// 		opacity: 1
	// 	},
	// 	leave: {
	// 		transform: `translateY(${tooltipPlacement === 'bottom' ? '' : '-'}${px(distance)}) scale(${scaleFactor(scale)})`,
	// 		opacity: 0
	// 	}
	// })
	//
	// const AnimatedTooltipComponent = animated(TooltipComponent)

	return (
		<>
			{customContainer &&
				children
			}
			{!customContainer &&
				<Component ref={containerRef} {...rest}>
					{children}
				</Component>
			}
			{isTooltipShown &&
				<TooltipComponent
					ref={setTooltipElement}
					style={styles.popper}
					selection={selection}
					{...tooltipProps}/>
			}
		</>
	)
}

// import { Manager, Popper } from 'react-popper'

// const TOOLTIP_PLACEMENT = 'top'
// const POPPER_MODIFIERS = [{
// 	name: 'flip'
// }]

// const [tooltipPlacement, setTooltipPlacement] = useState(TOOLTIP_PLACEMENT)

// <Manager>
// 	<Popper placement={TOOLTIP_PLACEMENT} modifiers={POPPER_MODIFIERS}>
// 		{({ ref, style, placement }) => {
// 			setTooltipPlacement(placement)
// 			return (
// 				<>
// 					<AnimatedTooltipComponent
// 						key="single"
// 						ref={ref}
// 						style={{
// 							...style,
// 							...props
// 						}} .../>
// 				</>
// 			)
// 		}}
// 	</Popper>
// </Manager>

TextSelectionTooltip.propTypes = {
	as: PropTypes.elementType,
	// `TooltipComponent` must forward `ref`.
	// Receives properties: `selection: Selection` and `clearSelection: function`.
	TooltipComponent: PropTypes.elementType.isRequired,
	tooltipProps: PropTypes.object,
	// A `container` element is required in order to determine
	// whether a selection is within its bounds: if a selection
	// is outside the container, then the tooltip isn't shown.
	// A selection could be anywhere on a page, including starting
	// inside the container and ending outside of it.
	// If the `container` property is not passed,
	// `children` are wrapped in a `<div/>`.
	container: PropTypes.any, // `instanceOf(Element)` wouldn't work in Node.js.
	children: PropTypes.node.isRequired
}

TextSelectionTooltip.defaultProps = {
	as: 'div'
}

const onSelectionEndListeners = []

function addSelectionEndListener(listener) {
	if (onSelectionEndListeners.length === 0) {
		listenSelectionEnd()
	}
	onSelectionEndListeners.push(listener)
}

function removeSelectionEndListener(listener) {
	const i = onSelectionEndListeners.indexOf(listener)
	onSelectionEndListeners.splice(i, 1)
	if (onSelectionEndListeners.length === 0) {
		unlistenSelectionEnd()
	}
}

function onSelectionEnd() {
	if (!document.getSelection().isCollapsed) {
		const selectionContainer = getSelectionParentElement()
		// `onSelectionEndListeners` might get modified in the process
		// by calling `removeSelectionEndListener()`.
		for (const listener of onSelectionEndListeners.slice()) {
			listener(selectionContainer)
		}
	}
}

function listenSelectionEnd() {
	document.addEventListener('mouseup', onSelectionEnd)
	document.addEventListener('touchend', onSelectionEnd)
}

function unlistenSelectionEnd() {
	document.removeEventListener('mouseup', onSelectionEnd)
	document.removeEventListener('touchend', onSelectionEnd)
}

const onSelectionChangeEventListeners = []

function addSelectionChangeEventListener(listener) {
	if (onSelectionChangeEventListeners.length === 0) {
		listenSelectionChange()
	}
	onSelectionChangeEventListeners.push(listener)
}

function removeSelectionChangeEventListener(listener) {
	const i = onSelectionChangeEventListeners.indexOf(listener)
	onSelectionChangeEventListeners.splice(i, 1)
	if (onSelectionChangeEventListeners.length === 0) {
		unlistenSelectionChange()
	}
}

function onSelectionChangeEventListener() {
	const selection = document.getSelection()
	// `onSelectionChangeEventListeners` might get modified in the process
	// by calling `removeSelectionChangeEventListener()`.
	for (const listener of onSelectionChangeEventListeners.slice()) {
		listener(selection)
	}
}

function listenSelectionChange() {
	document.addEventListener('selectionchange', onSelectionChangeEventListener)
}

function unlistenSelectionChange() {
	document.removeEventListener('selectionchange', onSelectionChangeEventListener)
}

// https://stackoverflow.com/questions/7215479/get-parent-element-of-a-selected-text
function getSelectionParentElement() {
  const selection = window.getSelection()
  if (selection.rangeCount) {
    const parentElelment = selection.getRangeAt(0).commonAncestorContainer
    if (parentElelment.nodeType === 1) {
    	return parentElelment
    }
    return parentElelment.parentNode
  }
}

// https://popper.js.org/react-popper/v2/virtual-elements/
const SelectionVirtualElement = {
  getBoundingClientRect() {
    return window.getSelection().getRangeAt(0).getBoundingClientRect()
  }
}

class Selection {
	constructor({ onClear }) {
		// this.selection = selection
		this.onClear = onClear
	}

	getSelection() {
		return window.getSelection()
	}

	getText() {
		return this.getSelection().toString()
	}

	clear() {
		const selection = this.getSelection()
		// Chrome
		if (selection.empty) {
			selection.empty()
		}
		// Firefox
		else if (selection.removeAllRanges) {
			selection.removeAllRanges()
		}
		// Hide the tooltip.
		this.onClear()
	}
}