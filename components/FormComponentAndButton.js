import React from 'react'
import PropTypes from 'prop-types'

import FormComponentsAndButton from './FormComponentsAndButton.js'

export default function FormComponentAndButton({ children }) {
	return (
		<FormComponentsAndButton count={1}>
			{children}
		</FormComponentsAndButton>
	)
}