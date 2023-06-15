import { Feature, AppServices } from "@app/core/Feature";
import { Logger } from "utils/logger";
import {LogFeature} from "../logs";
import {MetricFeature} from "../metrics";
import { ProjectFeature } from "../projects";
import { UserFeature } from "../users";
import {ActivityLoggerService} from "./ActivityLogger";

export type ActivityLoggerFeatureDependencies = {
	projectFeature: ProjectFeature
	logFeature: LogFeature
	metricFeature: MetricFeature
}

export class ActivityLoggerFeature extends Feature {

	public name = "ActivityLogger"
	public service: ActivityLoggerService
	public dependencies: ActivityLoggerFeatureDependencies

	constructor(services: AppServices, dependencies: ActivityLoggerFeatureDependencies) {
		super(services);
		this.dependencies = dependencies
		this.service = new ActivityLoggerService({
			projectFeature: this.dependencies.projectFeature,
			logService: this.dependencies.logFeature.useCases,
			metricFeature: this.dependencies.metricFeature
		})
	}
}
