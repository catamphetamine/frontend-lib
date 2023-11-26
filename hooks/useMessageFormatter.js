import { useMemo, useCallback } from 'react'
import IntlMessageFormat from 'intl-messageformat'

import processMessage from './useMessageFormatter.processMessage.js'

/**
 * Returns a message formatter.
 * @param {string|null} messageLabel — Message label.
 * @param {[string]} options.currency — Currency code that will be used when formatting currency amounts. Example: "USD".
 * @return {function} A function that accepts an optional `parameters` object and returns a formatted message.
 */
export default function useMessageFormatter(messageLabel, options) {
	// `messageLabel` is allowed to be `null`: it means "don't output anything".
	// But `messageLabel: undefined` would mean: "message label not present in `messages`",
	// which is considered an error.
	if (messageLabel === undefined) {
		throw new Error('Message not passed to `useMessageFormatter()` hook')
	}

	// Replaces custom syntax with valid "ICU message syntax".
	// https://formatjs.io/docs/core-concepts/icu-syntax/
	const processedMessageLabel = useMemo(() => {
		if (messageLabel) {
			messageLabel = processMessage(messageLabel)
		}
		return messageLabel
	}, [messageLabel])

	const formatter = useMemo(() => {
		// `messageLabel` is allowed to be `null`: it means "don't output anything".
		if (processedMessageLabel === null) {
			// Return a "fake" formatter that returns `null`.
			return {
				format(parameters) {
					return null
				}
			}
		}

		// If `defaultCurrency` is specified, will configure it when creating an `IntlMessageFormat` instance.
		// "Optional object with user defined options for format styles".
		// https://formatjs.io/docs/intl-messageformat#intlmessageformat-constructor
		let formatters
		if (options.currency) {
			formatters = {
				number: {
					CUR: {
						style: 'currency',
						currency: options.currency
					}
				}
			}
		}

		// Create an `IntlMessageFormat` instance.
		// https://formatjs.io/docs/intl-messageformat#intlmessageformat-constructor
		return new IntlMessageFormat(processedMessageLabel, options.locale, formatters)
	}, [
		processedMessageLabel,
		options
	])

	return useCallback((parameters) => {
		return formatter.format(parameters)
	}, [formatter])
}