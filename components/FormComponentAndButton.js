import React from 'react'
import PropTypes from 'prop-types'

import './FormComponentAndButton.css'

export default function FormComponentAndButton({ children }) {
	return (
		<div className="form__component-and-button">
			{children}
		</div>
	)
}

FormComponentAndButton.propTypes = {
	children: PropTypes.node.isRequired
}