import React, { useState, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { belongsToClickableElement, openLinkInNewTab } from 'web-browser-input'

export default function Clickable({
	cursor = undefined,
	panOffsetThreshold = 5,
	doubleClickMaxInterval = 400,
	filter = undefined,
	url = undefined,
	onDoubleClick = undefined,
	onClick = undefined,
	onClickClassName = undefined,
	className = undefined,
	children,
	...rest
}) {
	if (onDoubleClick && onClick) {
		console.warn('<Clickable/> supports either `onClick` or `onDoubleClick`, not both')
	}

	const [isClickInProgress, setClickInProgress] = useState(false)
	const _isClickInProgress = useRef(false)

	const emulateStandardHyperlinkOnClickBehavior = useRef()
	const container = useRef()
	const panOrigin = useRef(null)
	const clicks = useRef([])

	const filterElement = useCallback((element) => {
		if (belongsToClickableElement(element, { stopBefore: container.current })) {
			return false
		}
		if (filter && !filter(element)) {
			return false
		}
		return true
	}, [
		filter
	])

	const isOverTheThreshold = useCallback((x, y) => {
		return (
			(Math.abs(x - panOrigin.current.x) > panOffsetThreshold) ||
			(Math.abs(y - panOrigin.current.y) > panOffsetThreshold)
		)
	}, [
		panOffsetThreshold
	])

	const onClickStart = useCallback((event) => {
		_isClickInProgress.current = true
		setClickInProgress(true)
		clicks.current.push({ at: Date.now(), event })
		if (clicks.current.length > 10) {
			clicks.current = clicks.current.slice(-10)
		}
	}, [
		setClickInProgress
	])

	const onClickStop = useCallback(() => {
		_isClickInProgress.current = false
		setClickInProgress(false)
		emulateStandardHyperlinkOnClickBehavior.current = undefined
	}, [
		setClickInProgress
	])

	const _onClick = useCallback((event) => {
		if (filterElement(event.target)) {
			event.preventDefault()
		}
	}, [
		filterElement
	])

	const onPanStart = useCallback((x, y, event) => {
		onClickStart(event)
		panOrigin.current = { x, y }
	}, [
		onClickStart
	])

	const onPanStop = useCallback(() => {
		onClickStop()
		panOrigin.current = null
	}, [
		onClickStop
	])

	const onPanCancel = useCallback(() => {
		onPanStop()
	}, [
		onPanStop
	])

	const onPan = useCallback((x, y) => {
		if (_isClickInProgress.current) {
			if (isOverTheThreshold(x, y)) {
				onPanStop()
			}
		}
	}, [
		isOverTheThreshold,
		onPanStop
	])

	// Simulates an `event` argument.
	// Such an `event` has `.preventDefault()` and `.stopPropatation()` methods.
	const createEvent = useCallback(() => {
		return {
			...clicks.current[clicks.current.length - 1].event,
			defaultPrevented: false,
			preventDefault() {
				this.defaultPrevented = true
			},
			stopPropagation() {}
		}
	}, [])

	const onClickHappened = useCallback(() => {
		const defaultOnClickBehavior = () => {
			if (url) {
				openLinkInNewTab(url)
			}
		}
		if (emulateStandardHyperlinkOnClickBehavior.current || !(onClick || onDoubleClick)) {
			defaultOnClickBehavior()
		} else {
			if (onDoubleClick) {
				// Filter "previous clicks" by same `event.type`.
				// This works around the cases when `onDoubleClick` handler
				// was called for a single-click scenario on a mobile device
				// due to it emitting both `touchstart` and `click` events.
				//
				// Possible `event.type` values:
				// * `mousedown`
				// * `touchstart`
				// * (maybe) `pointerdown`
				//
				// Also filter by same `event.target` so that it only triggers a double-click event
				// when making two clicks on the same DOM Element.
				//
				const latestClick = clicks.current[clicks.current.length - 1]
				const clicks_ = clicks.current.filter((click) => {
					return click.event.type === latestClick.event.type &&
						click.event.target === latestClick.event.target
				})
				if (clicks_.length > 1) {
					if (clicks_[clicks_.length - 1].at - clicks_[clicks_.length - 2].at <= doubleClickMaxInterval) {
						onDoubleClick(createEvent())
					}
				}
			} else {
				const event = createEvent()
				onClick(event)
				if (!event.defaultPrevented) {
					defaultOnClickBehavior()
				}
			}
		}
	}, [
		url,
		onClick,
		onDoubleClick,
		createEvent
	])

	const onPanEnd = useCallback((x, y) => {
		if (_isClickInProgress.current) {
			onClickHappened()
		}
		onPanStop()
	}, [
		onClickHappened,
		onPanStop
	])

	const onTouchCancel = useCallback(() => {
		onPanCancel()
	}, [
		onPanCancel
	])

	const onTouchStart = useCallback((event) => {
		// Ignore multitouch.
		if (event.touches.length > 1) {
			// Reset.
			return onTouchCancel()
		}
		if (!filterElement(event.target)) {
			return
		}
		onPanStart(
			event.changedTouches[0].clientX,
			event.changedTouches[0].clientY,
			event
		)
	}, [
		filterElement,
		onTouchCancel,
		onPanStart
	])

	const onTouchEnd = useCallback((event) => {
		onPanEnd(
			event.changedTouches[0].clientX,
			event.changedTouches[0].clientY
		)
	}, [
		onPanEnd
	])

	const onTouchMove = useCallback((event) => {
		if (_isClickInProgress.current) {
			onPan(
				event.changedTouches[0].clientX,
				event.changedTouches[0].clientY
			)
		}
	}, [
		onPan
	])

	const onPointerDown = useCallback((event) => {
		switch (event.button) {
			// Left mouse button.
			case 0:
				// If there's a "modifier" key pressed, emulate the standard hyperlink behavior.
				// https://github.com/vercel/next.js/blob/0c3cc04591349fd9c64f05a5880e93a685283843/packages/next/src/client/link.tsx#L176-L187
				if (
					event.metaKey ||
					event.ctrlKey ||
					event.shiftKey ||
					event.altKey
				) {
					if (url) {
						emulateStandardHyperlinkOnClickBehavior.current = true
					}
				}
				break
			// Middle mouse button.
			case 1:
				if (url) {
					// `.preventDefault()` to prevent the web browser
					// from showing the "all-scroll" cursor.
					event.preventDefault()
					emulateStandardHyperlinkOnClickBehavior.current = true
					break
				}
				return onPanCancel()
			// Right mouse button.
			case 2:
			default:
				// Cancel panning when two mouse buttons are clicked simultaneously.
				return onPanCancel()
		}
		if (!filterElement(event.target)) {
			return onPanCancel()
		}
		onPanStart(
			event.clientX,
			event.clientY,
			event
		)
	}, [
		url,
		onPanStart,
		onPanCancel,
		filterElement
	])

	const onPointerUp = useCallback((event) => {
		if (_isClickInProgress.current) {
			onPanEnd(
				event.clientX,
				event.clientY
			)
		}
	}, [
		onPanEnd
	])

	const onPointerMove = useCallback((event) => {
		if (_isClickInProgress.current) {
			onPan(
				event.clientX,
				event.clientY
			)
		}
	}, [
		onPan
	])

	// https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/pointerout_event
	// The pointerout event is fired for several reasons including:
	// * pointing device is moved out of the hit test boundaries of an element (`pointerleave`);
	// * firing the pointerup event for a device that does not support hover (see `pointerup`);
	// * after firing the pointercancel event (see `pointercancel`);
	// * when a pen stylus leaves the hover range detectable by the digitizer.
	const onPointerOut = useCallback(() => {
		onPanCancel()
	}, [
		onPanCancel
	])

	// Safari doesn't support pointer events.
	// https://caniuse.com/#feat=pointer
	// https://webkit.org/status/#?search=pointer%20events
	// onPointerDown={onPointerDown}
	// onPointerUp={onPointerUp}
	// onPointerMove={onPointerMove}
	// `PointerOut` event is fired for several reasons including:
	// * Pointer is moved out of the hit test boundaries of an element.
	// * Firing the pointerup event for a device that does not support hover.
	// * After firing the `pointercancel` event.
	// * When a pen stylus leaves the hover range detectable by the digitizer.
	// onPointerOut={onPointerOut}

	return (
		<div
			{...rest}
			ref={container}
			onDragStart={onPointerOut}
			onTouchStart={onTouchStart}
			onTouchEnd={onTouchEnd}
			onTouchCancel={onTouchCancel}
			onTouchMove={onTouchMove}
			onMouseDown={onPointerDown}
			onMouseUp={onPointerUp}
			onMouseMove={onPointerMove}
			onMouseLeave={onPointerOut}
			onClick={_onClick}
			style={cursor ? CURSOR_STYLES[cursor] : undefined}
			className={classNames(
				'Clickable',
				className,
				isClickInProgress && 'Clickable--active',
				isClickInProgress && onClickClassName
			)}>
			{children}
		</div>
	)
}

Clickable.propTypes = {
	cursor: PropTypes.oneOf(['pointer']),
	panOffsetThreshold: PropTypes.number,
	onClick: PropTypes.func,
	// Standard React's `onDoubleClick` event handler doesn't work for touch events.
	// `<Clickable onDoubleClick/>` does.
	onDoubleClick: PropTypes.func,
	url: PropTypes.string,
	filter: PropTypes.func,
	onClickClassName: PropTypes.string,
	className: PropTypes.string,
	children: PropTypes.node
}

const CURSOR_STYLES = {
	pointer: { cursor: 'pointer' }
}