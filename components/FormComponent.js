import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './FormComponent.css'

export default function FormComponent({
	type,
	className,
	children
}) {
	const Component = type === 'description' ? 'p' : 'div'

	return (
		<Component className={classNames(className, 'FormRow', 'FormComponent', {
			'FormComponent--button': type === 'button',
			'FormComponent--description': type === 'description'
		})}>
			{children}
		</Component>
	)
}

FormComponent.propTypes = {
	type: PropTypes.oneOf(['button', 'description']),
	className: PropTypes.string,
	children: PropTypes.node.isRequired
}