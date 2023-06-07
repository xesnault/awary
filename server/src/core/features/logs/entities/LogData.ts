export interface LogDataOnCreation {
	title: string
	content?: string
	tags?: string[]
}

export interface LogData extends LogDataOnCreation {
	id: string
	projectId: string
	createdAt: number
}
