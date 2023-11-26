import mergeMessages from './mergeMessages.js'
import reportError from '../utility/reportError.js'

export default class Messages {
	constructor(messages, { defaultLanguage }) {
		this.messages = messages
		this.defaultLanguage = defaultLanguage

		// Validate `defaultLanguage`.
		if (!messages[defaultLanguage]) {
			throw new Error(`Default language "${defaultLanguage}" not found in \`messages\``)
		}

		// Add missing messages from default language messages.
		for (const language of Object.keys(messages)) {
			if (language !== defaultLanguage) {
				mergeMessages(messages[language], messages[defaultLanguage])
			}
		}

		// Create a map of language names for the messages.
		this.languageNames = Object.keys(messages).reduce((all, language) => ({
			...all,
			[language]: messages[language].languageName || language
		}), {})
	}

	/**
	 * Does it have messages for the language?
	 * @param  {string} language
	 * @return {boolean}
	 */
	isSupportedLanguage = (language) => {
		return this.messages.hasOwnProperty(language)
	}

	/**
	 * Returns messages for the language.
	 * @param  {string} language
	 * @return {object}
	 */
	getMessages = (language) => {
		if (this.messages.hasOwnProperty(language)) {
			return this.messages[language]
		}
		// Report the error to `sentry.io`.
		reportError(new Error(`Unsupported language: ${language}`))
		return this.messages[this.defaultLanguage]
	}

	/**
	 * Returns a map of language names for the messages.
	 * @return {object}
	 */
	getLanguageNames = () => {
		return this.languageNames
	}
}