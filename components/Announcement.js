import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Close from '../icons/close-thicker.svg'

import { Content } from 'social-components-react/components/PostContent.js'
import Button from './Button.js'

import './Announcement.css'

export default function Announcement({
	onClose,
	closeLabel,
	onClick,
	buttonLabel,
	announcement,
	children
}) {
	return (
		<div className={classNames('announcement', {
			'announcement--button': onClick
		})}>
			<div className="announcement__content">
				<Content>
					{announcement ? announcement.content : children}
				</Content>
			</div>

			{onClose &&
				<Button
					onClick={onClose}
					title={closeLabel}
					className="announcement__close">
					<Close className="announcement__close-icon"/>
				</Button>
			}

			{onClick &&
				<Button
					style="fill"
					onClick={onClick}>
					{buttonLabel}
				</Button>
			}
		</div>
	)
}

const contentPropType = PropTypes.oneOfType([
	PropTypes.arrayOf(PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.object
	])),
	PropTypes.string
])

export const announcementPropType = PropTypes.shape({
	date: PropTypes.string.isRequired,
	content: contentPropType.isRequired
})

Announcement.propTypes = {
	onClose: PropTypes.func,
	closeLabel: PropTypes.string,
	onClick: PropTypes.func,
	buttonLabel: PropTypes.string,
	announcement: announcementPropType,
	children: contentPropType
}