// import Container from './Container'

export default function getReactPagesConfig({
	transformUrl,
	errorPages,
	...rest
}) {
	return {
		...rest,

    // (optional)
    // When set to `true`, it will automatically find and convert all ISO date strings
    // to `Date` objects in HTTP responses of `application/json` type.
    // I wouldn't advise using that feature because it could potentially lead to a bug
    // when it accidentally mistakes a string for a date.
    // For example, some user could write a comment with the comment content being an ISO date string.
    // If, when fetching that comment from the server, the application automatically finds and converts
    // the comment text from a string to a `Date` instance, it will likely lead to a bug
    // when the application attempts to access any string-specific methods of such `Date` instance,
    // resulting in a possible crash of the application.
    // That's the reason why this flag is set to `false` here.
    // The default value for this flag in `react-pages` is historically `true`.
		findAndConvertIsoDateStringsToDateInstances: false,

		// Transform `errorPages` parameter into an `onError()` function of `react-pages`.
		onLoadError: createOnLoadError(errorPages),

		// Pass all API requests to the API server.
		http: {
			transformUrl: (url, server) => {
				if (transformUrl) {
					const _url = transformUrl(url, server)
					if (_url !== undefined) {
						return _url
					}
				}
				return url
			}
		}
	}
}

// This error handler catches any errors originating from `.load()` functions
// when those're defined on page components.
//
function createOnLoadError(errorPages) {
	return function onLoadError(error, { location, url, redirect, dispatch, useSelector, server }) {
	  console.error('--------------------------------');
	  console.error(`Error while loading "${url}"`);
	  console.error('--------------------------------');
		console.error(error.stack)
		const redirectToErrorPage = (errorPagePath) => {
			const errorPageUrl = `${errorPagePath}?url=${encodeURIComponent(url)}`
			console.log('Redirect to error page:', errorPageUrl);
			// Prevents infinite redirection loop or double redirection.
			// For example, a double redirection in case of `/unauthenticated`.
			// (e.g. when two parallel `Promise`s load inside `load()`
			//  and both get Status 401 HTTP Response).
			// Or, for example, an infinite redirection loop in case of `/error`
			// when there're overall page rendering bugs, etc.
			if (location.pathname !== errorPagePath) {
				redirect(errorPageUrl)
			}
		}
		redirectToErrorPage(errorPages[String(error.status)] || errorPages['500'])
	}
}