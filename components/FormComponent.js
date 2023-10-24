import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './FormComponent.css'

export default function FormComponent({
	type,
	className,
	children
}) {
	return (
		<div className={classNames(className, 'form__row', 'form__component', {
			'form__component--button': type === 'button',
			'form__component--description': type === 'description'
		})}>
			{children}
		</div>
	)
}

FormComponent.propTypes = {
	type: PropTypes.oneOf(['button', 'description']),
	className: PropTypes.string,
	children: PropTypes.node.isRequired
}