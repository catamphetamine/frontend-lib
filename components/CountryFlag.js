import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './CountryFlag.css'

export default function CountryFlag({
	country,
	name,
	flagsPath = 'https://purecatamphetamine.github.io/country-flag-icons/3x2/',
	className
}) {
	// Screen readers will pronounce `alt` but will skip `title` on images.
	return (
		<img
			alt={name}
			title={name}
			className={classNames('CountryFlag', className)}
			src={`${flagsPath}${country}.svg`}
		/>
	)
}

CountryFlag.propTypes = {
	country: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	flagsPath: PropTypes.string,
	className: PropTypes.string
}