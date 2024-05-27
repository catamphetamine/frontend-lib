import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Button from './Button.js'

import './PressedStateButton.css'

function PressedStateButton({
	component: Component = Button,
	pressed,
	link,
	className,
	children,
	...rest
}, ref) {
	const isNativeButton = Component === 'button'
	return (
		<Component
			{...rest}
			ref={ref}
			className={classNames(className, 'PressedStateButton', {
				'PressedStateButton--link': link,
				'PressedStateButton--pressed': pressed
			})}>
			{children}
		</Component>
	)
}

PressedStateButton = React.forwardRef(PressedStateButton)

export default PressedStateButton

PressedStateButton.propTypes = {
	component: PropTypes.elementType,
	pressed: PropTypes.bool,
	link: PropTypes.bool,
	className: PropTypes.string
}