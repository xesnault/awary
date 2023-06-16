import {FeatureEvent} from "@app/core/FeatureEvent";
import {Caller} from "../projects/entities/Caller";
import {Project} from "../projects/entities/Project";
import { User } from "./entities";

export type onUserCreatedData = {
	user: User
	caller: Caller
}

export class UserEvents {
	onMetricCreated: FeatureEvent<onUserCreatedData> = new FeatureEvent()
}
