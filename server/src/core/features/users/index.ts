import { Feature, AppServices } from "@app/core/Feature";
import { Logger } from "utils/logger";
import { UsersRepository } from "./UsersRepository";
import { UsersUseCases } from "./UsersUseCases";

/*export type UserFeatureDependencies = {*/

/*}*/

export class UserFeature extends Feature {

	name = "User"
	repository: UsersRepository
	useCases: UsersUseCases

	constructor(services: AppServices, features: object /*UserFeatureDependencies*/) {
		super(services);
		this.repository = new UsersRepository(services.db)
		this.useCases = new UsersUseCases(this.repository)
	}
}
