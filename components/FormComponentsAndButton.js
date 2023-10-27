import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './FormComponentsAndButton.css'

export default function FormComponentsAndButton({
	count,
	ratio,
	smallScreen,
	children
}) {
	return (
		<div className={classNames(
			'FormRow',
			'FormComponentsAndButton',
			`FormComponentsAndButton--${count}`,
			ratio && `FormComponentsAndButton--ratio-${ratio.replaceAll(':', '-')}`,
			smallScreen === false && 'FormComponentsAndButton--exceptSmallScreen'
		)}>
			{children}
		</div>
	)
}

FormComponentsAndButton.propTypes = {
	ratio: PropTypes.oneOf(['2:1:x']),
	count: PropTypes.oneOf([1, 2]).isRequired,
	smallScreen: PropTypes.bool,
	children: PropTypes.node.isRequired
}