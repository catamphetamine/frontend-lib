import React from 'react'
import PropTypes from 'prop-types'

import './FormActions.css'

export default function FormAction({ children }) {
	return (
		<div className="form__actions">
			{children}
		</div>
	)
}

FormAction.propTypes = {
	children: PropTypes.node.isRequired
}