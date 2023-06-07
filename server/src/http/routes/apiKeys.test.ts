import {expect} from "chai";
import {HttpServer} from "http/HttpServer";
import {buildTestServer, deleteDatabase, setupNewUsers, TestUser} from "testUtils/apiTestHelper";

describe("Api keys", function () {

	let server: HttpServer;
	let users: TestUser[];

	before(async function () {
		await deleteDatabase();
		server = await buildTestServer();
		users = await setupNewUsers(server.server,);
		await users[0].Post("/projects", {name: "p1"});
		await users[0].Post("/projects", {name: "p2"});
		await users[1].Post("/projects", {name: "p3"});
	});

	let project1: any
	let project2: any
	let project3: any

	it ("[User 1] Get 2 projects with no api key", async function() {
		let response = await users[0].Get("/projects");

		expect(response.statusCode).to.equals(200);
		expect(response.body).to.be.a("array");
		expect(response.body).to.have.length(2);

		project1 = response.body[0];
		project2 = response.body[1];

		response = await users[0].Get(`/projects/${project1.id}/apiKeys`);
		expect(response.statusCode).to.equals(200);
		expect(response.body).to.be.a("array");
		expect(response.body).to.have.length(0);

		response = await users[0].Get(`/projects/${project2.id}/apiKeys`);
		expect(response.statusCode).to.equals(200);
		expect(response.body).to.be.a("array");
		expect(response.body).to.have.length(0);
	});

	it ("[User 1] Add Api key to p1", async function() {
		const response = await users[0].Post(`/projects/${project1.id}/apiKeys`, {name: "key1"});

		expect(response.statusCode).to.equals(201);
		expect(response.body).to.be.a("object");
	});

	it ("[User 1] Get 1 api key from p1", async function() {
		let response = await users[0].Get("/projects");

		expect(response.statusCode).to.equals(200);
		expect(response.body).to.be.a("array");
		expect(response.body).to.have.length(2);

		project1 = response.body[0];
		project2 = response.body[1];

		response = await users[0].Get(`/projects/${project1.id}/apiKeys`);
		expect(response.statusCode).to.equals(200);
		expect(response.body).to.be.a("array");
		expect(response.body).to.have.length(1);
		expect(response.body[0].name).to.equals("key1")
		expect(response.body[0].projectId).to.equals(project1.id)
		expect(response.body[0].key).to.not.be.undefined

		response = await users[0].Get(`/projects/${project2.id}/apiKeys`);
		expect(response.statusCode).to.equals(200);
		expect(response.body).to.be.a("array");
		expect(response.body).to.have.length(0);
	});
});
