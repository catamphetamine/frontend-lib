// import Container from './Container'

export default function getReactPagesConfig({
	transformUrl,
	errorPages,
	...rest
}) {
	return {
		...rest,

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
			// Prevents infinite redirection loop or double redirection.
			// For example, a double redirection in case of `/unauthenticated`.
			// (e.g. when two parallel `Promise`s load inside `load()`
			//  and both get Status 401 HTTP Response).
			// Or, for example, an infinite redirection loop in case of `/error`
			// when there're overall page rendering bugs, etc.
			if (location.pathname !== errorPagePath) {
				redirect(`${errorPagePath}?url=${encodeURIComponent(url)}`)
			}
		}
		redirectToErrorPage(errorPages[String(error.status)] || errorPages['500'])
	}
}