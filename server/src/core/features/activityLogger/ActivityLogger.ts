import {LogsUseCases} from "../logs/LogsUseCases";
import {MetricFeature} from "../metrics";
import {onMetricCreatedData} from "../metrics/MetricsEvents";
import {ProjectFeature} from "../projects";
import {Caller, SystemCaller} from "../projects/entities/Caller";
import {ProjectContext} from "../projects/ProjectContext";
import {onProjectCreatedData} from "../projects/ProjectsEvents";

interface ActivityLoggerDependencies {
	projectFeature: ProjectFeature
	logService: LogsUseCases,
	metricFeature: MetricFeature,
}

export class ActivityLoggerService {
	private _projectFeature: ProjectFeature
	private _logService: LogsUseCases
	private _metricFeature: MetricFeature
	private _systemCaller = new Caller(new SystemCaller())

	constructor(dependencies: ActivityLoggerDependencies) {
		this._projectFeature = dependencies.projectFeature
		this._logService = dependencies.logService
		this._metricFeature = dependencies.metricFeature

		this._metricFeature.events.onMetricCreated.register(data => this.logMetricCreation(data))
		this._projectFeature.events.onProjectCreated.register(data => this.logProjectCreation(data))
	}

	private async logProjectCreation(data: onProjectCreatedData): Promise<void> {
		const context = new ProjectContext(data.project, this._systemCaller)
		await this._logService.addLog(context, {
			title: `Welcome to your new project: "${data.project.name}"`,
		});
	}

	private async logMetricCreation(data: onMetricCreatedData): Promise<void> {
		const context = new ProjectContext(data.project, this._systemCaller)
		await this._logService.addLog(context, {
			title: `Created metric "${data.metric.name}"`,
		});
	}
}
