import mergeMessages from './mergeMessages.js'

export default class Messages {
	constructor(messages, defaultLanguage) {
		this.messages = messages
		this.defaultLanguage = defaultLanguage
		// Add missing messages from default language messages.
		for (const language of Object.keys(messages)) {
			if (language !== defaultLanguage) {
				mergeMessages(messages[language], messages[defaultLanguage])
			}
		}
		this.languageNames = Object.keys(messages).reduce((all, language) => ({
			...all,
			[language]: messages[language].languageName || language
		}), {})
	}
	isSupportedLanguage = (language) => {
		return this.messages.hasOwnProperty(language)
	}
	getMessages = (language) => {
		if (this.messages.hasOwnProperty(language)) {
			return this.messages[language]
		}
		// Report the error to `sentry.io`.
		setTimeout(() => {
			throw new Error(`Unsupported language: ${language}`)
		}, 0)
		return this.messages[this.defaultLanguage]
	}
	getLanguageNames = () => {
		return this.languageNames
	}
}