import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Form as Form_, Submit as Submit_ } from 'easy-react-form'
export { Field } from 'easy-react-form'

import './Form.css'

export function Form({
	...rest
}, ref) {
	return (
		<Form_
			ref={ref}
			onError={onError}
			{...rest}
		/>
	)
}

Form = React.forwardRef(Form)

const Submit__ = (props, ref) => (
	<Submit_
		ref={ref}
		type="submit"
		{...props}/>
)

export const Submit = React.forwardRef(Submit__)