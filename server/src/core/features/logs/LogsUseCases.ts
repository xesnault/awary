import {User} from "@app/core/features/users/entities/User";
import { ApiKey } from "../projects/entities/ApiKey";
import {Caller} from "../projects/entities/Caller";
import { Project } from "../projects/entities/Project";
import {MissingAuthorization} from "../projects/exceptions/MissingAuthorization";
import {MissingResource} from "../projects/exceptions/MissingResource";
import {ProjectAuthorization, ProjectContext} from "../projects/ProjectContext";
import { ProjectsUseCases } from "../projects/ProjectsUseCases";
import {Log} from "./entities/Log";
import { LogDataOnCreation } from "./entities/LogData";
import { LogsRepository } from "./LogsRepository";

interface LogServiceDependencies {
	projectService: ProjectsUseCases,
	logRepository: LogsRepository,
}

export class LogsUseCases {
	private _projectService: ProjectsUseCases
	private _logRepository: LogsRepository

	constructor(dependencies: LogServiceDependencies) {
		this._projectService = dependencies.projectService
		this._logRepository = dependencies.logRepository
	}

	async addLog(context: ProjectContext, log: LogDataOnCreation): Promise<void> {
		context.enforceAuthorizations([ProjectAuthorization.Write])
		
		await this._logRepository.create(context.project, {
			title: log.title,
			content: log.content,
			tags: log.tags,
		})
	}

	async getLogById(context: ProjectContext, logId: string): Promise<Log> {
		context.enforceAuthorizations([ProjectAuthorization.Read])
		
		const log = await this._logRepository.findLogById(logId)
		if (!log) {
			throw new MissingResource("Log doesn't exist")
		}
		return log;
	}

	async getLogs(context: ProjectContext) {
		context.enforceAuthorizations([ProjectAuthorization.Read])
		
		return await this._logRepository.findLogs(context.project);
	}

	async deleteLog(context: ProjectContext, log: Log) {
		context.enforceAuthorizations([ProjectAuthorization.Write])
		
		await this._logRepository.deleteLog(log);
	}
}
