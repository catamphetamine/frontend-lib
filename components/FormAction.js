import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './FormAction.css'

export default function FormAction({
	inline,
	children
}) {
	return React.cloneElement(
		React.Children.only(children),
		{
			className: classNames(children.props.className, 'FormRow', 'FormAction', {
				'FormAction--inline': inline
			})
		}
	)

	// The following didn't work because `FormAction` has a fixed `height` property
	// and the `children` didn't stretch vertically to that height.
	//
	// return (
	// 	<div className={classNames(...)}>
	// 		{React.Children.only(children)}
	// 	</div>
	// )
}

FormAction.propTypes = {
	inline: PropTypes.bool,
	children: PropTypes.node.isRequired
}