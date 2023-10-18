import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './FormComponent.css'

export default function FormComponent({
	type,
	children
}) {
	return (
		<div className={classNames('form__component', {
			'form__component--button': type === 'button',
			'form__component--description': type === 'description'
		})}>
			{children}
		</div>
	)
}

FormComponent.propTypes = {
	type: PropTypes.oneOf(['button', 'description']),
	children: PropTypes.node.isRequired
}