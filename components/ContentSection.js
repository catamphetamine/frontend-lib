import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './ContentSection.css'

export function ContentSection({
	padding = true,
	background = false,
	className = undefined,
	children,
	...rest
}) {
	// Margin collapse won't work for cases
	// where content section siblings are flex columns
	// therefore disabling margin collapse for all cases
	// to rule out the confusion.
	return (
		<div {...rest} className={classNames(className, 'ContentSection', {
			// 'ContentSection--noPadding': !padding,
			'ContentSection--background': background
		})}>
			{children}
		</div>
	)
}

ContentSection.propTypes = {
	className: PropTypes.string,
	padding: PropTypes.bool,
	background: PropTypes.bool,
	children: PropTypes.node.isRequired
}

export function ContentSectionHeader({ lite, children }) {
	return (
		<h2 className={classNames('ContentSectionHeader', {
			'ContentSectionHeader--lite': lite
		})}>
			{children}
		</h2>
	)
}

ContentSectionHeader.propTypes = {
	lite: PropTypes.bool,
	className: PropTypes.string,
	children: PropTypes.node.isRequired
}

export function ContentSections({ className, children }) {
	return (
		<div className={classNames('ContentSections', className)}>
			{children}
		</div>
	)
}

ContentSections.propTypes = {
	className: PropTypes.string,
	children: PropTypes.node.isRequired
}

export function ContentSectionDescription({
	marginBottom,
	marginTop,
	children
}) {
	return (
		<p className={classNames(
			'ContentSectionDescription',
			marginBottom && `ContentSectionDescription--marginBottom${capitalizeFirstLetter(marginBottom)}`,
			marginTop && `ContentSectionDescription--marginTop${capitalizeFirstLetter(marginTop)}`
		)}>
			{children}
		</p>
	)
}

ContentSectionDescription.propTypes = {
	marginBottom: PropTypes.oneOf(['medium', 'large']),
	marginTop: PropTypes.oneOf(['medium', 'large']),
	children: PropTypes.node.isRequired
}

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1)
}