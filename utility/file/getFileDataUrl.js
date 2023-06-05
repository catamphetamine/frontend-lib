// Returns a `Promise<string>`.
export default function getFileDataUrl(file, { contentType } = {}) {
	return new Promise((resolve, reject) => {
		const fileReader = new FileReader()

		fileReader.addEventListener('error', reject)
		fileReader.addEventListener('abort', reject)

		fileReader.addEventListener('load', (event) => {
			let dataUrl = event.target.result
			if (contentType) {
				dataUrl = dataUrl.replace('application/octet-stream', contentType)
			}
			resolve(dataUrl)
		})

		fileReader.readAsDataURL(file)
	})
}