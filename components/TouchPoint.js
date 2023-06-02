import React, { useState, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export default function TouchPoint({
	onChange,
	touchingClassName,
	className,
	children,
	...rest
}) {
	const [isTouching, setTouching] = useState(false)
	const _isTouching = useRef(false)

	const touchOrigin = useRef(null)

	const onTouchStarted = useCallback(() => {
		_isTouching.current = true
		setTouching(true)
	}, [
		setTouching
	])

	const onTouchEnded = useCallback(() => {
		_isTouching.current = false
		setTouching(false)
		onChange(null, null)
	}, [
		setTouching,
		onChange
	])

	const onMoveStart = useCallback((x, y) => {
		onTouchStarted()
		touchOrigin.current = { x, y }
	}, [
		onTouchStarted
	])

	const onMoveEnd = useCallback(() => {
		onTouchEnded()
		touchOrigin.current = null
	}, [
		onTouchEnded
	])

	const onMoveCancel = useCallback(() => {
		onMoveEnd()
	}, [
		onMoveEnd
	])

	const onMove = useCallback((x, y) => {
		if (_isTouching.current) {
			onChange(x, y)
		}
	}, [
		onChange
	])

	const onTouchCancel = useCallback(() => {
		onMoveCancel()
	}, [
		onMoveCancel
	])

	const onTouchStart = useCallback((event) => {
		// Ignore multitouch.
		if (event.touches.length > 1) {
			// Reset.
			return onTouchCancel()
		}
		onMoveStart(
			event.changedTouches[0].clientX,
			event.changedTouches[0].clientY
		)
	}, [
		onTouchCancel,
		onMoveStart
	])

	const onTouchEnd = useCallback((event) => {
		onMoveEnd(
			event.changedTouches[0].clientX,
			event.changedTouches[0].clientY
		)
	}, [
		onMoveEnd
	])

	const onTouchMove = useCallback((event) => {
		if (_isTouching.current) {
			onMove(
				event.changedTouches[0].clientX,
				event.changedTouches[0].clientY
			)
		}
	}, [
		onMove
	])

	const onPointerDown = useCallback((event) => {
		switch (event.button) {
			// Left mouse button.
			case 0:
				break
			// Middle mouse button.
			case 1:
				return onMoveCancel()
			// Right mouse button.
			case 2:
			default:
				// Cancel drag when two mouse buttons are clicked simultaneously.
				return onMoveCancel()
		}
		onMoveStart(
			event.clientX,
			event.clientY
		)
	}, [
		onMoveStart,
		onMoveCancel
	])

	const onPointerUp = useCallback((event) => {
		if (_isTouching.current) {
			onMoveEnd(
				event.clientX,
				event.clientY
			)
		}
	}, [
		onMoveEnd
	])

	const onPointerMove = useCallback((event) => {
		if (_isTouching.current) {
			onMove(
				event.clientX,
				event.clientY
			)
		}
	}, [
		onMove
	])

	// https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/pointerout_event
	// The pointerout event is fired for several reasons including:
	// * pointing device is moved out of the hit test boundaries of an element (`pointerleave`);
	// * firing the pointerup event for a device that does not support hover (see `pointerup`);
	// * after firing the pointercancel event (see `pointercancel`);
	// * when a pen stylus leaves the hover range detectable by the digitizer.
	const onPointerOut = useCallback(() => {
		onMoveCancel()
	}, [
		onMoveCancel
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
			className={classNames(
				'TouchPoint',
				className,
				isTouching && 'TouchPoint--touching',
				isTouching && touchingClassName
			)}>
			{children}
		</div>
	)
}

TouchPoint.propTypes = {
	onChange: PropTypes.func.isRequired,
	touchingClassName: PropTypes.string,
	className: PropTypes.string,
	children: PropTypes.node
}