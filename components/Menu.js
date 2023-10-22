import React from 'react'
import PropTypes from 'prop-types'
import { useLocation } from 'react-pages'
import classNames from 'classnames'

import MenuItem, { menuItemShape, menuItemCommonProps } from './MenuItem.js'
import MenuSeparator from './MenuSeparator.js'

import './Menu.css'

export default function Menu({
	Link,
	className,
	children
}) {
	const { pathname } = useLocation()

	return (
		<div className={classNames('Menu', className)}>
			{children.map((properties, i) => (
				properties.type === 'separator' ?
					<MenuSeparator key={i}/> :
					<MenuItem key={i} {...properties} pathname={pathname} Link={Link}/>
			))}
		</div>
	)
}

Menu.propTypes = {
	Link: PropTypes.elementType.isRequired,
	className: PropTypes.string,
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