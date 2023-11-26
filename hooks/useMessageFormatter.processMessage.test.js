import processMessage from './useMessageFormatter.processMessage.js'

describe('hooks/useMessageFormatter.processMessage.js', () => {
	it('should replace `exists` message syntax', () => {
		processMessage('Abc {parameterName, exists {...}} def').should.equal(
			'Abc {parameterName, select, undefined {} null {} other {...}} def'
		)
	})

	it('should replace `exists` message syntax with nested contents', () => {
		processMessage('Abc {parameterName, exists {some {otherParameterName}}} def').should.equal(
			'Abc {parameterName, select, undefined {} null {} other {some {otherParameterName}}} def'
		)
	})

	it('should replace `exists` message syntax with nested contents and multiple occurences', () => {
		processMessage('Abc {parameterName, exists {some {otherParameterName}}} def {parameterName, exists {some {otherParameterName}}} ghi').should.equal(
			'Abc {parameterName, select, undefined {} null {} other {some {otherParameterName}}} def {parameterName, select, undefined {} null {} other {some {otherParameterName}}} ghi'
		)
	})

	it('should replace `missing` message syntax', () => {
		processMessage('Abc {parameterName, missing {...}} def').should.equal(
			'Abc {parameterName, select, undefined {...} null {...} other {}} def'
		)
	})

	it('should replace `missing` message syntax with nested contents', () => {
		processMessage('Abc {parameterName, missing {some {otherParameterName}}} def').should.equal(
			'Abc {parameterName, select, undefined {some {otherParameterName}} null {some {otherParameterName}} other {}} def'
		)
	})

	it('should replace `missing` message syntax with nested contents and multiple occurences', () => {
		processMessage('Abc {parameterName, missing {some {otherParameterName}}} def {parameterName, missing {some {otherParameterName}}} ghi').should.equal(
			'Abc {parameterName, select, undefined {some {otherParameterName}} null {some {otherParameterName}} other {}} def {parameterName, select, undefined {some {otherParameterName}} null {some {otherParameterName}} other {}} ghi'
		)
	})
})