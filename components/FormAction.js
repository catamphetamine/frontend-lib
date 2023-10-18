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
			className: classNames(children.props.className, 'form__action', {
				'form__action--inline': inline
			})
		}
	)

	// The following didn't work because `form__action` has a fixed `height` property
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