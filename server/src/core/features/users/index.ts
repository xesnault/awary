import { Feature, AppServices } from "@app/core/Feature";
import { Logger } from "utils/logger";
import { UserEvents } from "./UsersEvents";
import { UsersRepository } from "./UsersRepository";
import { UsersUseCases } from "./UsersUseCases";

/*export type UserFeatureDependencies = {*/

/*}*/

export class UserFeature extends Feature {

	name = "User"
	repository: UsersRepository
	useCases: UsersUseCases
	events: UserEvents

	constructor(services: AppServices, features: object /*UserFeatureDependencies*/) {
		super(services);
		this.repository = new UsersRepository(services.db)
		this.events = new UserEvents()
		this.useCases = new UsersUseCases({repository: this.repository, events: this.events})
	}
}
