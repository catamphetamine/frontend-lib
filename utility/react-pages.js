// import Container from './Container'

export default function getReactPagesConfig({
	reducers,
	routes,
	container,
	transformUrl,
	errorPages,
	...rest
}) {
	return {
		...rest,

		reducers,
		routes,
		container,

		// Transform `errorPages` parameter into an `onError()` function of `react-pages`.
		onError: createOnError(errorPages),

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

function createOnError(errorPages) {
	return function onError(error, { path, url, redirect, dispatch, getState, server }) {
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
			if (path !== errorPagePath) {
				redirect(`${errorPagePath}?url=${encodeURIComponent(url)}`)
			}
		}
		redirectToErrorPage(errorPages[String(error.status)] || errorPages['500'])
	}
}