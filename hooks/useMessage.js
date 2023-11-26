import { useMemo } from 'react'

import useMessageFormatter from './useMessageFormatter.js'

/**
 * Returns a formatted message.
 * @param {string|null} messageLabel — Message label.
 * @param {[object]} parameters — Message label parameters.
 * @param {[string]} options.currency — Currency code that will be used when formatting currency amounts. Example: "USD".
 * @return {string|null}
 */
export default function useMessage(messageLabel, parameters, options) {
	const messageFormatter = useMessageFormatter(messageLabel, options)

	const message = useMemo(() => {
		return messageFormatter(parameters)
	}, [
		messageFormatter,
		parameters
	])

	return message
}