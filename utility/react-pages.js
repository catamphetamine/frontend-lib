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
		container: container,

		// When the website is open in a web browser
		// hide website content under a "preloading" screen
		// until the application has finished loading.
		// It still "blinks" a bit in development mode
		// because CSS styles in development mode are included
		// not as `*.css` files but dynamically via javascript
		// by adding a `<style/>` DOM element, and that's why
		// in development mode styles are not applied immediately
		// in a web browser. In production mode CSS styles are
		// included as `*.css` files so they are applied immediately.
		showLoadingInitially: true,

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
		console.log(errorPages[String(error.status)] || errorPages['500'])
		redirectToErrorPage(errorPages[String(error.status)] || errorPages['500'])
	}
}