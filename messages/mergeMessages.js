/**
 * Deeply merges `from` messages into `to` messages.
 * `null` values in `to` mean "will stay empty".
 * @param  {object} to — messages.
 * @param  {object} from — Default messages from which the missing ones will be copied.
 * @return {object} Mutates `to` and returns it for convenience.
 */
export default function mergeMessages(to, from, ...rest) {
	for (const key of Object.keys(from)) {
		// Skip `null`s.
		// For example, some phrases in English have no prefix
		// while in other languages they do.
		// For example, if a title contains a hyperlinked substring
		// the message has to be split into three substrings:
		// "before", "linked text" and "after".
		// English may not have the "before" part, for example.
		// In such cases it's explicitly marked as `null`.
		if (to[key] === undefined) {
			// Fill in missing keys.
			to[key] = from[key]
		} else if (to[key] === null) {
			// Don't overwrite  `null`s.
		} else if (isObject(to[key]) && isObject(from[key])) {
			// Recurse into nested objects.
			mergeMessages(to[key], from[key])
		}
	}
	if (rest.length > 0) {
		return mergeMessages(to, ...rest)
	}
	return to
}

function isObject(variable) {
	return typeof variable === 'object' && variable !== null;
}