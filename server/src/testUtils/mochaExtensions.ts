export function beforeDescribe(fn: () => void) {
	before(function(this: any) {
		this._runnable.parent.suites.forEach((suite: any) => {
			suite.beforeAll(fn)
			const hook = suite._beforeAll.pop()
			suite._beforeAll.unshift(hook)
		})
	})
	
}
