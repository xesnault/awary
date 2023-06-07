import {UserData} from "./entities/UserData";
import {Collection, Db, ObjectId } from "mongodb";

export class UsersRepository {

	private _users: Collection<Omit<UserData, "id">>

	constructor(db: Db) {
		this._users = db.collection("users")
	}

	async createUser(data: Omit<UserData, "id">): Promise<void> {
		await this._users.insertOne(data);
	}

	async findUserById(id: string): Promise<UserData | null> {
		const userData = await this._users.findOne({_id: new ObjectId(id)});
		if (!userData) {
			return null;
		}
		return {...userData, id: userData._id.toString()};
	}

	async findUserByEmail(email: string): Promise<UserData | null> {
		const userData = await this._users.findOne({email});
		if (!userData) {
			return null;
		}
		return {...userData, id: userData._id.toString()};
	}

	async findAll(): Promise<UserData[]> {
		const userData = await this._users.find().toArray();
		return userData.map(data => ({...data, id: data._id.toString()}));
	}

	async count(): Promise<number> {
		return this._users.countDocuments();
	}
}
