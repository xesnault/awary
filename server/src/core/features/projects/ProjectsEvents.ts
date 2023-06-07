import {FeatureEvent} from "@app/core/FeatureEvent";
import {Caller} from "../projects/entities/Caller";
import {Project} from "../projects/entities/Project";

export type onProjectCreatedData = {
	project: Project
	caller: Caller
}

export class ProjectEvents {
	onProjectCreated: FeatureEvent<onProjectCreatedData> = new FeatureEvent()
}
