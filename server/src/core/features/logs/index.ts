import { Feature, AppServices } from "@app/core/Feature";
import { Logger } from "utils/logger";
import { ProjectFeature } from "../projects";
import { UserFeature } from "../users";
import { LogsRepository } from "./LogsRepository";
import { LogsUseCases } from "./LogsUseCases";

export type LogFeatureDependencies = {
	userFeature: UserFeature
	projectFeature: ProjectFeature
}

export class LogFeature extends Feature {

	name = "Log"
	repository: LogsRepository
	service: LogsUseCases
	dependencies: LogFeatureDependencies

	constructor(services: AppServices, dependencies: LogFeatureDependencies) {
		super(services);
		this.repository = new LogsRepository(services.db)
		this.dependencies = dependencies
		this.service = new LogsUseCases({
			projectService: this.dependencies.projectFeature.service,
			logRepository: this.repository
		})
	}
}
