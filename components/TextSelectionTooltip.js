import React, { useRef, useEffect, useLayoutEffect, useCallback, useState, useMemo } from 'react'
import PropTypes from 'prop-types'

import {
	useFloating,
	flip,
	shift,
	inline,
	autoUpdate
} from '@floating-ui/react'

import useSelectionListeners from './TextSelectionTooltip.useSelectionListeners.js'

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

	const {
		addSelectionEndListener,
		removeSelectionEndListener,
		addSelectionChangeListener,
		removeSelectionChangeListener
	} = useSelectionListeners()

	// Copy-pasted from:
	// https://codesandbox.io/s/floating-ui-react-range-selection-forked-svj76y

	// https://floating-ui.com/docs/useFloating
	const { x, y, strategy, refs, context } = useFloating({
		placement: 'top',
		open: isTooltipShown,
		onOpenChange: setTooltipShown,
		middleware: [inline(), flip(), shift()],
		whileElementsMounted: autoUpdate
	})

	// This function doesn't declare any "dependencies"
	// because it's used in a listener, and a listener reference
	// should stay the same in order to be removed later,
	// so it shouldn't be updated (shouldn't have any "dependencies").
	const updateSelectionRect = useCallback(() => {
		if (window.getSelection().rangeCount > 0) {
			const selectionRange = window.getSelection().getRangeAt(0)
			refs.setReference({
				getBoundingClientRect: () => selectionRange.getBoundingClientRect(),
				getClientRects: () => selectionRange.getClientRects()
			})
			// Don't auto-update the tooltip position as the user keeps dragging their mouse
			// when selecting a block of text.
			// setTooltipShown(true)
		}
	}, [])

	// const shouldUpdateTooltipPosition = useRef()

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
		updateSelectionRect()
		setTooltipShown(true)
		// shouldUpdateTooltipPosition.current = true
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
		// When Chrome is switched into "touch" mode in developer tools:
		// * Long-press on a word.
		// * Tooltip appears.
		// * Long-press on another word.
		// * `onSelectionStart()` will get called, but `onSelectionChange()` won't,
	  //   and neither `onSelectionEnd()` will. That's why it calls `updateSelectionRect()` here too.
		updateSelectionRect()
		isSelected.current = true
		isSelectionInProgress.current = true
		addSelectionEndListener(onSelectionEnd)
	}, [])

	// This function doesn't declare any "dependencies"
	// because it's used in a listener, and a listener reference
	// should stay the same in order to be removed later,
	// so it shouldn't be updated (shouldn't have any "dependencies").
	const onSelectionChange = useCallback(() => {
		if (window.getSelection().isCollapsed) {
			setTooltipShown(false)
		} else {
			updateSelectionRect()
		}
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
		addSelectionChangeListener(onSelectionChangeEventListener)
		return () => {
			removeSelectionChangeListener(onSelectionChangeEventListener)
			if (isSelectionInProgress.current) {
				_onSelectionEnd()
			}
		}
	}, [])

	// Both `children` and `<TooltipComponent/>` will be put inside `<Component/>` container.
	// The reason is that previously `<TooltipComponent/>` was rendered after `<Component/>` container
	// and it created issues with CSS styles like `.Component + .OtherComponent`:
	// those styles were broken when anything was selected because a `.TooltipComponent` element
	// was rendered in-between those two.

	const elements = (
		<>
			{children}
			{isTooltipShown &&
				<TooltipComponent
					ref={refs.setFloating}
					style={{
						position: strategy,
						left: x || 0,
						top: y || 0
					}}
					selection={selection}
					{...tooltipProps}
				/>
			}
		</>
	)

	return (
		<>
			{customContainer &&
				elements
			}
			{!customContainer &&
				<Component ref={containerRef} {...rest}>
					{elements}
				</Component>
			}
		</>
	)
}

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