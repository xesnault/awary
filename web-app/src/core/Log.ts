export interface LogData {
	id: string,
	title: string,
	content: string,
	tags: string[]
	projectId: string
	createdAt: number
	createdBy: string
}

export interface Log extends Readonly<LogData> {}

export class Log {
	
	constructor(data: LogData) {
		Object.assign(this, data);
	}

}
