import getFileDataUrl from './getFileDataUrl.js'

// Generates a preview image for a `File` (a picture or a video).
// Returns a `Promise` of a preview image URL.
export default function getFilePreviewImage(file) {
	const [type, subtype] = file.type.split('/')

	if (type !== 'image' && type !== 'video' && type !== 'audio') {
		throw new Error(`Unsupported file type: ${file.type}`)
	}

	return new Promise((resolve, reject) => {
		let inProgress = true

		const timeoutTimer = setTimeout(() => {
			onError(new Error('Timeout'))
		}, TIMEOUT)

		const elements = []

		const createElement = (tagName) => {
			const element = document.createElement(tagName)
			elements.push(element)
			return element
		}

		const cleanUp = () => {
			inProgress = false
			for (const element of elements) {
				removeElement(element)
			}
			clearTimeout(timeoutTimer)
		}

		const onError = (error) => {
			if (inProgress) {
				cleanUp()
				reject(error)
			}
		}

		const onResult = (result) => {
			if (inProgress) {
				cleanUp()
				resolve(result)
			}
		}

		getFileDataUrl(file).then((dataUrl) => {
			if (type === 'image') {
				const image = new Image()

				image.onerror = (event) => {
					const url = event.path && event.path[0] && event.path[0].src
					if (url) {
						console.error(`Image not found: ${url}`)
					}
					const error = new Error('IMAGE_NOT_FOUND')
					error.url = dataUrl
					error.event = event
					onError(error)
				}

				image.onload = () => {
					onResult({
						type: file.type,
						size: file.size,
						url: image.src,
						width: image.width,
						height: image.height
					})
				}

				image.src = dataUrl
			} else if (type === 'video') {
				// https://stackoverflow.com/questions/36883037/generate-a-thumbnail-snapshot-of-a-video-file-selected-by-a-file-input-at-a-spec/36883038#36883038
				const videoElement = createElement('video')
				const canvasElement = createElement('canvas')

				videoElement.addEventListener('error', (error) => {
					removeElement(videoElement)
					removeElement(canvasElement)
					onError(error)
				})

				const onVideoLoaded = () => {
					const onVideoSeeked = () => {
						canvasElement.height = videoElement.videoHeight
						canvasElement.width = videoElement.videoWidth
						canvasElement.getContext('2d').drawImage(videoElement, 0, 0)

						removeElement(videoElement)
						removeElement(canvasElement)

						onResult({
							type: file.type,
							size: file.size,
							url: dataUrl,
							duration: videoElement.duration,
							width: videoElement.videoWidth,
							height: videoElement.videoHeight,
							picture: {
								// https://stackoverflow.com/questions/28544336/what-are-the-possible-data-types-for-canvas-todataurl-function
								type: 'image/png',
								url: canvasElement.toDataURL('image/png'),
								width: videoElement.videoWidth,
								height: videoElement.videoHeight
							}
						})
					}

					// https://stackoverflow.com/questions/3393686/only-fire-an-event-once
					videoElement.addEventListener('seeked', onVideoSeeked, { once: true })

					const videoPreviewTime = 0 // in seconds
					videoElement.currentTime = videoPreviewTime
				}

				let videoLoadEventsCount = 0
				const onVideoLoadEvent = () => {
					videoLoadEventsCount++
					if (videoLoadEventsCount === VIDEO_LOAD_EVENTS.length) {
						onVideoLoaded()
					}
				}

				// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video#events
				const VIDEO_LOAD_EVENTS = [
					'loadedmetadata',
					'loadeddata',
					'suspend'
				]

				for (const event of VIDEO_LOAD_EVENTS) {
					videoElement.addEventListener(event, onVideoLoadEvent)
				}

				videoElement.addEventListener('error', onError)

				setHiddenElementStyle(canvasElement)
				document.body.appendChild(canvasElement)

				setHiddenElementStyle(videoElement)
				videoElement.setAttribute('muted', 'true')
				document.body.appendChild(videoElement)

				videoElement.src = dataUrl
			} else if (type === 'audio') {
				const audioElement = document.createElement('audio')

				audioElement.addEventListener('loadedmetadata', (error) => {
					onResult({
						type: file.type,
						title: file.name,
						size: file.size,
						url: dataUrl,
						duration: audioElement.duration
					})
				})

				audioElement.addEventListener('error', onError)

				audioElement.src = dataUrl
			} else {
				onError(new Error(`Unsupported file type: ${file.type}`))
			}
		}, onError)
	})
}

function setHiddenElementStyle(element) {
	element.style.display = 'block'

	element.style.position = 'fixed'
	element.style.left = '0px'
	element.style.top = '0px'
	element.style.zIndex = '-1'

	element.style.height = '1px'
	element.style.width = '1px'

	element.style.objectFit = 'contain'
}

function removeElement(element) {
	if (element.parentNode) {
		element.parentNode.removeChild(element)
	}
}

const TIMEOUT = 10 * 1000 // in milliseconds