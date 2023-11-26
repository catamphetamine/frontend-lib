export default function processMessage(messageLabel) {
	// Replaces `{parameterName, exists {...}}` syntax with
	// `{parameterName, select, undefined {} null {} other {...}}`.
	//
	// `/g` regular expressions have to be re-created every time
	// because otherwise they'd keep their "start index" state
	// and wouldn't match in subsequent cases in case of being reused.
	// Alternatively, one could manually set `regExp.lastIndex = 0`
	// every time but that code looks prone to accidental bugs.
	const EXISTS_REG_EXP = /{([^,{}]+),\s*exists\s*{/g
	messageLabel = messageLabel.replace(EXISTS_REG_EXP, '{$1, select, undefined {} null {} other {')

	// Replaces `{parameterName, missing {...}}` syntax with
	// `{parameterName, select, undefined {...} null {...} other {}}`.
	while (true) {
		// This regular expression should not be a `/g` one
		// for this `while` loop to work correctly.
		// If it was just `string.replace(regExp, ...)` then it could be a `/g` one.
		// But since it's a manual `while(true)` loop, it shouldn't be a `/g` one.
		//
		// Calling `string.search(regExp)` doesn't seem to result in the `regExp` changing its `.lastIndex`.
		// Still, this code prefers to re-create the `regExp` every time, just in case.
		//
		const MISSING_REG_EXP = /{([^,{}]+),\s*missing\s*{/

		const missingSyntaxFoundPosition = messageLabel.search(MISSING_REG_EXP)
		if (missingSyntaxFoundPosition < 0) {
			break
		}

		// The contents inside the curly braces.
		// Default value is used as a fallback in case of invalid message syntax.
		let contents = ''

		// Get the contents inside the curly braces.
		const contentsStartCurlyBracePosition = messageLabel.indexOf('{', missingSyntaxFoundPosition + 1)
		let contentsStartCurlyBracePositionNegative
		let rest
		if (contentsStartCurlyBracePosition >= 0) {
			contentsStartCurlyBracePositionNegative = -1 * (messageLabel.length - contentsStartCurlyBracePosition)
			const contentsEndCurlyBracePosition = findClosingCurlyBracePosition(messageLabel, contentsStartCurlyBracePosition)
			if (contentsEndCurlyBracePosition >= 0) {
				contents = messageLabel.slice(contentsStartCurlyBracePosition + '{'.length, contentsEndCurlyBracePosition)
				rest = messageLabel.slice(contentsEndCurlyBracePosition + '}'.length)
			}
		}

		messageLabel = messageLabel.replace(MISSING_REG_EXP, (match, matchedGroup1) => {
			return '{' + matchedGroup1 + ', select, undefined {' + contents + '} null {' + contents + '} other {'
		})

		if (contentsStartCurlyBracePositionNegative !== undefined) {
			messageLabel = messageLabel.slice(0, contentsStartCurlyBracePositionNegative) + '{}' + rest
		}
	}

	return messageLabel
}

function findClosingCurlyBracePosition(text, openingCurlyBracePosition) {
	let counter = 0
	let i = openingCurlyBracePosition
	while (i < text.length) {
		if (text[i] === '{') {
			counter++
		} else if (text[i] === '}') {
			counter--
		}
		if (counter === 0) {
			return i
		}
		i++
	}
	return -1
}