import React, { useCallback, useState, useMemo, useRef } from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'react-responsive-ui'

import Button from './Button.js'

let _onShow

export default function OkCancelModal(props) {
	const [modals, setModals] = useState([])

	useMemo(() => {
		_onShow = (parameters) => {
			return new Promise((resolve) => {
				setModals(modals.concat({
					...parameters,
					onSubmit: resolve,
					id: getNextId()
				}))
			})
		}
	}, [])

	const onAfterClose = useCallback((id) => {
		setModals(modals.filter(modal => modal.id !== id))
	}, [
		modals,
		setModals
	])

	return (
		<>
			{modals.map(({ id, ...parameters }) => (
				<OkCancelModal_
					key={id}
					{...props}
					{...parameters}
					onAfterClose={() => onAfterClose(id)}
				/>
			))}
		</>
	)
}

OkCancelModal.show = _onShow

function OkCancelModal_({
	title,
	content,
	input,
	okLabel,
	cancelLabel,
	yesLabel,
	noLabel,
	onSubmit,
	onAfterClose
}) {
	const [isOpen, setOpen] = useState(true)

	const onSubmit_ = useCallback((value) => {
		onSubmit(value)
		setOpen(false)
	}, [
		onSubmit,
		setOpen
	])

	const onOk = useCallback(() => onSubmit_(true), [onSubmit_])
	const onCancel = useCallback(() => onSubmit_(false), [onSubmit_])

	const noClose = useCallback(() => {}, [])

	return (
		<Modal
			isOpen={isOpen}
			close={noClose}
			afterClose={onAfterClose}>
			{title &&
				<Modal.Title>
					{title}
				</Modal.Title>
			}
			<Modal.Content>
				{content}
			</Modal.Content>
			<Modal.Actions className="form__actions">
				<Button
					style="text"
					onClick={onCancel}
					className="form__action">
					{input ? cancelLabel : noLabel}
				</Button>
				<Button
					onClick={onOk}
					style="fill"
					className="form__action">
					{input ? okLabel : yesLabel}
				</Button>
			</Modal.Actions>
		</Modal>
	)
}

OkCancelModal_.propTypes = {
	// isOpen: PropTypes.bool,
	// close: PropTypes.func.isRequired,
	title: PropTypes.string,
	content: PropTypes.node.isRequired,
	input: PropTypes.bool,
	okLabel: PropTypes.string.isRequired,
	cancelLabel: PropTypes.string.isRequired,
	yesLabel: PropTypes.string.isRequired,
	noLabel: PropTypes.string.isRequired,
	onSubmit: PropTypes.func.isRequired,
	onAfterClose: PropTypes.func.isRequired
}

// https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER
const MAX_SAFE_INTEGER = 9007199254740991
let id = 0
function getNextId() {
	if (id === MAX_SAFE_INTEGER)  {
		id = 0
	}
	id++
	return id
}