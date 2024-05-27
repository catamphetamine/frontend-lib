import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './Button.css'

/**
 * An unstyled `<button/>`.
 */
let Button = ({
	type = 'button',
	style = undefined,
	className = undefined,
	children,
	...rest
}, ref) => {
	return (
		<button
			{...rest}
			ref={ref}
			type={type}
			style={typeof style === 'string' ? undefined : style}
			className={classNames(
				'Button',
				className,
				typeof style === 'string' && getClassName(style)
			)}>
			{children}
		</button>
	)
}

Button = React.forwardRef(Button)

Button.propTypes = {
	type: PropTypes.oneOf(['button', 'submit']),
	style: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.object
	]),
	className: PropTypes.string,
	// Sometimes there can be empty buttons:
	// for example, round buttons styled via CSS.
	children: PropTypes.node //.isRequired
}

export default Button

function getClassName(style) {
	switch (style) {
		case 'text-multiline':
			return 'Button--text Button--multiline'
		default:
			return `Button--${style}`
	}
}