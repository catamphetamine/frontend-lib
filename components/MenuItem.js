import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Button from './ButtonAsync.js'
import PopIconButton from './PopIconButton.js'

import './MenuItem.css'

export default function MenuItem({
	onClick,
	url,
	title,
	icon,
	iconSelected,
	iconActive,
	iconSelectedActive,
	wait,
	animate,
	size,
	pathname,
	isSelected,
	Link,
	className
}) {
	const Icon = icon
	const IconWhenSelected = iconSelected || Icon
	const ActiveIcon = iconActive || Icon
	const ActiveIconWhenSelected = iconSelectedActive || IconWhenSelected

	if (url) {
		// `url` may contain query parameters.
		isSelected = (isSelected === undefined ? true : isSelected) && pathname === getPathname(url)
	}

	className = classNames(
		className,
		isSelected && className && `${className}--selected`,
		'MenuItem',
		size && `MenuItem--size--${size}`,
		isSelected && 'MenuItem--selected'
	)

	const popIconButtonIcon = useCallback((props) => {
		if (ActiveIcon) {
			return (
				<div {...props}>
					<Icon className="MenuItem-activeOrNotActive-notActive"/>
					<ActiveIcon className="MenuItem-activeOrNotActive-active"/>
				</div>
			)
		}
		return <Icon {...props}/>
	}, [
		Icon,
		ActiveIcon
	])

	const popIconButtonSelectedIcon = useCallback((props) => {
		if (ActiveIconWhenSelected) {
			return (
				<div {...props}>
					<IconWhenSelected className="MenuItem-activeOrNotActive-notActive"/>
					<ActiveIconWhenSelected className="MenuItem-activeOrNotActive-active"/>
				</div>
			)
		}
		return <IconWhenSelected {...props}/>
	}, [
		IconWhenSelected,
		ActiveIconWhenSelected
	])

	if (animate === 'pop') {
		return (
			<PopIconButton
				value={isSelected}
				onIcon={popIconButtonSelectedIcon}
				offIcon={popIconButtonIcon}
				title={title}
				buttonComponent={Button}
				onClick={onClick}
				className={className}
				iconClassName="MenuItem-icon MenuItem-icon--pop"
			/>
		)
	}

	const children = (
		<React.Fragment>
			<Icon className="MenuItem-icon MenuItem-icon--idle"/>
			<IconWhenSelected className="MenuItem-icon MenuItem-icon--selected"/>
			<ActiveIcon className="MenuItem-icon MenuItem-icon--idleActive"/>
			<ActiveIconWhenSelected className="MenuItem-icon MenuItem-icon--selectedActive"/>
		</React.Fragment>
	)

	if (onClick) {
		return (
			<Button
				wait={wait}
				title={title}
				onClick={onClick}
				className={className}>
				{children}
			</Button>
		)
	}

	if (url) {
		return (
			<Link
				to={url}
				title={title}
				className={className}>
				{children}
			</Link>
		)
	}

	return (
		<div
			aria-label={title}
			className={className}>
			{children}
		</div>
	)
}

export const menuItemCommonProps = {
	title: PropTypes.string.isRequired,
	size: PropTypes.string,
	isSelected: PropTypes.bool,
	icon: PropTypes.elementType.isRequired,
	iconSelected: PropTypes.elementType,
	iconActive: PropTypes.elementType,
	iconSelectedActive: PropTypes.elementType,
	animate: PropTypes.oneOf(['pop'])
}

export const menuItemShape = {
	...menuItemCommonProps,
	url: PropTypes.string,
	onClick: PropTypes.func
}

MenuItem.propTypes = {
	...menuItemShape,
	pathname: PropTypes.string.isRequired,
	Link: PropTypes.elementType.isRequired
}

function getPathname(url) {
	let urlPathname = url
	const queryIndex = urlPathname.indexOf('?')
	if (queryIndex >= 0) {
		urlPathname = urlPathname.slice(0, queryIndex)
	}
	const hashIndex = urlPathname.indexOf('#')
	if (hashIndex >= 0) {
		urlPathname = urlPathname.slice(0, hashIndex)
	}
	return urlPathname
}