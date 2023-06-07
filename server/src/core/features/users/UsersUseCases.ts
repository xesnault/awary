import {User} from "./entities/User";
import {UsersRepository} from "./UsersRepository";
import argon2 from "argon2";
import {AuthenticationFailed} from "./exceptions/AuthenticationFailed";
import {getAccountCreationLimit, isRegistrationEnabled} from "./utils";
import {SignupFailed, SignupFailedCode} from "./exceptions/SignupFailed";

export class UsersUseCases {
	constructor(private _repository: UsersRepository) {
	}

	// [TODO] This function doesn't really belong here, make a new feature (ex: reporter)
	async getGlobalInfo(adminToken: string) {
		if (adminToken !== process.env.API_ADMIN_AUTHORIZATION) {
			return null;
		}

		return {
			users: (await this._repository.findAll()).map(user => ({
				...user,
				createdAt: new Date(user.createdAt),
				password: undefined
			}))
		}
	}

	async signupUser(email: string, password: string, adminToken?: string) {
		if (!isRegistrationEnabled(adminToken)) {
			throw new SignupFailed("User signup not enabled", SignupFailedCode.NotEnabled)
		}

		if (await this._repository.count() >= getAccountCreationLimit()) {
			throw new SignupFailed(`Maximum account limit (${getAccountCreationLimit()}) reached`, SignupFailedCode.LimitReached)
		}

		const user = await this._repository.findUserByEmail(email);
		if (user) {
			throw new SignupFailed("Email is already taken", SignupFailedCode.EmailAlreadyInUse)
		}

		const passwordHash = await argon2.hash(password);
		await this._repository.createUser({
			email,
			password: passwordHash,
			createdAt: Date.now(),
			updatedAt: Date.now()
		});

		/*if (!process.env.TEST) {*/
		/*await mailService.SendMail(*/
		/*`Confirm your email on Cronarium : https://my.awary.com/signup-email-confirmation?email=${email}&emailConfirmationToken=${createdUser?.GetDocument().emailConfirmationToken}`,*/
		/*[email]);*/
		/*}*/
	}

	async logUser(email: string, password: string): Promise<User> {
		const userData = await this._repository.findUserByEmail(email);
		if (!userData) {
			throw new AuthenticationFailed("Wrong email or password")
		}
		const user = new User(userData);
		if (!await user.verifyPassword(password)) {
			throw new AuthenticationFailed("Wrong email or password")
		}
		return user;
	}

	async getUserByEmail(email: string): Promise<User | null> {
		const userData = await this._repository.findUserByEmail(email);
		if (!userData) {
			return null;
		}
		return new User(userData);
	}
}
