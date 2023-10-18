import React from 'react'
import PropTypes from 'prop-types'

import './FormLabel.css'

export default function FormLabel({ children }) {
	return (
		<div className="form__label">
			{children}
		</div>
	)
}

FormLabel.propTypes = {
	children: PropTypes.node.isRequired
}