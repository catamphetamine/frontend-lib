import PropTypes from 'prop-types'

import { picture } from 'social-components-react/components/PropTypes.js'

const {
	shape,
	arrayOf,
	number,
	string,
	bool,
	func,
	object,
	oneOf,
	oneOfType,
	instanceOf,
	elementType
} = PropTypes

// An abstract "ID" type.
const id = oneOfType([string, number])

export const date = instanceOf(Date)

export const personShape = shape({
	id: id.isRequired,
	firstName: string,
	lastName: string,
	middleName: string,
	gender: string,
	birthDate: date,
	country: string,
	state: string,
	city: string
})

export const userShape = shape({
	id: id.isRequired,
	email: string,
	phone: string,
	blockedAt: date,
	blockedBy: id,
	blockedReason: string,
	// person: personShape,
	// account: accountShape.isRequired
})

const accountProperties = {
	id: id.isRequired,
	name: string,
	firstName: string,
	lastName: string,
	idAlias: string,
	picture: picture
}

export const accountShape = shape(accountProperties)

export const accountShapeProfile = shape({
	...accountProperties,
	user: userShape,
	users: arrayOf(userShape),
	description: string,
	backgroundPicture: picture,
	whereabouts: string,
	links: arrayOf(shape({
		url: string.isRequired,
		text: string.isRequired
	}))
})