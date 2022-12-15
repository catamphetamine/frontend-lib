import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { Link } from 'react-pages'
import classNames from 'classnames'

import Button from './ButtonAsync.js'
import PopIconButton from './PopIconButton.js'

import './Menu.css'

export default function Menu({
	className,
	children
}) {
	const pathname = useSelector(({ found }) => found.resolvedMatch.location.pathname)
	return (
		<div className={classNames('menu', className)}>
			{children.map((properties, i) => (
				properties.type === 'separator' ?
					<div key={i} className="menu-separator"/> :
					<MenuItem key={i} {...properties} pathname={pathname}/>
			))}
		</div>
	)
}

const menuItemCommonProps = {
	title: PropTypes.string.isRequired,
	size: PropTypes.string,
	isSelected: PropTypes.bool,
	icon: PropTypes.func.isRequired,
	iconActive: PropTypes.func,
	animate: PropTypes.oneOf(['pop'])
}

const menuItemShape = {
	...menuItemCommonProps,
	url: PropTypes.string,
	onClick: PropTypes.func
}

Menu.propTypes = {
	children: PropTypes.arrayOf(PropTypes.oneOfType([
		PropTypes.shape({
			type: PropTypes.oneOf(['separator']).isRequired
		}),
		PropTypes.shape({
			...menuItemCommonProps,
			url: PropTypes.string
		}),
		PropTypes.shape({
			...menuItemCommonProps,
			onClick: PropTypes.func
		})
	])).isRequired
}

function MenuItem({
	onClick,
	url,
	title,
	icon,
	iconActive,
	wait,
	animate,
	size,
	pathname,
	isSelected,
	className
}) {
	const OutlineIcon = icon
	const FillIcon = iconActive || icon
	if (url) {
		// `url` may contain query parameters.
		isSelected = (isSelected === undefined ? true : isSelected) && pathname === getPathname(url)
	}
	// activeClassName={isSelected ? 'menu-item--selected' : undefined}
	className = classNames(
		className,
		'menu-item',
		size && `menu-item--${size}`,
		isSelected && 'menu-item--selected',
		iconActive && 'menu-item--fill',
		!iconActive && 'menu-item--outline'
	)
	if (animate === 'pop') {
		return (
			<PopIconButton
				value={isSelected}
				onIcon={iconActive}
				offIcon={icon}
				title={title}
				buttonComponent={Button}
				onClick={onClick}
				className={className}
				iconClassName="menu-item__icon menu-item__icon--pop"/>
		)
	}
	const children = (
		<React.Fragment>
			{FillIcon && <FillIcon className="menu-item__icon menu-item__icon--fill"/>}
			<OutlineIcon className="menu-item__icon menu-item__icon--outline"/>
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

MenuItem.propTypes = {
	...menuItemShape,
	pathname: PropTypes.string.isRequired
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