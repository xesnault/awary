export class FeatureEvent<T> {
	callbacks: ((data: T) => Promise<void>)[] = []

	register(callback: (data: T) => Promise<void>) {
		this.callbacks.push(callback)
	}

	emit(data: T) {
		this.callbacks.forEach(callback => callback(data))
	}
}
