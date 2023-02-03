import { useEffect } from 'react'
// import { useMemo } from 'react'
import { throttle } from 'lodash-es'

export default function useOnWindowResize(callback, options) {
	// useMemo(() => {
	// 	if (typeof window === 'undefined') {
	// 		// Server-Side Render. Ignore.
	// 	} else {
	// 		if (options && options.alsoBeforeMount) {
	// 			callback()
	// 		}
	// 	}
	// }, [])

	useEffect(() => {
		if (options && options.alsoAfterMount) {
			callback()
		}
		const onWindowResize = throttle((event) => callback(), 100)
		window.addEventListener('resize', onWindowResize)
		return () => {
			window.removeEventListener('resize', onWindowResize)
		}
	}, [])
}