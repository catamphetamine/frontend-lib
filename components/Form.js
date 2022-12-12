import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Form as Form_, Submit as Submit_ } from 'easy-react-form'
export { Field } from 'easy-react-form'

import './Form.css'

export const Form = React.forwardRef((props, ref) => (
	<Form_
		ref={ref}
		{...props}
	/>
))

export const Submit = React.forwardRef((props, ref) => (
	<Submit_
		ref={ref}
		type="submit"
		{...props}
	/>
))