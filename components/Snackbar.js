import React from 'react'
import { useSelector } from 'react-redux'

import { Snackbar } from 'react-responsive-ui'

// // Webpack still can't learn how to tree-shake.
// import Snackbar from 'react-responsive-ui/modules/Snackbar.js'

import './Snackbar.css'

export default function SnackBar(props) {
	const notification = useSelector(({ notifications }) => notifications.notification)

	return (
		<Snackbar
			{...props}
			value={notification}
		/>
	)
}