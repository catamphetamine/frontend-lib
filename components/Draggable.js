import React, { useState, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export default function Draggable({
	onDragStart,
	onDragEnd,
	onDragMove,
	dragOffsetThreshold,
	draggingClassName,
	className,
	children,
	...rest
}) {
	const [isDragging, setDragging] = useState(false)
	const _isDragging = useRef(false)

	const dragOrigin = useRef(null)

	const _isOverDragOffsetThreshold = useRef(false)

	const isOverDragOffsetThreshold = useCallback((x, y) => {
		return (
			(Math.abs(x - dragOrigin.current.x) > dragOffsetThreshold) ||
			(Math.abs(y - dragOrigin.current.y) > dragOffsetThreshold)
		)
	}, [
		dragOffsetThreshold
	])

	const onDragStarted = useCallback(() => {
		_isDragging.current = true
		setDragging(true)
		if (onDragStart) {
			onDragStart()
		}
	}, [
		setDragging,
		onDragStart
	])

	const onDragEnded = useCallback(() => {
		_isOverDragOffsetThreshold.current = false
		_isDragging.current = false
		setDragging(false)
		if (onDragEnd) {
			onDragEnd()
		}
	}, [
		setDragging,
		onDragEnd
	])

	const onMoveStart = useCallback((x, y) => {
		onDragStarted()
		dragOrigin.current = { x, y }
	}, [
		onDragStarted
	])

	const onMoveEnd = useCallback(() => {
		onDragEnded()
		dragOrigin.current = null
	}, [
		onDragEnded
	])

	const onMoveCancel = useCallback(() => {
		onMoveEnd()
	}, [
		onMoveEnd
	])

	const onMove = useCallback((x, y) => {
		if (_isDragging.current) {
			if (!_isOverDragOffsetThreshold.current) {
				if (isOverDragOffsetThreshold(x, y)) {
					_isOverDragOffsetThreshold.current = true
				}
			}
			if (_isOverDragOffsetThreshold.current) {
				onDragMove(x, y)
			}
		}
	}, [
		isOverDragOffsetThreshold,
		onDragMove
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
		if (_isDragging.current) {
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
		if (_isDragging.current) {
			onMoveEnd(
				event.clientX,
				event.clientY
			)
		}
	}, [
		onMoveEnd
	])

	const onPointerMove = useCallback((event) => {
		if (_isDragging.current) {
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
				'Draggable',
				className,
				isDragging && 'Draggable--dragging',
				isDragging && draggingClassName
			)}>
			{children}
		</div>
	)
}

Draggable.propTypes = {
	onDragStart: PropTypes.func,
	onDragEnd: PropTypes.func,
	onDragMove: PropTypes.func.isRequired,
	dragOffsetThreshold: PropTypes.number.isRequired,
	draggingClassName: PropTypes.string,
	className: PropTypes.string,
	children: PropTypes.node
}

Draggable.defaultProps = {
	dragOffsetThreshold: 5
}